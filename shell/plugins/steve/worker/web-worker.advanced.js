/**
 * Advanced Worker is enabled by performance setting
 * relocates cluster resource sockets off the UI thread and into a webworker
 */

import { SCHEMA, COUNT } from '@shell/config/types';
import ResourceWatcher, { watchKeyFromMessage } from '@shell/plugins/steve/resourceWatcher';
import { EVENT_MESSAGE, EVENT_CONNECT_ERROR, EVENT_DISCONNECT_ERROR } from '@shell/utils/socket';
import { normalizeType, keyFieldFor } from '@shell/plugins/dashboard-store/normalize';
import { addSchemaIndexFields } from '@shell/plugins/steve/schema.utils';
import cacheClasses from '@shell/plugins/steve/caches';
import SteveApiClient from '~/shell/plugins/steve/api/client';

const caches = {};

const state = {
  config:       {},
  watcher:      undefined,
  api:          undefined,
  store:        '', // Store name
  /**
   * Store `watch`/`unwatch` events to process when the socket is created
   */
  watcherQueue: [],
  apiQueue:     [],
  batchChanges: {},
  debugWorker:  false
};

const trace = (...args) => {
  state.debugWorker && console.info('Advanced Worker:', ...args); // eslint-disable-line no-console
};

trace('created');

const makeResourceProps = (msg) => {
  const { resourceType, data: { type: rawType }, data } = msg;
  const eitherType = resourceType || rawType;
  const type = normalizeType(eitherType === 'counts' ? COUNT : eitherType);
  const keyField = keyFieldFor(type);

  if ( type === SCHEMA ) {
    addSchemaIndexFields(data);
  }

  return {
    type,
    id: data[keyField],
    data
  };
};

/**
 * Pass the EVENT_CONNECT_ERROR / EVENT_DISCONNECT_ERROR back to the UI thread
 */
const handleConnectionError = (eventType, event, watcher) => {
  trace('createWatcher', eventType, event);
  self.postMessage({
    [eventType]: {
      type:       event.type,
      detail:     event.detail,
      srcElement: {
        disconnectedAt: watcher.disconnectedAt,
        url:            watcher.url,
      }
    }
  });
};

/**
 * Remove any pending messages related to this resource from the queue
 */
const removeFromWatcherQueue = (watchKey) => {
  state.watcherQueue = state.watcherQueue.filter((workerMessage) => {
    const [, msg] = Object.entries(workerMessage)[0];
    const workerMessageWatchKey = watchKeyFromMessage(msg);

    return watchKey !== workerMessageWatchKey;
  });
};

/**
 * Creates a resourceCache with the appropriate type
 */

const resourceCache = (type, resourceGetter) => {
  const CacheClass = cacheClasses[`${ type }Cache`] || cacheClasses.resourceCache;

  return new CacheClass(type, resourceGetter);
};

/**
 * These are things that we do when we get a message from the UI thread
 */
