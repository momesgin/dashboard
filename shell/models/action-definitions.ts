import { ActionDefinition } from './action-engine';

export const availableActions: ActionDefinition[] = [
  {
    name: 'navigateToClusterResource',
    description: 'Navigates to a resource page (like pods, deployments) within a specific cluster. Use this for any request that mentions a cluster or a namespaced resource.',
    parameters:  [
      { name: 'clusterId', type: 'string', description: 'The user-provided, human-readable name of the cluster (e.g., "local", "my-prod-cluster"). Do not use a technical ID.', required: true },
      { name: 'product', type: 'string', description: 'The product area, which is usually "explorer" for core Kubernetes resources.', required: true },
      { name: 'resource', type: 'string', description: 'The type of resource, like "pod" or "deployment".', required: false },
      { name: 'namespace', type: 'string', description: 'The specific Kubernetes namespace (if applicable).', required: false },
      { name: 'id', type: 'string', description: 'The name or ID of a specific resource to view its detail page.', required: false },
    ],
  },
  {
    name: 'navigateToRootPage',
    description: 'Navigates to a global, top-level page that is not inside a cluster, such as the main home page, user preferences, or account management.',
    parameters:  [
      { name: 'pageName', type: 'string', description: 'The name of the root page to navigate to. Supported values are: home, prefs, account, support, about.', required: true },
    ],
  },
  {
    name: 'navigateToClusterManagement',
    description: 'Navigates to the main "Cluster Management" page, which lists all available clusters.',
    parameters:  [],
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
