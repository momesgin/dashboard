
import {
  ActionDefinition,
  NavigationTarget,
  NavigationTargetAction,
  NavigationTargetClusterScope,
  NavigationTargetPage,
  NavigationTargetResource,
} from './action-engine';

const clusterScopedPages: NavigationTargetPage[] = [
  {
    id:          'projects-namespaces',
    name:        'Projects/Namespaces',
    description: 'A page that shows an overview of all the projects and namespaces in the current cluster',
    keywords:    ['project', 'namespace', 'projects namespaces'],
    product:     'explorer',
    path:        'projectsnamespaces'
  },
  {
    id:          'cluster-members',
    name:        'Cluster and Project Members',
    description: 'A page that shows an overview of all the members of the current cluster',
    keywords:    ['member', 'cluster member', 'project member'],
    product:     'explorer',
    path:        'members'
  },
  {
    id:          'tools',
    name:        'Tools',
    description: 'A page that shows an overview of all the tools installed in the current cluster',
    keywords:    ['tool', 'tools'],
    product:     'explorer',
    path:        'tools'
  },
  {
    id:          'charts',
    name:        'Charts',
    description: 'A page that shows an overview of all the charts available in the current cluster',
    keywords:    ['chart', 'charts'],
    product:     'apps',
    path:        'charts'
  },
];

