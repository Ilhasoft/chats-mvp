import axios from 'axios';

export const token = process.env.VUE_APP_CHATS_API_TOKEN;

const http = axios.create({
  baseURL: process.env.VUE_APP_CHATS_API_URL,
  headers: {
    Authorization: `Token ${token}`,
  },
});

export default http;