const workerActions = {
  createApi: () => {
    if (!state.api) {
      // the apiClient can only exist after schemas are loaded so we build it here.
      state.api = new SteveApiClient(state.config, { updateCache: workerActions.updateCache });
      if (!caches[SCHEMA]) {
        state.api.request({ type: SCHEMA }) // TODO: RC DISCUSS this duplicates dashboard-store actions `loadSchema`, or is it kicked off by it? what happens to spoofed schemas? feels like we should just add stuff to queue here and flush when `loadSchemas` message is received
          .then((res) => {
            // workerActions.updateCache(res.data);
            // TODO: RC how often is loadWorkerMethods run?
            state.api.loadWorkerMethods({
              getSchema: (id) => {
                return caches[SCHEMA].getSchema(id);
              }
            });
            for (const [resourceKey, resourceCache] of Object.entries(caches)) {
              resourceCache.loadWorkerMethods({ resourceGetter: params => state.api?.request({ ...params, type: resourceKey }) });
            }

            workerActions.flushApiQueue(); // TODO: RC test this stuff
          });
      }
    }
  },
  createWatcher: (metadata) => {
    trace('createWatcher', metadata);

    const { connectionMetadata, maxTries } = metadata;
    const { url, csrf } = state.config;

    if (!state.watcher) {
      const watcherUrl = `${ url }/subscribe`;

      state.watcher = new ResourceWatcher(watcherUrl, true, null, null, maxTries, csrf);

      state.watcher.addEventListener(EVENT_MESSAGE, (e) => {
        const event = e.detail;

        if (event.data) {
          const msg = JSON.parse(event.data);

          if (msg.name) {
            if (resourceWatcherActions[msg.name]) {
              resourceWatcherActions[msg.name](msg);
            } else {
              resourceWatcherActions.dispatch(msg);
            }
          }
        }
      });

      state.watcher.addEventListener(EVENT_CONNECT_ERROR, (e) => {
        handleConnectionError(EVENT_CONNECT_ERROR, e, state.watcher);
      });

      state.watcher.addEventListener(EVENT_DISCONNECT_ERROR, (e) => {
        handleConnectionError(EVENT_DISCONNECT_ERROR, e, state.watcher);
      });

      state.watcher.setDebug(state.debugWorker);

      state.watcher.connect(connectionMetadata);

      // Flush the watcherQueue
      workerActions.flushWatcherQueue();
    }
  },
  waitingForResponse: (request) => {
    if (!caches[SCHEMA]) {
      state.apiQueue.push({ waitingForResponse: request });

      return;
    }
    const { params, requestHash } = request;

    workerActions.request(params, response => self.postMessage({ awaitedResponse: { response, requestHash } }));
  },
  request: (params, resolver = () => {}) => {
    const {
      type, namespace, id, filter, sortBy, sortOrder, limit
    } = params;

    if (!caches[type]) {
      state.api.request(params)
        .then((res) => {
          resolver(res);
        });
    } else {
      const a = caches[type].find({
        type, namespace, id, filter, sortBy, sortOrder, limit
      });

      if (!a) {
        console.warn('ww: advanced: request 2', type, cache[type]);

        debugger;
        caches[type].find({
          type, namespace, id, filter, sortBy, sortOrder, limit
        });
      }

      a.then((res) => {
        resolver(res);
      });
    }
  },
  /**
   * @param {[]} collection
   * Accepts an array of JSON objects representing resources
   * types the array and constructs a cache if none exists and then loads each resource in the array into the cache
   */
  updateCache: (payload, detail = false) => {
    const rawResources = detail ? [payload] : payload;

    if (payload?.length === 0) {
      return [];
    }
    const rawType = rawResources[0].type;

    const type = normalizeType(rawType === 'counts' ? COUNT : rawType);

    if (!caches[type]) {
      caches[type] = resourceCache(type, params => state.api?.request({ ...params, type }));
    }

    return caches[type].load(rawResources, detail);
  },
  flushWatcherQueue: () => {
    while (state.watcherQueue.length > 0) {
      trace('createWatcher', 'flushing watcherQueue', state.watcherQueue);

      const workerMessage = state.watcherQueue.shift();
      const [action, msg] = Object.entries(workerMessage)[0];

      if (workerActions[action]) {
        workerActions[action](msg);
      } else {
        // debugger;
        console.warn('no associated action for:', action); // eslint-disable-line no-console
      }
    }
  },

  // TODO: RC make sure we disgard any request relating to forgotting types??
  flushApiQueue: () => {
    while (state.apiQueue.length > 0) {
      trace('createApi', 'flushing apiQueue', state.apiQueue);

      const workerMessage = state.apiQueue.shift();
      const [action, msg] = Object.entries(workerMessage)[0];

      if (workerActions[action]) {
        workerActions[action](msg);
      } else {
        debugger;
        console.warn('no associated action for:', action); // eslint-disable-line no-console
      }
    }
  },
  configure: (config) => {
    state.config = config;
  },
  watch: (msg) => {
    trace('watch', msg);

    const watchKey = watchKeyFromMessage(msg);

    if (msg.stop) {
      workerActions.unwatch(watchKey);

      return;
    }

    // If socket is in error don't try to watch.... unless we `force` it
    if (!msg.force && !!state.watcher?.watches[watchKey]?.error) {
      return;
    }

    if (!state.watcher) {
      state.watcherQueue.push({ watch: msg });

      return;
    }

    const {
      resourceType,
      namespace,
      id,
      selector,
      resourceVersion
    } = msg;

    const resourceVersionTime = resourceVersion ? Date.now() : undefined;
    const skipResourceVersion = [SCHEMA, COUNT].includes(resourceType);

    const watchObject = {
      resourceType,
      id,
      namespace,
      selector
    };

    state.watcher.watch(watchKey, resourceVersion, resourceVersionTime, watchObject, skipResourceVersion);
  },
  unwatch: (watchKey) => {
    trace('unwatch', watchKey);

    removeFromWatcherQueue(watchKey);

    if (!state.watcher) {
      return;
    }

    state.watcher.unwatch(watchKey);
  },
  initWorker: ({ storeName }) => {
    trace('initWorker', storeName);

    state.store = storeName;
  },
  destroyWorker: () => {
    trace('destroyWorker');

    clearInterval(maintenanceInterval);

    function destroyWorkerComplete() {
      delete self.onmessage;
      self.postMessage({ destroyWorker: true }); // we're only passing the boolean here because the key needs to be something truthy to ensure it's passed on the object.
    }

    // disconnect takes a callback which we'll use to close the webworker
    if (state.watcher) {
      state.watcher?.disconnect().then(destroyWorkerComplete);
    } else {
      destroyWorkerComplete();
    }
  },
  toggleDebug: ({ on }) => {
    state.debugWorker = !!on;
    state.watcher.setDebug(!!on);
  },
  updateBatch(type, id, change) {
    if (!state.batchChanges[type]) {
      state.batchChanges[type] = {};
    }
    state.batchChanges[type][id] = change;
  },
  sendBatch(requestHash) {
    if (Object.keys(state.batchChanges).length) {
      const batchPayload = { batchChanges: state.batchChanges };

      if (requestHash) {
        self.postMessage({ awaitedResponse: { ...batchPayload, requestHash } });
      } else {
        self.postMessage(batchPayload);
      }
      state.batchChanges = {};
    }
  }
};

