<script>
import { defineComponent, watch } from 'vue';
import { useClickOutside } from '@shell/composables/useClickOutside';
import { useActionEngine } from '@shell/composables/useActionEngine';
import { useSpeechRecognition } from '@shell/composables/useSpeechRecognition';
import { useAI } from '@shell/composables/useAI';
import { availableActions } from '@shell/models/action-definitions';

export default defineComponent({
  name: 'ActionEngineInput',

  data() {
    return {
      showActionInput: false,
      commandText:     '',
    };
  },

  created() {
    this.actionEngine = useActionEngine();
    this.speechRecognition = useSpeechRecognition();
    this.ai = useAI();

    watch(this.speechRecognition.transcript, (newTranscript) => {
      if (newTranscript) {
        this.commandText = newTranscript;
        this.handleCommandSubmit();
      }
    });
  },

  computed: {
    isListening() {
      return this.speechRecognition?.isListening.value;
    },
    isAiLoading() {
      return this.ai?.isLoading.value;
    },
  },

  watch: {
    showActionInput(isOpen) {
      if (isOpen) {
        this.$nextTick(() => {
          if (this.$refs.actionInputBox) {
            useClickOutside(this.$refs.actionInputBox, () => {
              this.showActionInput = false;
            });
          }
        });
        window.addEventListener('keydown', this.handleGlobalEsc);
      } else {
        window.removeEventListener('keydown', this.handleGlobalEsc);
        if (this.isListening) {
          this.speechRecognition.stopListening();
        }
      }
    }
  },

  methods: {
    handleGlobalEsc(event) {
      if (event.key === 'Escape') {
        this.handleEsc();
      }
    },
    async handleCommandSubmit() {
      if (this.commandText) {
        const intent = await this.ai.getIntentFromAI(this.commandText, availableActions);

        if (intent) {
          this.actionEngine.executeIntent(intent);
          this.showActionInput = false;
          this.commandText = '';
        }
      }
    },
    handleMicClick() {
      if (this.isListening) {
        this.speechRecognition.stopListening();
      } else {
        this.commandText = '';
        this.speechRecognition.startListening();
      }
    },
    handleEsc() {
      this.showActionInput = false;
    },
  }
});
</script>

<template>
  <div class="action-input-container">
    <button
      v-if="!showActionInput"
      v-clean-tooltip="t('actionEngine.tooltip')"
      type="button"
      class="btn header-btn role-tertiary"
      @click="showActionInput = true"
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
        :class="{'listening-active': isListening}"
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

  &.listening-active {
    filter: brightness(0) saturate(100%) invert(60%) sepia(89%) saturate(1200%) hue-rotate(359deg) brightness(101%) contrast(104%);
  }

  &:hover {
    filter: brightness(0) saturate(100%) invert(48%) sepia(13%) saturate(3207%) hue-rotate(130deg) brightness(95%) contrast(80%);
  }
}
</style>
