import { io } from "socket.io-client";

export let socket = null;
export const initializeSocket = (token) => {
  console.log(token,'token')


  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL
  
  socket = io(SOCKET_URL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`
    },
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const emitTyping = (isTyping) => {
  if (socket) {
    socket.emit('typing', isTyping);
  }
};