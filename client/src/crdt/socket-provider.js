import * as Y from 'yjs';
import { CRDT_EVENTS, toBytes } from './events.js';

// Bridge a Yjs document to the server over a Socket.io connection.
export class SocketProvider {
  constructor(socket, roomId, doc) {
    this.socket = socket;
    this.roomId = roomId;
    this.doc = doc;
    this.origin = { provider: true };
    this.onDocUpdate = this.onDocUpdate.bind(this);
    this.applyRemote = this.applyRemote.bind(this);
    this.onServerStep1 = this.onServerStep1.bind(this);
  }

  // Attach document and socket listeners, then start the initial handshake.
  connect() {
    this.doc.on('update', this.onDocUpdate);
    this.socket.on(CRDT_EVENTS.SYNC_STEP2, this.applyRemote);
    this.socket.on(CRDT_EVENTS.UPDATE, this.applyRemote);
    this.socket.on(CRDT_EVENTS.SYNC_STEP1, this.onServerStep1);
    this.start();
    return this;
  }

  // Send the local state vector to request the server's missing updates.
  start() {
    this.socket.emit(CRDT_EVENTS.SYNC_STEP1, {
      roomId: this.roomId,
      stateVector: Y.encodeStateVector(this.doc),
    });
  }

  // Forward locally originated document updates to the server.
  onDocUpdate(update, updateOrigin) {
    if (updateOrigin === this.origin) {
      return;
    }
    this.socket.emit(CRDT_EVENTS.UPDATE, { roomId: this.roomId, update });
  }

  // Apply an update received from the server to the local document.
  applyRemote(payload) {
    if (!payload || payload.roomId !== this.roomId || !payload.update) {
      return;
    }
    Y.applyUpdate(this.doc, toBytes(payload.update), this.origin);
  }

  // Answer the server's state vector with the updates it is missing.
  onServerStep1(payload) {
    if (!payload || payload.roomId !== this.roomId) {
      return;
    }
    const update = Y.encodeStateAsUpdate(this.doc, toBytes(payload.stateVector));
    this.socket.emit(CRDT_EVENTS.SYNC_STEP2, { roomId: this.roomId, update });
  }

  // Detach all listeners bound by this provider.
  destroy() {
    this.doc.off('update', this.onDocUpdate);
    this.socket.off(CRDT_EVENTS.SYNC_STEP2, this.applyRemote);
    this.socket.off(CRDT_EVENTS.UPDATE, this.applyRemote);
    this.socket.off(CRDT_EVENTS.SYNC_STEP1, this.onServerStep1);
  }
}
