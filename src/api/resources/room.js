import http from '../http';

export default {
  async all() {
    const response = await http.get('/room/');
    return response.data;
  },
};
