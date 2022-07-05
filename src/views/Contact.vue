<template>
  <section class="contact-view">
    <section class="chat">
      <header class="chat__header">
        <div class="chat__avatar">{{ agentFirstNameCharacter }}</div>
        <div class="chat__user">
          <span class="chat__user__name">{{ agent.name }}</span>
          <span class="chat__user__email">{{ agent.email }}</span>
        </div>
      </header>

      <div class="chat__messages">
        <div class="chat__divider">
          <div class="chat__divider__line"></div>
          <div class="chat__divider__label">{{ today }}</div>
          <div class="chat__divider__line"></div>
        </div>

        <div class="chat__begin">Chat iniciado</div>

        <div
          v-for="message in messages"
          :key="message.id"
          class="chat__message"
          :class="{ 'chat__message--self': message.username === 'João da Silva' }"
        >
          <div class="chat__message__username">{{ message.username }}</div>
          <div v-for="msg in message.content" :key="msg.text" class="chat__message__content">
            {{ msg.text }}
          </div>
        </div>
      </div>

      <section class="chat__text-input">
        <unnnic-input
          v-model="message"
          placeholder="Digite sua mensagem aqui"
          @keypress.enter="sendMessage(message)"
        />
      </section>
    </section>
  </section>
</template>

<script>
import http from '@/api/http';

export default {
  name: 'ContactView',

  async mounted() {
    const url = new URL(`ws://localhost:8000/ws/contact/rooms/1/`);
    const ws = new WebSocket(url);
    ws.onmessage = (msg) => {
      const message = JSON.parse(JSON.parse(msg.data));

      this.$store.commit('chats/addChatMessage', { message });
    };
  },

  data: () => ({
    message: '',
    agent: {
      name: 'Matheus Pedroni',
      email: 'matheus.pedroni@weni.ai',
    },
  }),

  computed: {
    agentFirstNameCharacter() {
      return this.agent.name.charAt(0)?.toUpperCase?.();
    },
    today() {
      const today = new Date();
      return Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
      }).format(today);
    },
    messages() {
      const { chats } = this.$store.state.chats;

      if (chats.length === 0) return [];

      return chats[0].chats[0].messages;
    },
  },

  methods: {
    async sendMessage(message) {
      await http.post('/msg/', {
        text: message,
        seen: false,
        room: 1,
        user: null,
        contact: 1,
      });

      this.message = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.contact-view {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $unnnic-color-background-grass;

  .chat {
    display: flex;
    flex-direction: column;

    width: 350px;
    height: 500px;
    background: $unnnic-color-background-carpet;
    box-shadow: $unnnic-shadow-level-far;

    &__header {
      display: flex;
      align-items: stretch;
      gap: 1rem;
      background: $unnnic-color-brand-weni-dark;
      padding: 0.5rem 1rem;
    }

    &__avatar {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: $unnnic-border-radius-sm;
      background: rgba($unnnic-color-brand-weni, 0.28);
      color: $unnnic-color-neutral-lightest;
      height: 3rem;
      width: 3rem;

      &::after {
        content: '';
        position: absolute;
        right: -6px;
        bottom: -6px;
        background: $unnnic-color-feedback-green;
        border: 3px solid $unnnic-color-brand-weni-dark;
        height: 8px;
        width: 8px;
        border-radius: 50%;
      }
    }

    &__user {
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      &__name {
        color: $unnnic-color-neutral-lightest;
      }

      &__email {
        font-size: 0.75rem;
        color: $unnnic-color-neutral-lightest;
      }
    }

    &__messages {
      flex: 1 1;
      padding: 1rem;
      overflow-y: auto;
    }

    &__message {
      display: flex;
      flex-direction: column;

      & + * {
        padding-top: 1rem;
      }

      &--self {
        align-items: flex-end;
      }

      &__username {
        color: $unnnic-color-neutral-dark;
      }

      &__content {
        color: $unnnic-color-neutral-black;
      }
    }

    &__divider {
      display: flex;
      align-items: center;
      gap: 1rem;

      &__line {
        flex: 1 1;
        height: 1px;
        background: $unnnic-color-neutral-clean;
      }

      &__label {
        font-size: 0.75rem;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__begin {
      text-align: center;
      font-size: 0.75rem;
      color: $unnnic-color-neutral-cloudy;
      margin: 1.5rem 0 1rem;
    }

    &__text-input {
      padding: 0 1rem 1rem;
    }
  }
}
</style>
