import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ActionIntent,
  NavigateToIntent,
  NavigationTarget,
  NavigationTargetAction,
  NavigationTargetClusterScope,
  NavigationTargetPage,
  NavigationTargetResource,
} from '../models/action-engine';
import { navigationMap } from '@shell/models/navigation-map';
import { MANAGEMENT } from '@shell/config/types';

export function useActionEngine() {
  const router = useRouter();
  const store = useStore();

  const executeIntent = async(intent: ActionIntent) => {
    switch (intent.name) {
    case 'navigateTo':
      await handleNavigateToIntent(intent);
      break;
    default:
      console.warn(`ActionEngine: Unknown intent name: ${ (intent as any).name }`);
      break;
    }
  };

  const handleNavigateToIntent = async(intent: NavigateToIntent) => {
    const {
      targetId, clusterId: clusterName, id, namespace
    } = intent.arguments;

    const target: NavigationTarget | undefined = navigationMap.find((t) => t.id === targetId);

    if (!target) {
      console.error(`ActionEngine: Navigation target with id "${ targetId }" not found.`);

      return;
    }

    let targetClusterId;

    if (target.scope === NavigationTargetClusterScope.Cluster) {
      if (clusterName?.toLowerCase() === 'local') {
        targetClusterId = 'local';
      } else if (clusterName) {
        await store.dispatch('management/findAll', { type: MANAGEMENT.CLUSTER });
        const allClusters = store.getters['management/all'](MANAGEMENT.CLUSTER);
        const targetCluster = allClusters.find((c: any) => c.name === clusterName || c.spec.displayName === clusterName);

        targetClusterId = targetCluster?.id;
      }

      if (!targetClusterId) {
        console.error(`ActionEngine: Cluster with name "${ clusterName }" not found.`);

        return;
      }
    }

    if (id && (target as NavigationTargetResource).resource) {
      try {
        const resourceObj = await store.dispatch('cluster/find', {
          type: (target as NavigationTargetResource).resource,
          id:   `${ namespace }/${ id }`
        });

        if (resourceObj?.goToDetail) {
          console.log(`ActionEngine: Navigating to detail page for ${ (target as NavigationTargetResource).resource } ${ id }`);
          resourceObj.goToDetail();
        } else {
          console.error(`ActionEngine: Resource object for ${ id } found, but it has no goToDetail method.`);
        }
      } catch (e) {
        console.error(`ActionEngine: Could not find resource ${ (target as NavigationTargetResource).resource } with id ${ id } to navigate to.`, e);
      }

      return;
    }

    if (target.action === NavigationTargetAction.Resource) {
      const resourceTarget = target as NavigationTargetResource;
      const dummyResource = await store.dispatch('cluster/create', { type: resourceTarget.resource });
      const location = dummyResource.listLocation;

      if (target.scope === NavigationTargetClusterScope.Cluster) {
        location.params.cluster = targetClusterId;
      } else {
        location.params.cluster = '_';
      }

      if (resourceTarget.product) {
        location.params.product = resourceTarget.product;
      }

      console.log('ActionEngine: Navigating to resource list page:', location);
      router.push(location);
    } else if (target.action === NavigationTargetAction.Page) {
      const pageTarget = target as NavigationTargetPage;
      const route: any = {};

      if (pageTarget.scope === NavigationTargetClusterScope.Global) {
        if (pageTarget.product) {
          route.name = 'c-cluster-product-resource';
          route.params = {
            cluster:  '_',
            product:  pageTarget.product,
            resource: pageTarget.path
          };
        } else {
          route.name = pageTarget.path;
        }
      } else if (pageTarget.scope === NavigationTargetClusterScope.Cluster) {
        route.name = 'c-cluster-product-resource';
        route.params = {
          cluster:  targetClusterId,
          product:  pageTarget.product,
          resource: pageTarget.path
        };
      }

      console.log('ActionEngine: Navigating to root page route:', route);
      router.push(route);
    }
  };

  return { executeIntent };
}

export function mockAIResponse(): NavigateToIntent {
  return {
    name:      'navigateTo',
    arguments: {
      targetId:  'pods',
      clusterId: 'local',
    },
  };
}
