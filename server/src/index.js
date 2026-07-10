import { createServer } from 'http';
import { createApp } from './app.js';
import { attachSocket } from './realtime/socket.js';
import { migrate } from './db/migrate.js';
import { scheduleSnapshots } from './persistence/snapshot.service.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

// Bootstrap the database, HTTP and realtime servers and start listening.
async function start() {
  await migrate();
  const app = createApp();
  const httpServer = createServer(app);
  attachSocket(httpServer);
  httpServer.listen(config.port, () => {
    logger.info(`server listening on port ${config.port}`);
    scheduleSnapshots();
  });
}

start().catch((error) => {
  logger.error(`failed to start server: ${error.message}`);
  process.exit(1);
});
