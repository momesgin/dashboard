import { useRouter } from 'vue-router';
import { ActionIntent, NavigateIntent, CreateRke2ClusterIntent } from '../models/action-engine';

export function useActionEngine() {
  const router = useRouter();

  const executeIntent = (intent: ActionIntent) => {
    switch (intent.name) {
    case 'navigate':
      handleNavigateIntent(intent);
      break;
    case 'createRke2Cluster':
      handleCreateRke2ClusterIntent(intent);
      break;
    default:
      console.warn(`ActionEngine: Unknown intent name: ${ intent.name }`);
      break;
    }
  };

  const handleNavigateIntent = (intent: NavigateIntent) => {
    const { clusterId, product, resource, id, namespace } = intent.arguments;

    const route: any = {
      name: '',
      params: {
        cluster: clusterId,
        product,
        resource,
        id,
        namespace,
      }
    };

    if (id && namespace) {
      route.name = 'c-cluster-product-resource-namespace-id';
    } else if (id) {
      route.name = 'c-cluster-product-resource-id';
    } else if (resource) {
      route.name = 'c-cluster-product-resource';
    } else {
      route.name = 'c-cluster-product';
    }

    console.log('ActionEngine: Navigating to route:', route);
    router.push(route);
  };

  const handleCreateRke2ClusterIntent = (intent: CreateRke2ClusterIntent) => {
    const {
      clusterName, kubernetesVersion, nodeProvider, region, nodeCount, nodeInstanceType
    } = intent.arguments;

    console.log(`ActionEngine: Attempting to create RKE2 cluster '${ clusterName }' with K8s version '${ kubernetesVersion }' on '${ nodeProvider }'.`);
    console.log(`  Details: Region=${ region }, Nodes=${ nodeCount }, InstanceType=${ nodeInstanceType }`);
    // TODO: Implement actual API call to create cluster
  };

  return { executeIntent };
}

export function mockAIResponse(): NavigateIntent {
  // Returns a hardcoded NavigateIntent for testing purposes
  return {
    name:      'navigate',
    arguments: {
      clusterId: 'local',
      product:   'explorer',
      resource:  'pod',
      namespace: 'default'
    },
  };
}
