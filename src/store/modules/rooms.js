import Room from '@/api/resources/room';
import Contact from '@/api/resources/contact';

const mutations = {
  SET_ROOMS: 'SET_ROOMS',
};

export default {
  namespaced: true,
  state: {
    open: [],
  },

  mutations: {
    [mutations.SET_ROOMS](state, rooms) {
      state.open = rooms || [];
    },
  },

  actions: {
    async all({ state, commit }) {
      if (state.open.length > 0) return state.open;

      const resp = await Room.all();
      const rooms = resp.results;

      const contact = await Contact.find(1);

      const parsedRooms = rooms.map((room) => ({
        ...room,
        contact: { ...contact, username: contact.name },
      }));
      commit(mutations.SET_ROOMS, parsedRooms);

      return parsedRooms;
    },
  },
};
