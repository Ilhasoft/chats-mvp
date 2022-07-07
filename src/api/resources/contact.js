import http from '../http';

export default {
  async find(id) {
    const response = await http.get(`/contact/${id}`);
    return response.data;
  },
};
