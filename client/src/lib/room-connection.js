import * as Y from 'yjs';
import { createSocket } from './socket.js';
import { ROOM_EVENTS } from './events.js';
import { SocketProvider } from '../crdt/socket-provider.js';

// Own the socket, Yjs document and provider lifecycle for a single room.
export class RoomConnection {
  constructor(roomId, user) {
    this.roomId = roomId;
    this.user = user;
    this.doc = new Y.Doc();
    this.socket = createSocket();
    this.provider = new SocketProvider(this.socket, roomId, this.doc);
    this.text = this.doc.getText('code');
    this.join = this.join.bind(this);
  }

  // Emit the room join request and (re)start CRDT synchronization.
  join() {
    this.socket.emit(ROOM_EVENTS.JOIN, {
      roomId: this.roomId,
      user: this.user,
    });
    this.provider.start();
  }

  // Connect the provider and (re)join the room on every connect event.
  connect() {
    this.provider.connect();
    this.socket.on('connect', this.join);
    return this;
  }

  // Leave the room and tear down provider and socket resources.
  disconnect() {
    this.socket.off('connect', this.join);
    this.socket.emit(ROOM_EVENTS.LEAVE, { roomId: this.roomId });
    this.provider.destroy();
    this.socket.disconnect();
    this.doc.destroy();
  }
}
