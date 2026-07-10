import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { createSocket } from './socket.js';
import { ROOM_EVENTS } from './events.js';
import { SocketProvider } from '../crdt/socket-provider.js';
import { AwarenessSync } from '../crdt/awareness-sync.js';

// Own the socket, Yjs document, awareness and providers for a single room.
export class RoomConnection {
  constructor(roomId, user) {
    this.roomId = roomId;
    this.user = user;
    this.doc = new Y.Doc();
    this.text = this.doc.getText('code');
    this.socket = createSocket();
    this.awareness = new Awareness(this.doc);
    this.awareness.setLocalStateField('user', user);
    this.provider = new SocketProvider(this.socket, roomId, this.doc);
    this.awarenessSync = new AwarenessSync(this.socket, roomId, this.awareness);
    this.join = this.join.bind(this);
    this.onPeerJoined = this.onPeerJoined.bind(this);
  }

  // Emit the room join request and (re)start CRDT synchronization.
  join() {
    this.socket.emit(ROOM_EVENTS.JOIN, { roomId: this.roomId, user: this.user });
    this.provider.start();
    this.awarenessSync.broadcastLocal();
  }

  // Re-send the local cursor state whenever a new peer joins.
  onPeerJoined() {
    this.awarenessSync.broadcastLocal();
  }

  // Connect providers and wire (re)join handlers.
  connect() {
    this.provider.connect();
    this.awarenessSync.connect();
    this.socket.on('connect', this.join);
    this.socket.on(ROOM_EVENTS.PRESENCE_JOINED, this.onPeerJoined);
    return this;
  }

  // Leave the room and tear down every resource.
  disconnect() {
    this.socket.off('connect', this.join);
    this.socket.off(ROOM_EVENTS.PRESENCE_JOINED, this.onPeerJoined);
    this.socket.emit(ROOM_EVENTS.LEAVE, { roomId: this.roomId });
    this.awarenessSync.destroy();
    this.provider.destroy();
    this.awareness.destroy();
    this.socket.disconnect();
    this.doc.destroy();
  }
}
