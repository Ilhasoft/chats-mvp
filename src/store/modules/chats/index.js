import quickMessagesModule from './quickMessages';

const tags = [
  { text: 'Dúvidas', value: 'doubts' },
  { text: 'Financeiro', value: 'finance' },
  { text: 'Ajuda', value: 'help' },
];

const module = {
  namespaced: true,
  modules: {
    quickMessages: quickMessagesModule,
  },
  state: {
    activeChat: null,
    chats: [],
    closedChats: [],
    tags,
  },

  mutations: {
    addChatMessage(state, message) {
      console.log(message);
      const msg = message.message.content ? message.message.content : message.message;
      const m = {
        id: msg.id,
        username: msg.contact ? 'João da Silva' : 'Matheus Pedroni',
        time: `${new Date().getHours()}h${String(new Date().getMinutes()).padStart(2, '0')}`,
        content: [{ text: msg.text }],
      };

      if (state.chats[0]) state.chats[0].chats[0].messages.push(m);
      else state.chats[0] = { chats: [{ messages: [m] }] };

      state.chats = [...state.chats];
    },

    addChatGroup(state, group) {
      state.chats.push(group);
    },

    addClosedChat(state, chat) {
      state.closedChats.unshift(chat);
    },
    removeChat(state, chatToRemove) {
      state.chats = state.chats.map((group) => ({
        ...group,
        chats: group.chats.filter((c) => c.id !== chatToRemove.id),
      }));
    },
    reorderChats(state, activeChat) {
      const activeChatGroup = state.chats.find(
        (group) => !!group.chats.find((chat) => chat.id === activeChat.id),
      );

      activeChatGroup.chats = activeChatGroup.chats.filter((chat) => chat.id !== activeChat.id);
      activeChatGroup.chats.unshift(activeChat);
    },
    setActiveChat(state, chat) {
      state.activeChat = chat ? { ...chat, unreadMessages: 0 } : null;

      if (!chat) return;

      state.chats = state.chats.map((group) => ({
        ...group,
        chats: group.chats.map((c) => (c.id === chat.id ? { ...c, unreadMessages: 0 } : c)),
      }));
    },
    sendMessage(state, message) {
      if (!state.activeChat) return;

      const { messages } = state.activeChat;

      if (messages.at(-1)?.username === 'Agente') {
        messages.at(-1).content.push(message);
      } else {
        messages.push({
          id: Math.ceil(Math.random() * 100 + 1),
          username: 'Agente',
          time: `${new Date().getHours().toString().padStart(2, '0')}h${new Date()
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
          content: [message],
        });
      }

      state.activeChat.messages = messages;
    },
  },

  getters: {
    getChatById(state) {
      const chats = state.chats.map((chatGroup) => chatGroup.chats).flat();

      return (id) => chats.find((chat) => chat.id === Number(id));
    },
  },

  actions: {
    closeChat({ commit }, chat) {
      commit('removeChat', chat);

      const formattedChat = {
        ...chat,
        rooms: [
          {
            agent: chat.agent,
            messages: chat.messages,
            tags: chat.tags,
            closedBy: 'agent',
          },
        ],
      };

      commit('addClosedChat', formattedChat);
    },
    sendMessage({ commit, state }, content) {
      if (!state.activeChat) return;

      const message =
        typeof content === 'string' ? { text: content, sent: Math.random() < 0.1 } : content;

      commit('sendMessage', message);
      commit('reorderChats', state.activeChat);
    },
  },
};

export default module;
