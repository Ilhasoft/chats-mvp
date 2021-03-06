<template>
  <section>
    <div class="suggestion-box-container">
      <div class="suggestion-box">
        <suggestion-box
          :search="message"
          :suggestions="shortcuts"
          :keyboard-event="keyboardEvent"
          @open="isSuggestionBoxOpen = true"
          @close="isSuggestionBoxOpen = false"
          @select="(message = $event.preview), focusTextEditor()"
        />
      </div>
    </div>

    <div class="message-editor">
      <unnnic-text-editor
        v-model="message"
        @send="send"
        @keydown="onKeyDown"
        @action="$emit('show-quick-messages')"
        @record-audio-down="record"
        @record-audio-up="stopRecord"
        ref="textEditor"
      >
        <template #footer-input>
          <unnnic-audio-recorder
            v-show="isAudioRecorderVisible"
            v-model="recordedAudio"
            ref="audioRecorder"
          />
        </template>
      </unnnic-text-editor>

      <file-uploader v-if="false" v-model="files" @upload="upload">
        <template #trigger="{ open }">
          <unnnic-tool-tip enabled text="Enviar mídia" side="top">
            <unnnic-dropdown position="top-left">
              <template #trigger>
                <slot name="trigger">
                  <unnnic-button-icon slot="trigger" icon="upload-bottom-1" size="small" />
                </slot>
              </template>
              <unnnic-dropdown-item>
                <span
                  class="upload-dropdown-option"
                  @click="open('media')"
                  @keypress.enter="open('media')"
                >
                  <unnnic-icon-svg icon="video-file-mp4-1" />
                  <span> Enviar foto ou vídeo </span>
                </span>
              </unnnic-dropdown-item>
              <unnnic-dropdown-item>
                <span
                  class="upload-dropdown-option"
                  @click="open('document')"
                  @keypress.enter="open('document')"
                >
                  <unnnic-icon-svg icon="upload-bottom-1" />
                  <span> Enviar documento </span>
                </span>
              </unnnic-dropdown-item>
            </unnnic-dropdown>
          </unnnic-tool-tip>
        </template>
      </file-uploader>
    </div>
  </section>
</template>

<script>
import FileUploader from '@/components/chats/FileUploader';
import SuggestionBox from './SuggestionBox.vue';

export default {
  name: 'MessageEditor',

  components: {
    FileUploader,
    SuggestionBox,
  },

  props: {
    audio: {
      type: HTMLAudioElement,
      default: null,
    },
    value: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    files: [],
    keyboardEvent: null,
    isSuggestionBoxOpen: false,
    recording: false,
  }),

  computed: {
    message: {
      get() {
        return this.value;
      },
      set(message) {
        this.$emit('input', message);
      },
    },
    recordedAudio: {
      get() {
        return this.audio;
      },
      set(audio) {
        this.$emit('update:audio', audio);
      },
    },
    isAudioRecorderVisible() {
      return !!this.audio || this.recording;
    },
    shortcuts() {
      const quickMessages = this.$store.state.chats.quickMessages.messages;

      return quickMessages
        .filter((message) => !!message.shortcut)
        .map(({ shortcut, message }) => ({
          shortcut,
          preview: message,
        }));
    },
  },

  methods: {
    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
      if (this.isSuggestionBoxOpen) {
        this.keyboardEvent = event;
        return;
      }

      if (event.key === 'Enter') this.sendMessage();
    },
    record() {
      this.recording = true;
      this.$refs.audioRecorder?.record();
    },
    stopRecord() {
      this.recording = false;
      this.$refs.audioRecorder?.stop();
    },
    send() {
      this.sendMessage();
      this.sendAudio();
    },
    sendMessage() {
      this.$emit('send-message');
    },
    sendAudio() {
      this.$emit('send-audio');
    },
    upload() {
      this.$emit('upload', [...this.files]);
    },
    focusTextEditor() {
      this.$refs.textEditor?.focus?.();
    },
  },
};
</script>

<style lang="scss" scoped>
.message-editor {
  .suggestion-box-container {
    position: relative;

    .suggestion-box {
      margin-bottom: $unnnic-spacing-inline-xs;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
