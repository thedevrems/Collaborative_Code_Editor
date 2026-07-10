import { Server } from 'socket.io';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Attach a Socket.io server to an existing HTTP server and log connections.
export function attachSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: config.clientOrigin, methods: ['GET', 'POST'] },
  });
  io.on('connection', (socket) => {
    logger.info(`socket connected: ${socket.id}`);
    socket.on('disconnect', (reason) => {
      logger.info(`socket disconnected: ${socket.id} (${reason})`);
    });
  });
  return io;
}
