import { ref } from 'vue';
import { ActionDefinition, ActionIntent } from '../models/action-engine';

// The Gemini API URL for the gemini-2.5-flash model
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// In a real app, this would be handled on a backend server.
const API_KEY = process.env.HACKWEEK_GEMINI_API_KEY;

/**
 * A composable to interact with the Google Gemini AI.
 */
export function useAI() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Converts our internal ActionDefinition format to the format Gemini expects for function declarations.
   * @param actions The array of ActionDefinition objects.
   * @returns A Gemini-compatible function declaration object.
   */
  const convertToGeminiTools = (actions: ActionDefinition[]) => {
    return [{
      functionDeclarations: actions.map((action) => {
        const properties: { [key: string]: any } = {};

        action.parameters.forEach((param) => {
          properties[param.name] = {
            type:        param.type.toUpperCase(), // Gemini expects uppercase types (STRING, NUMBER, BOOLEAN)
            description: param.description,
          };
        });

        return {
          name:        action.name,
          description: action.description,
          parameters:  {
            type:     'OBJECT',
            properties,
            required: action.parameters.filter((p) => p.required).map((p) => p.name),
          },
        };
      }),
    }];
  };

  /**
   * Takes a user query and a list of available actions, sends them to the Gemini API,
   * and returns a structured ActionIntent.
   * @param userQuery The user's natural language request.
   * @param availableActions The list of possible actions the AI can choose from.
   * @returns A promise that resolves to an ActionIntent, or null if an error occurs.
   */
  const getIntentFromAI = async(userQuery: string, availableActions: ActionDefinition[]): Promise<ActionIntent | null> => {
    if (!API_KEY) {
      error.value = 'HACKWEEK_GEMINI_API_KEY environment variable not set. Please create a .env file in the project root.';
      console.error(error.value);

      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const geminiTools = convertToGeminiTools(availableActions);

      const requestBody = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools:    geminiTools,
      };

      const response = await fetch(`${ API_URL }?key=${ API_KEY }`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${ response.status }`);
      }

      const data = await response.json();

      // Find the function call in the response
      const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;

      if (!functionCall) {
        error.value = 'The AI did not return a valid action for that command.';
        console.warn(error.value);

        return null;
      }

      // We have a function call, now format it as our internal ActionIntent
      const intent: ActionIntent = {
        name:      functionCall.name,
        arguments: functionCall.args,
      } as ActionIntent; // We cast here, trusting the AI returns the correct args

      return intent;
    } catch (e: any) {
      error.value = `Failed to get intent from AI: ${ e.message }`;
      console.error(e);

      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    getIntentFromAI,
  };
}
