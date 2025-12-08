// ===================================================================================
// 1. ACTION DEFINITIONS
// These types describe the "tools" or "actions" our system is capable of performing.
// We will serialize this information and send it to the AI with every request
// so that it knows what functions are available and what parameters they take.
// ===================================================================================

/**
 * Defines a single parameter for an action.
 */
export interface ActionParameterDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
}

/**
 * Defines an entire action that can be executed by the system.
 */
export interface ActionDefinition {
  name: string;
  description: string;
  parameters: ActionParameterDefinition[];
}

// ===================================================================================
// 2. ACTION INTENTS
// These types represent the structured command returned by the AI.
// Our Action Engine will use these typed objects to execute the command.
// We use a discriminated union on the `name` property for maximum type safety.
// ===================================================================================

/**
 * The base interface for any recognized action intent.
 */
interface BaseActionIntent {
  // The name of the action to execute. This is our discriminator.
  name: string;
  // A key-value map of arguments for the action.
  arguments: { [key: string]: string | number | boolean | undefined };
}

/**
 * INTENT: Navigate to a resource page within a specific cluster.
 */
export interface NavigateToClusterResourceIntent extends BaseActionIntent {
  name: 'navigateToClusterResource';
  arguments: {
    clusterId: string;
    product: string;
    resource?: string;
    namespace?: string;
    id?: string;
  };
}

/**
 * INTENT: Navigate to a global, top-level page.
 */
export interface NavigateToRootPageIntent extends BaseActionIntent {
  name: 'navigateToRootPage';
  arguments: {
    pageName: 'home' | 'prefs' | 'account' | 'support' | 'about';
  };
}

/**
 * INTENT: Navigate to the main Cluster Management page.
 */
export interface NavigateToClusterManagementIntent extends BaseActionIntent {
  name: 'navigateToClusterManagement';
  arguments: {};
}

/**
 * INTENT: Create a new cluster (simplified example for an RKE2/K3s cluster).
 */
export interface CreateRke2ClusterIntent extends BaseActionIntent {
  name: 'createRke2Cluster';
  arguments: {
    clusterName: string;
    kubernetesVersion: string;
    nodeProvider: 'aws' | 'azure' | 'digitalocean';
    region?: string;
    nodeCount?: number;
    nodeInstanceType?: string;
  };
}

// --- Add new intent interfaces above this line ---

/**
 * A discriminated union of all possible action intents.
 */
export type ActionIntent =
  | NavigateToClusterResourceIntent
  | NavigateToRootPageIntent
  | NavigateToClusterManagementIntent
  | CreateRke2ClusterIntent;

// ===================================================================================
// 3. AI PAYLOADS
// These types define the contract for our communication with the AI service.
// ===================================================================================

/**
 * The payload we send to the AI service.
 */
export interface AIPayload {
  userQuery: string;
  availableActions: ActionDefinition[];
}

/**
 * The expected response from the AI service.
 */
export type AIResponse = ActionIntent;
