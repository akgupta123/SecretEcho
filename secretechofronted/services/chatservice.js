
import api from './ApiService';

const API_URL = process.env.NEXT_BACKEND_API_URL

export const getMessages = async () => {
  const response = await api.get(`${API_URL}/chat/message`);
  return response.data;
};

export const sendMessage = async (content) => {
  const response = await api.post(
    `${API_URL}/chat/message`,
    { content },
  );
  return response.data;
};