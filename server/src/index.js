import { createServer } from 'http';
import { createApp } from './app.js';
import { attachSocket } from './realtime/socket.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

// Bootstrap the HTTP and realtime servers and start listening.
function start() {
  const app = createApp();
  const httpServer = createServer(app);
  attachSocket(httpServer);
  httpServer.listen(config.port, () => {
    logger.info(`server listening on port ${config.port}`);
  });
}

start();
