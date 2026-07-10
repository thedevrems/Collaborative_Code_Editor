import { Server } from 'socket.io';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { registerRoomHandlers } from './handlers.js';

// Attach a Socket.io server and wire realtime room handlers per connection.
export function attachSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: config.clientOrigin, methods: ['GET', 'POST'] },
  });
  io.on('connection', (socket) => {
    logger.info(`socket connected: ${socket.id}`);
    registerRoomHandlers(io, socket);
  });
  return io;
}
