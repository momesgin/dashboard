<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useClickOutside } from '@shell/composables/useClickOutside';
import { useActionEngine } from '@shell/composables/useActionEngine';
import { useSpeechRecognition } from '@shell/composables/useSpeechRecognition';
import { useAI } from '@shell/composables/useAI';
import { availableActions } from '@shell/models/action-definitions';

export default defineComponent({
  name: 'ActionEngineInput',

  setup() {
    const store = useStore();

    const showActionInput = ref(false);
    const commandText = ref('');
    const actionInputBox = ref(null);

    const actionEngine = useActionEngine();
    const speechRecognition = useSpeechRecognition();
    const ai = useAI();

    const theme = computed(() => store.getters['prefs/theme']);
    const isDarkMode = computed(() => theme.value === 'dark');
    const isListening = computed(() => speechRecognition.isListening.value);
    const isAiLoading = computed(() => ai.isLoading.value);

    watch(speechRecognition.transcript, (newTranscript) => {
      if (newTranscript) {
        commandText.value = newTranscript;
        handleCommandSubmit();
      }
    });

    const handleEsc = () => {
      showActionInput.value = false;
    };

    const handleGlobalEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEsc();
      }
    };

    watch(showActionInput, (isOpen) => {
      if (isOpen) {
        window.addEventListener('keydown', handleGlobalEsc);
      } else {
        window.removeEventListener('keydown', handleGlobalEsc);
        if (isListening.value) {
          speechRecognition.stopListening();
        }
      }
    });

    useClickOutside(actionInputBox, () => {
      if (showActionInput.value) {
        showActionInput.value = false;
      }
    });

    async function handleCommandSubmit() {
      if (commandText.value) {
        const intent = await ai.getIntentFromAI(commandText.value, availableActions);

        if (intent) {
          actionEngine.executeIntent(intent);
          showActionInput.value = false;
          commandText.value = '';
        }
      }
    }

    function handleMicClick() {
      if (isListening.value) {
        speechRecognition.stopListening();
      } else {
        commandText.value = '';
        speechRecognition.startListening();
      }
    }

    const openActionInput = () => {
      showActionInput.value = true;
    };

    return {
      showActionInput,
      commandText,
      actionInputBox,
      isDarkMode,
      isListening,
      isAiLoading,
      handleCommandSubmit,
      handleMicClick,
      handleEsc,
      openActionInput,
      t: store.getters['i18n/t'],
    };
  },
});
</script>

<template>
  <div class="action-input-container">
    <button
      v-if="!showActionInput"
      v-clean-tooltip="t('actionEngine.tooltip')"
      type="button"
      class="btn header-btn role-tertiary"
      @click="openActionInput"
    >
      <i class="icon icon-star-open icon-lg" />
    </button>
    <div
      v-else
      ref="actionInputBox"
      class="action-input-box"
    >
      <input
        v-model="commandText"
        v-focus
        type="text"
        :placeholder="isListening ? t('actionEngine.listening') : t('actionEngine.placeholder')"
        class="action-input"
        @keydown.enter.prevent="handleCommandSubmit"
      >
      <i
        v-if="isAiLoading"
        class="icon icon-spinner icon-spin action-input-icon"
      />
      <img
        v-else
        :src="require('@shell/assets/images/microphone.png')"
        class="action-input-icon"
        :class="{
          'listening-active': isListening,
          'dark-mode': isDarkMode && !isListening
        }"
        alt="Microphone"
        @click="handleMicClick"
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-input-container {
  position: relative;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.action-input {
  background-color: var(--header-btn-bg);
  color: var(--header-btn-text);
  border: 1px solid var(--header-border);
  border-radius: var(--border-radius);
  height: 32px;
  width: 250px;
  padding: 5px 30px 5px 10px;

  &:focus {
    background-color: var(--input-bg);
    color: var(--input-text);
  }
}

.action-input-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.icon-spin {
    animation: action-icon-spin 1s infinite linear;
  }

  &.dark-mode {
    filter: invert(1);
  }

  &.listening-active {
    filter: brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1200%) hue-rotate(359deg) brightness(101%) contrast(104%);

    &:hover {
      filter: brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1200%) hue-rotate(359deg) brightness(101%) contrast(104%);
    }
  }

  &:hover {
    filter: brightness(0) saturate(100%) invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
  }
}

@keyframes action-icon-spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
