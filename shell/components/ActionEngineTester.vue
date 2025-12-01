<template>
  <div class="action-engine-tester p-20">
    <!-- Mock testing section -->
    <div class="mb-20">
      <h3 class="text-lg font-bold mb-10">
        1. Mock Intent Tester
      </h3>
      <button
        class="btn btn-primary"
        @click="testMockNavigation"
      >
        Test Mock Navigation (to local/default/pod)
      </button>
      <div
        v-if="lastAction"
        class="mt-10"
      >
        <h4 class="text-md font-bold">
          Last Mocked Action:
        </h4>
        <pre class="bg-gray-100 p-10 rounded">{{ JSON.stringify(lastAction, null, 2) }}</pre>
      </div>
    </div>

    <!-- Speech recognition section -->
    <div>
      <h3 class="text-lg font-bold mb-10">
        2. Voice Command Tester
      </h3>
      <button
        class="btn btn-primary"
        :disabled="isListening || !isSupported"
        @click="startListening"
      >
        <span v-if="isListening">Listening...</span>
        <span v-else>Start Listening</span>
      </button>
      <div
        v-if="isSupported"
        class="mt-10"
      >
        <p><strong>Status:</strong> {{ isListening ? 'Listening' : 'Idle' }}</p>
        <p v-if="transcript">
          <strong>Transcript:</strong> {{ transcript }}
        </p>
        <p
          v-if="speechError"
          class="text-error"
        >
          <strong>Error:</strong> {{ speechError }}
        </p>
      </div>
      <div
        v-else
        class="text-error mt-10"
      >
        Speech recognition is not supported in your browser.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useActionEngine, mockAIResponse } from '../composables/useActionEngine';
import { useSpeechRecognition } from '../composables/useSpeechRecognition';
import { ActionIntent } from '../models/action-engine';

export default defineComponent({
  name: 'ActionEngineTester',

  setup() {
    // Action Engine setup
    const { executeIntent } = useActionEngine();
    const lastAction = ref<ActionIntent | null>(null);

    const testMockNavigation = () => {
      const mockIntent = mockAIResponse();

      lastAction.value = mockIntent;
      executeIntent(mockIntent);
    };

    // Speech Recognition setup
    const {
      isListening,
      transcript,
      error: speechError,
      isSupported,
      startListening,
    } = useSpeechRecognition();

    return {
      testMockNavigation,
      lastAction,
      isListening,
      transcript,
      speechError,
      isSupported,
      startListening,
    };
  },
});
</script>

<style scoped>
.action-engine-tester {
  border: 1px dashed #ccc;
  padding: 1rem;
  margin: 1rem;
  background-color: #f9f9f9;
}
</style>
