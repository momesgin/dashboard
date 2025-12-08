import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import {
  ActionIntent,
  NavigateToClusterResourceIntent,
  NavigateToRootPageIntent,
  CreateRke2ClusterIntent,
  NavigateToClusterManagementIntent
} from '../models/action-engine';
import { CAPI, MANAGEMENT } from '@shell/config/types';
import { NAME as MANAGER } from '@shell/config/product/manager';

export function useActionEngine() {
  const router = useRouter();
  const store = useStore();

  const executeIntent = async(intent: ActionIntent) => {
    switch (intent.name) {
    case 'navigateToClusterResource':
      await handleNavigateToClusterResourceIntent(intent);
      break;
    case 'navigateToRootPage':
      handleNavigateToRootPageIntent(intent);
      break;
    case 'navigateToClusterManagement':
      await handleNavigateToClusterManagementIntent();
      break;
    case 'createRke2Cluster':
      handleCreateRke2ClusterIntent(intent);
      break;
    default:
      console.warn(`ActionEngine: Unknown intent name: ${ (intent as any).name }`);
      break;
    }
  };

  const handleNavigateToClusterResourceIntent = async(intent: NavigateToClusterResourceIntent) => {
    const {
      clusterId: clusterName, product, resource, id, namespace
    } = intent.arguments;

    let targetClusterId;

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

    // If we have an ID, we're navigating to a detail page.
    if (id && resource) {
      try {
        const resourceObj = await store.dispatch('cluster/find', {
          type: resource,
          id:   `${ namespace }/${ id }`
        });

        if (resourceObj?.goToDetail) {
          console.log(`ActionEngine: Navigating to detail page for ${ resource } ${ id }`);
          resourceObj.goToDetail();
        } else {
          console.error(`ActionEngine: Resource object for ${ id } found, but it has no goToDetail method.`);
        }
      } catch (e) {
        console.error(`ActionEngine: Could not find resource ${ resource } with id ${ id } to navigate to.`, e);
      }

      return;
    }

    // Otherwise, we're navigating to a list page.
    if (resource) {
      // We can get the list view by creating a "dummy" resource of the target type
      // and getting its listLocation.
      const dummyResource = await store.dispatch('cluster/create', { type: resource });
      const location = dummyResource.listLocation;

      location.params.cluster = targetClusterId;
      location.params.product = product;

      console.log('ActionEngine: Navigating to resource list page:', location);
      router.push(location);
    }
  };

  const handleNavigateToRootPageIntent = (intent: NavigateToRootPageIntent) => {
    const { pageName } = intent.arguments;
    const route = { name: pageName };

    console.log('ActionEngine: Navigating to root page route:', route);
    router.push(route);
  };

  const handleNavigateToClusterManagementIntent = async() => {
    // This is a special case that navigates to a specific resource list.
    // We can reuse the main handler for this.
    const intent: NavigateToClusterResourceIntent = {
      name:      'navigateToClusterResource',
      arguments: {
        clusterId: store.getters['currentCluster']?.id || 'local',
        product:   MANAGER,
        resource:  CAPI.RANCHER_CLUSTER
      }
    };

    await handleNavigateToClusterResourceIntent(intent);
  };

  const handleCreateRke2ClusterIntent = (intent: CreateRke2ClusterIntent) => {
    const {
      clusterName, kubernetesVersion, nodeProvider, region, nodeCount, nodeInstanceType
    } = intent.arguments;

    console.log(`ActionEngine: Attempting to create RKE2 cluster '${ clusterName }' with K8s version '${ kubernetesVersion }' on '${ nodeProvider }'.`);
    console.log(`  Details: Region=${ region }, Nodes=${ nodeCount }, InstanceType=${ nodeInstanceType }`);
  };

  return { executeIntent };
}

export function mockAIResponse(): NavigateToClusterResourceIntent {
  return {
    name:      'navigateToClusterResource',
    arguments: {
      clusterId: 'local',
      product:   'explorer',
      resource:  'pod',
    },
  };
}
