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
 * INTENT: Navigate to a page in the Rancher UI.
 */
export interface NavigateIntent extends BaseActionIntent {
  name: 'navigate';
  arguments: {
    clusterId: string;
    // The name of the product area, e.g., 'explorer', 'apps'
    product: string;
    // The type of resource to navigate to, e.g., 'pod', 'deployment'
    resource?: string;
    // Optional params for resource-specific pages
    namespace?: string;
    id?: string; // The specific resource ID
  };
}

/**
 * INTENT: Create a new cluster (simplified example for an RKE2/K3s cluster).
 */
export interface CreateRke2ClusterIntent extends BaseActionIntent {
  name: 'createRke2Cluster';
  arguments: {
    clusterName: string;
    kubernetesVersion: string; // e.g., 'v1.28.4+rke2r1'
    nodeProvider: 'aws' | 'azure' | 'digitalocean'; // Example providers
    region?: string; // e.g., 'us-west-2' for AWS
    nodeCount?: number;
    nodeInstanceType?: string; // e.g., 't3.medium' for AWS
  };
}

// --- Add new intent interfaces above this line ---

/**
 * A discriminated union of all possible action intents.
 * The Action Engine will receive an object of this type. TypeScript will
 * automatically infer the correct `arguments` shape based on the `name`.
 */
export type ActionIntent =
  | NavigateIntent
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
