import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  connect(serverUrl = import.meta.env.VITE_SOCKET_URL) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
    });

    // Re-register all custom listeners
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach(listener => {
        this.socket.on(event, listener);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  // Room management
  joinRoom(roomData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', roomData);
      return true;
    } else {
      return false;
    }
  }

  leaveRoom(roomData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', roomData);
    }
  }

  // Chat functionality - use NEW project pattern only
  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send-message', messageData);
      return true;
    } else {
      return false;
    }
  }

  // Listen for receive-message (NEW project pattern)
  onReceiveMessage(callback) {
    return this.on('receive-message', callback);
  }

  // Legacy methods (kept for backward compatibility but not used)
  sendChatMessage(messageData) {
    return this.sendMessage(messageData);
  }

  onChatMessage(callback) {
    return this.on('new-chat-message', callback);
  }

  // Media status updates
  updateMediaStatus(statusData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('media-status-update', statusData);
    }
  }

  onMediaStatusUpdate(callback) {
    return this.on('user-media-status-update', callback);
  }

  // Screen sharing
  updateScreenSharingStatus(statusData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('screen-sharing-update', statusData);
    }
  }

  onScreenSharingUpdate(callback) {
    return this.on('user-screen-sharing-update', callback);
  }

  // User status updates
  updateUserStatus(statusData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user-status-update', statusData);
    }
  }

  onUserStatusUpdate(callback) {
    return this.on('user-status-update', callback);
  }

  // Participant management
  onUserJoined(callback) {
    return this.on('user-joined', callback);
  }

  onUserLeft(callback) {
    return this.on('user-left', callback);
  }

  onRoomParticipants(callback) {
    return this.on('room-participants', callback);
  }

  // Generic event handling
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }

    // Return cleanup function
    return () => {
      this.off(event, callback);
    };
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback);
      if (this.eventListeners.get(event).size === 0) {
        this.eventListeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Utility methods
  getConnectionState() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
    };
  }

  reconnect() {
    if (this.socket) {
      this.socket.connect();
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;