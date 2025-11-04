import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_GATEWAY_SERVICE_URL;

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};