import {
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
  removeAwarenessStates,
} from 'y-protocols/awareness';
import { CRDT_EVENTS, toBytes } from './events.js';

// Synchronize a Yjs Awareness instance with peers over Socket.io.
export class AwarenessSync {
  constructor(socket, roomId, awareness) {
    this.socket = socket;
    this.roomId = roomId;
    this.awareness = awareness;
    this.onLocalUpdate = this.onLocalUpdate.bind(this);
    this.onRemote = this.onRemote.bind(this);
  }

  // Encode and emit an awareness update for the given client ids.
  emitFor(clients) {
    const update = encodeAwarenessUpdate(this.awareness, clients);
    this.socket.emit(CRDT_EVENTS.AWARENESS, { roomId: this.roomId, update });
  }

  // Forward local awareness changes to peers.
  onLocalUpdate({ added, updated, removed }) {
    this.emitFor([...added, ...updated, ...removed]);
  }

  // Apply an awareness update received from a peer.
  onRemote(payload) {
    if (!payload || payload.roomId !== this.roomId || !payload.update) {
      return;
    }
    applyAwarenessUpdate(this.awareness, toBytes(payload.update), this);
  }

  // Re-broadcast the local awareness state so newcomers receive it.
  broadcastLocal() {
    this.emitFor([this.awareness.clientID]);
  }

  // Attach awareness and socket listeners.
  connect() {
    this.awareness.on('update', this.onLocalUpdate);
    this.socket.on(CRDT_EVENTS.AWARENESS, this.onRemote);
    return this;
  }

  // Detach listeners and clear the local awareness state.
  destroy() {
    this.awareness.off('update', this.onLocalUpdate);
    this.socket.off(CRDT_EVENTS.AWARENESS, this.onRemote);
    removeAwarenessStates(this.awareness, [this.awareness.clientID], 'local');
  }
}