/**
 * These are things that we do when we get a message from the resourceWatcher
 */
const resourceWatcherActions = {
  'resource.change': (msg) => {
    const { type, id, data } = makeResourceProps(msg);

    if (!caches[type]) {
      caches[type] = resourceCache(type); //  TODO: RC
    }

    caches[type].change(data, () => workerActions.updateBatch(type, id, data));
  },
  // ToDo: SM create is functionally identical to change in the cache but the worker isn't supposed to know that hence the near-duplicate code
  'resource.create': (msg) => {
    const { type, id, data } = makeResourceProps(msg);

    if (!caches[type]) {
      caches[type] = resourceCache(type);
    }

    caches[type].create(data, () => workerActions.updateBatch(type, id, data));
  },
  'resource.start': (msg) => {
    // State is handled in the resourceWatcher, no need to bubble out to UI thread
  },
  'resource.remove': (msg) => {
    const { type, id } = makeResourceProps(msg);

    if (!caches[type]) {
      caches[type] = resourceCache(type);
    }

    caches[type].remove(id, () => workerActions.updateBatch(type, id, {}));
  },
  'resource.stop': (msg) => {
    // State is handled in the resourceWatcher, no need to bubble out to UI thread
    const watchKey = watchKeyFromMessage(msg);

    removeFromWatcherQueue(watchKey);
  },
  'resource.error': (msg) => {
    // State is handled in the resourceWatcher, no need to bubble out to UI thread
    console.warn(`Resource error [${ state.store }]`, msg.resourceType, ':', msg.data.error); // eslint-disable-line no-console
  },
  dispatch: (msg) => {
    self.postMessage({ dispatch: msg });
  }
};

const maintenanceInterval = setInterval(workerActions.sendBatch, 5000); // 5 seconds // TODO: RC revisit

const actionPrecedence = {
  configure:     1,
  createWatcher: 2,
  createApi:     2
};

/**
 * Covers message from UI Thread to Worker
 */
onmessage = (e) => {
  /* on the off chance there's more than key in the message, we handle them in the order that they "keys" method provides which is
  // good enough for now considering that we never send more than one message action at a time right now */
  const messageActions = Object.keys(e?.data).sort((actionA, actionB) => {
    const aPrecedence = actionPrecedence[actionA] || 3;
    const bPrecedence = actionPrecedence[actionB] || 3;

    return aPrecedence - bPrecedence;
  });

  messageActions.forEach((action) => {
    if (workerActions[action]) {
      workerActions[action](e?.data[action]);
    } else {
      debugger;
      console.warn('no associated action for:', action); // eslint-disable-line no-console
    }
  });
}; // bind everything to the worker's onmessage handler via the workerActions