const clusterScopedResources: NavigationTargetResource[] = [
  // Cluster
  {
    id:          'nodes',
    name:        'Nodes',
    description: 'A list of all the nodes in the current cluster',
    keywords:    ['node', 'nodes'],
    product:     'explorer',
    resource:    'node'
  },
  {
    id:          'events',
    name:        'Events',
    description: 'A list of all the events in the current cluster',
    keywords:    ['event', 'events'],
    product:     'explorer',
    resource:    'event'
  },
  // Workloads
  {
    id:          'cronjobs',
    name:        'CronJobs',
    description: 'A list of all the cronjobs in the current cluster',
    keywords:    ['cronjob', 'cronjobs', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'batch.cronjob'
  },
  {
    id:          'daemonsets',
    name:        'DaemonSets',
    description: 'A list of all the daemonsets in the current cluster',
    keywords:    ['daemonset', 'daemonsets', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'apps.daemonset'
  },
  {
    id:          'deployments',
    name:        'Deployments',
    description: 'A list of all the deployments in the current cluster',
    keywords:    ['deployment', 'deployments', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'apps.deployment'
  },
  {
    id:          'jobs',
    name:        'Jobs',
    description: 'A list of all the jobs in the current cluster',
    keywords:    ['job', 'jobs', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'batch.job'
  },
  {
    id:          'statefulsets',
    name:        'StatefulSets',
    description: 'A list of all the statefulsets in the current cluster',
    keywords:    ['statefulset', 'statefulsets', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'apps.statefulset'
  },
  {
    id:          'pods',
    name:        'Pods',
    description: 'A list of all the pods in the current cluster',
    keywords:    ['pod', 'pods', 'workload', 'workloads'],
    product:     'explorer',
    resource:    'pod'
  },
  // Apps
  {
    id:          'installed-apps',
    name:        'Installed Apps',
    description: 'A list of all the installed apps in the current cluster',
    keywords:    ['app', 'apps', 'installed app', 'installed apps'],
    product:     'apps',
    resource:    'catalog.cattle.io.app'
  },
  {
    id:          'app-repositories',
    name:        'App Repositories',
    description: 'A list of all the app repositories in the current cluster',
    keywords:    ['repository', 'repositories', 'app repository', 'app repositories'],
    product:     'apps',
    resource:    'catalog.cattle.io.clusterrepo'
  },
  {
    id:          'app-operations',
    name:        'App Operations',
    description: 'A list of all the app operations in the current cluster',
    keywords:    ['operation', 'operations', 'app operation', 'app operations'],
    product:     'apps',
    resource:    'catalog.cattle.io.operation'
  },
  // Service Discovery
  {
    id:          'services',
    name:        'Services',
    description: 'A list of all the services in the current cluster',
    keywords:    ['service', 'services', 'service discovery'],
    product:     'explorer',
    resource:    'service'
  },
  {
    id:          'ingresses',
    name:        'Ingresses',
    description: 'A list of all the ingresses in the current cluster',
    keywords:    ['ingress', 'ingresses', 'service discovery'],
    product:     'explorer',
    resource:    'networking.k8s.io.ingress'
  },
  {
    id:          'horizontalpodautoscalers',
    name:        'HorizontalPodAutoscalers',
    description: 'A list of all the horizontalpodautoscalers in the current cluster',
    keywords:    ['horizontalpodautoscaler', 'horizontalpodautoscalers', 'hpa', 'service discovery'],
    product:     'explorer',
    resource:    'autoscaling.horizontalpodautoscaler'
  },
  // Storage
  {
    id:          'persistentvolumes',
    name:        'PersistentVolumes',
    description: 'A list of all the persistentvolumes in the current cluster',
    keywords:    ['persistentvolume', 'persistentvolumes', 'pv', 'storage'],
    product:     'explorer',
    resource:    'persistentvolume'
  },
  {
    id:          'storageclasses',
    name:        'StorageClasses',
    description: 'A list of all the storageclasses in the current cluster',
    keywords:    ['storageclasse', 'storageclasses', 'sc', 'storage'],
    product:     'explorer',
    resource:    'storage.k8s.io.storageclass'
  },
  {
    id:          'configmaps',
    name:        'ConfigMaps',
    description: 'A list of all the configmaps in the current cluster',
    keywords:    ['configmap', 'configmaps', 'cm', 'storage'],
    product:     'explorer',
    resource:    'configmap'
  },
  {
    id:          'persistentvolumeclaims',
    name:        'PersistentVolumeClaims',
    description: 'A list of all the persistentvolumeclaims in the current cluster',
    keywords:    ['persistentvolumeclaim', 'persistentvolumeclaims', 'pvc', 'storage'],
    product:     'explorer',
    resource:    'persistentvolumeclaim'
  },
  {
    id:          'secrets',
    name:        'Secrets',
    description: 'A list of all the secrets in the current cluster',
    keywords:    ['secret', 'secrets', 'storage'],
    product:     'explorer',
    resource:    'secret'
  },
  {
    id:          'project-secrets',
    name:        'Project Secrets',
    description: 'A list of all the project secrets in the current cluster',
    keywords:    ['project secret', 'project secrets', 'storage'],
    product:     'explorer',
    resource:    'projectsecret'
  },
  // Policy
  {
    id:          'limitranges',
    name:        'LimitRanges',
    description: 'A list of all the limitranges in the current cluster',
    keywords:    ['limitrange', 'limitranges', 'policy'],
    product:     'explorer',
    resource:    'limitrange'
  },
  {
    id:          'networkpolicies',
    name:        'NetworkPolicies',
    description: 'A list of all the networkpolicies in the current cluster',
    keywords:    ['networkpolicy', 'networkpolicies', 'policy'],
    product:     'explorer',
    resource:    'networking.k8s.io.networkpolicy'
  },
  {
    id:          'poddisruptionbudgets',
    name:        'PodDisruptionBudgets',
    description: 'A list of all the poddisruptionbudgets in the current cluster',
    keywords:    ['poddisruptionbudget', 'poddisruptionbudgets', 'pdb', 'policy'],
    product:     'explorer',
    resource:    'policy.poddisruptionbudget'
  },
  {
    id:          'resourcequotas',
    name:        'ResourceQuotas',
    description: 'A list of all the resourcequotas in the current cluster',
    keywords:    ['resourcequota', 'resourcequotas', 'policy'],
    product:     'explorer',
    resource:    'resourcequota'
  },
];

const globalPages: NavigationTargetPage[] = [
  // Root
  {
    id:          'home',
    name:        'Home',
    description: 'The main home page of the application',
    keywords:    ['home', 'main', 'dashboard'],
    path:        'home',
  },
  {
    id:          'about',
    name:        'About',
    description: 'A page that shows information about the application',
    keywords:    ['about', 'info', 'version'],
    path:        'about',
  },
  {
    id:          'preferences',
    name:        'Preferences',
    description: 'A page where the user can change their preferences',
    keywords:    ['preferences', 'settings', 'options'],
    path:        'prefs',
  },
  {
    id:          'account',
    name:        'Account and API Keys',
    description: 'A page where the user can manage their account and API keys',
    keywords:    ['account', 'api', 'keys'],
    path:        'account',
  },
  {
    id:          'support',
    name:        'Support',
    description: 'A page where the user can find support information',
    keywords:    ['support', 'help', 'contact'],
    path:        'support',
  },
  {
    id:          'extensions',
    name:        'Extensions',
    description: 'A page that shows all the available extensions',
    keywords:    ['extensions', 'plugins'],
    product:     'uiplugins',
    path:        'c/_/uiplugins',
  },
  // Global Settings
  {
    id:          'banners',
    name:        'Banners',
    description: 'A page that shows all the active banners',
    keywords:    ['banners', 'banner'],
    product:     'settings',
    path:        'banners',
  },
  {
    id:          'branding',
    name:        'Branding',
    description: 'A page where the user can customize the branding of the application',
    keywords:    ['branding', 'brand'],
    product:     'settings',
    path:        'brand',
  },
  {
    id:          'performance',
    name:        'Performance',
    description: 'A page where the user can change the performance settings',
    keywords:    ['performance', 'perf'],
    product:     'settings',
    path:        'performance',
  },
  {
    id:          'home-links',
    name:        'Home Links',
    description: 'A page where the user can customize the links on the home page',
    keywords:    ['home links', 'links'],
    product:     'settings',
    path:        'links',
  },
  {
    id:          'continuous-delivery',
    name:        'Continuous Delivery',
    description: 'A page that shows the continuous delivery settings',
    keywords:    ['continuous delivery', 'cd', 'fleet'],
    product:     'settings',
    path:        'fleet',
  },
];

const globalResources: NavigationTargetResource[] = [
  // Cluster Management
  {
    id:          'clusters',
    name:        'Clusters',
    description: 'A list of all the clusters managed by Rancher',
    keywords:    ['cluster', 'clusters', 'cluster management'],
    product:     'manager',
    resource:    'provisioning.cattle.io.cluster'
  },
  {
    id:          'cloud-credentials',
    name:        'Cloud Credentials',
    description: 'A list of all the cloud credentials',
    keywords:    ['cloud credential', 'cloud credentials'],
    product:     'manager',
    resource:    'cloudcredential'
  },
  {
    id:          'hosted-providers',
    name:        'Hosted Providers',
    description: 'A list of all the hosted providers',
    keywords:    ['hosted provider', 'hosted providers'],
    product:     'manager',
    resource:    'hostedprovider'
  },
  {
    id:          'cluster-drivers',
    name:        'Cluster Drivers',
    description: 'A list of all the cluster drivers',
    keywords:    ['cluster driver', 'cluster drivers'],
    product:     'manager',
    resource:    'kontainerdriver'
  },
  {
    id:          'node-drivers',
    name:        'Node Drivers',
    description: 'A list of all the node drivers',
    keywords:    ['node driver', 'node drivers'],
    product:     'manager',
    resource:    'nodedriver'
  },
  {
    id:          'pod-security-admissions',
    name:        'Pod Security Admissions',
    description: 'A list of all the pod security admissions',
    keywords:    ['pod security admission', 'pod security admissions', 'psa'],
    product:     'manager',
    resource:    'management.cattle.io.podsecurityadmissionconfigurationtemplate'
  },
  {
    id:          'machinedeployments',
    name:        'MachineDeployments',
    description: 'A list of all the machinedeployments',
    keywords:    ['machinedeployment', 'machinedeployments'],
    product:     'manager',
    resource:    'cluster.x-k8s.io.machinedeployment'
  },
  {
    id:          'machinesets',
    name:        'MachineSets',
    description: 'A list of all the machinesets',
    keywords:    ['machineset', 'machinesets'],
    product:     'manager',
    resource:    'cluster.x-k8s.io.machineset'
  },
  {
    id:          'machines',
    name:        'Machines',
    description: 'A list of all the machines',
    keywords:    ['machine', 'machines'],
    product:     'manager',
    resource:    'cluster.x-k8s.io.machine'
  },
  {
    id:          'cluster-repositories',
    name:        'Cluster Repositories',
    description: 'A list of all the cluster repositories',
    keywords:    ['cluster repository', 'cluster repositories'],
    product:     'manager',
    resource:    'catalog.cattle.io.clusterrepo'
  },
  // Users & Authentication
  {
    id:          'users',
    name:        'Users',
    description: 'A list of all the users',
    keywords:    ['user', 'users'],
    product:     'auth',
    resource:    'management.cattle.io.user'
  },
  {
    id:          'roles',
    name:        'Role Templates',
    description: 'A list of all the role templates',
    keywords:    ['role', 'roles', 'role template', 'role templates'],
    product:     'auth',
    resource:    'management.cattle.io.roletemplate'
  },
  {
    id:          'groups',
    name:        'Groups',
    description: 'A list of all the groups',
    keywords:    ['group', 'groups'],
    product:     'auth',
    resource:    'group.principal'
  },
  {
    id:          'auth-providers',
    name:        'Auth Providers',
    description: 'A page that shows the authentication providers',
    keywords:    ['auth provider', 'auth providers'],
    product:     'auth',
    resource:    'config'
  },
  // Global Settings
  {
    id:          'settings',
    name:        'Settings',
    description: 'A list of all the settings',
    keywords:    ['setting', 'settings'],
    product:     'settings',
    resource:    'management.cattle.io.setting'
  },
  {
    id:          'feature-flags',
    name:        'Feature Flags',
    description: 'A list of all the feature flags',
    keywords:    ['feature flag', 'feature flags'],
    product:     'settings',
    resource:    'management.cattle.io.feature'
  },
];

export const navigationMap: NavigationTarget[] = [
  ...clusterScopedPages.map((page): NavigationTarget => ({
    ...page,
    scope:  NavigationTargetClusterScope.Cluster,
    action: NavigationTargetAction.Page,
  })),
  ...clusterScopedResources.map((resource): NavigationTarget => ({
    ...resource,
    scope:  NavigationTargetClusterScope.Cluster,
    action: NavigationTargetAction.Resource,
  })),
  ...globalPages.map((page): NavigationTarget => ({
    ...page,
    scope:  NavigationTargetClusterScope.Global,
    action: NavigationTargetAction.Page,
  })),
  ...globalResources.map((resource): NavigationTarget => ({
    ...resource,
    scope:  NavigationTargetClusterScope.Global,
    action: NavigationTargetAction.Resource,
  })),
];

export const availableActions: ActionDefinition[] = [
  {
    name:        'navigateTo',
    description: 'Navigates to a page in the application. Use this for any request that involves moving to a different screen or view.',
    parameters:  [
      {
        name:        'targetId',
        type:        'string',
        description: 'The unique identifier of the target page or resource from the provided navigation map. This is the most critical parameter.',
        required:    true,
      },
      {
        name:        'clusterId',
        type:        'string',
        description: 'The user-provided, human-readable name of the cluster (e.g., "local", "my-prod-cluster") if the navigation is cluster-specific. Do not use a technical ID.',
        required:    false,
      },
      {
        name:        'namespace',
        type:        'string',
        description: 'The specific Kubernetes namespace for the resource, if applicable and mentioned by the user.',
        required:    false,
      },
      {
        name:        'id',
        type:        'string',
        description: 'The specific name or ID of a resource to view its detail page, if mentioned by the user.',
        required:    false,
      },
    ],
  },
];
