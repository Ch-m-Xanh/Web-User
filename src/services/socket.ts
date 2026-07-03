import { io, type Socket } from 'socket.io-client';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../api/client';

/**
 * Socket.IO connects to the same host/port as the REST API but without the
 * `/api` suffix (the REST API is mounted under `/api`, Socket.IO listens on
 * the bare server root).
 */
function resolveSocketBaseUrl(): string {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

let socket: Socket | null = null;

/**
 * Lazily creates (or returns) the singleton Socket.IO client. The auth token
 * (if any) is read fresh from localStorage every time we (re)connect so the
 * server can join the caller into their private `user:<userId>` room.
 */
export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(resolveSocketBaseUrl(), {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: (callback) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      callback({ token });
    },
  });

  return socket;
}

/**
 * Forces the socket to reconnect with a fresh auth token — call this right
 * after login/logout so the server re-evaluates which private room to join.
 */
export function reconnectSocket(): void {
  if (!socket) {
    getSocket();
    return;
  }
  socket.disconnect();
  socket.connect();
}

export function disconnectSocket(): void {
  socket?.disconnect();
}
