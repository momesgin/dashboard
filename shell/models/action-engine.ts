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
 * INTENT: Navigate to a page or resource.
 */
export interface NavigateToIntent extends BaseActionIntent {
  name: 'navigateTo';
  arguments: {
    targetId: string;
    clusterId?: string;
    namespace?: string;
    id?: string;
  };
}

// --- Add new intent interfaces above this line ---

/**
 * A discriminated union of all possible action intents.
 */
export type ActionIntent =
  | NavigateToIntent;

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

// ===================================================================================
// 4. NAVIGATION MAP
// These types define the structure of the navigation map, which is used to
// provide the AI with a list of possible navigation targets.
// ===================================================================================

export enum NavigationTargetClusterScope {
  Global = 'global',
  Cluster = 'cluster',
}

export enum NavigationTargetAction {
  Page = 'page',
  Resource = 'resource',
}

interface NavigationTargetBase {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  scope: NavigationTargetClusterScope;
  product?: string;
}

export interface NavigationTargetPage extends NavigationTargetBase {
  action: NavigationTargetAction.Page;
  path: string;
}

export interface NavigationTargetResource extends NavigationTargetBase {
  action: NavigationTargetAction.Resource;
  resource: string;
}

export type NavigationTarget = NavigationTargetPage | NavigationTargetResource;
