import { ActionDefinition } from './action-engine';

export const availableActions: ActionDefinition[] = [
  {
    name: 'navigate',
    description: 'Navigates to a specific page or resource within the Rancher UI. Use this to go to a cluster, a specific resource list (like pods or deployments), or a detailed view of a resource.',
    parameters:  [
      { name: 'clusterId', type: 'string', description: 'The ID of the cluster to navigate to (e.g., "local", "c-abcd")', required: true },
      { name: 'product', type: 'string', description: 'The product area to navigate to (e.g., "explorer" for core Kubernetes resources).', required: true },
      { name: 'resource', type: 'string', description: 'The type of resource, like "pod" or "deployment".', required: false },
      { name: 'namespace', type: 'string', description: 'The specific Kubernetes namespace (if applicable).', required: false },
      { name: 'id', type: 'string', description: 'The ID or name of the specific resource instance.', required: false },
    ],
  },
  {
    name:        'createRke2Cluster',
    description: 'Initiates the creation of a new RKE2 Kubernetes cluster on a specified cloud provider.',
    parameters:  [
      {
        name: 'clusterName', type: 'string', description: 'A unique name for the new cluster.', required: true
      },
      {
        name: 'kubernetesVersion', type: 'string', description: 'The desired Kubernetes version (e.g., "v1.28.4+rke2r1").', required: true
      },
      {
        name: 'nodeProvider', type: 'string', description: 'The cloud provider to host the cluster (e.g., "aws", "azure", "digitalocean").', required: true
      },
      {
        name: 'region', type: 'string', description: 'The geographical region for the cluster nodes (if applicable).', required: false
      },
      {
        name: 'nodeCount', type: 'number', description: 'The number of worker nodes to provision for the cluster.', required: false
      },
      {
        name: 'nodeInstanceType', type: 'string', description: 'The instance type/size for the worker nodes (e.g., "t3.medium").', required: false
      },
    ],
  },
];
