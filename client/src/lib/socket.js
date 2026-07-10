import { io } from 'socket.io-client';
import { SERVER_URL } from './constants.js';

// Open a new Socket.io connection to the back-end.
export function createSocket() {
  return io(SERVER_URL, {
    autoConnect: true,
    transports: ['websocket'],
  });
}
