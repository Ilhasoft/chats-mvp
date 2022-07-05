<template>
  <div class="container">
    <section class="chat-groups">
      <chat-group
        v-for="group in groups"
        :key="group.name"
        :chat-group="group"
        :filled="group.name === 'Fila'"
        :disabled="disabled"
      />
    </section>

    <unnnic-button
      :text="isActiveChatView ? 'Visualizar histórico' : 'Voltar para chats'"
      :iconRight="isActiveChatView ? 'task-list-clock-1' : ''"
      :iconLeft="isActiveChatView ? '' : 'keyboard-arrow-left-1'"
      type="secondary"
      size="small"
      @click="$router.push(isActiveChatView ? '/closed-chats' : '/')"
    />
  </div>
</template>

<script>
import Room from '@/api/resources/room';
import { mapState } from 'vuex';

import ChatGroup from './ChatGroup';

export default {
  name: 'TheChatList',

  components: {
    ChatGroup,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  async mounted() {
    if (this.groups.length === 0) {
      const response = await Room.all();
      const rooms = response.results;

      const group = {
        name: 'Chats abertos',
        chats: [{ ...rooms[0], username: 'João da Silva', messages: [] }],
      };
      this.$store.commit('chats/addChatGroup', group);
    }
  },

  data: () => ({
    tag: '',
  }),

  computed: {
    ...mapState({
      groups: (state) => state.chats.chats,
    }),
    isActiveChatView() {
      return ['home', 'chat'].includes(this.$route.name);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-stack-xs;
  padding-bottom: $unnnic-spacing-inset-nano;

  .chat-groups {
    flex: 1 1;

    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-stack-md;

    padding-right: $unnnic-spacing-inset-xs;
    overflow-y: auto;
  }
}
</style>
