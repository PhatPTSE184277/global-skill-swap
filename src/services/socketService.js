import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map();
  }

  connect(serverUrl = import.meta.env.VITE_SOCKET_URL) {
    try {
      if (this.socket && this.isConnected) {
        console.log("🔌 Reusing existing socket connection:", this.socket.id);
        return this.socket;
      }

      if (!serverUrl) {
        console.error("❌ No socket URL provided");
        return null;
      }
      
      console.log("🔌 Connecting to socket server:", serverUrl);
      
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
    } catch (error) {
      console.error("❌ Error connecting to socket:", error);
      return null;
    }
  }

  setupEventHandlers() {
    if (!this.socket) {
      console.warn("⚠️ Cannot set up event handlers - socket is null");
      return;
    }

    this.socket.on('connect', () => {
      console.log(`🔌 Socket connected with ID: ${this.socket.id}`);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected. Reason: ${reason}`);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error(`🔌 Socket connection error: ${error.message}`);
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
    console.log("🔌 Joining room:", roomData);
    if (!this.socket) {
      console.error("❌ Cannot join room - socket is null");
      return false;
    }
    
    if (!this.isConnected) {
      console.error("❌ Cannot join room - socket not connected");
      return false;
    }
    
    try {
      this.socket.emit('join-room', roomData);
      console.log(`✅ Join room request sent for room: ${roomData.roomId}`);
      return true;
    } catch (error) {
      console.error("❌ Error joining room:", error);
      return false;
    }
  }

  leaveRoom(roomData) {
    console.log("🔌 Leaving room:", roomData);
    if (!this.socket) {
      console.error("❌ Cannot leave room - socket is null");
      return false;
    }
    
    try {
      this.socket.emit('leave-room', roomData);
      console.log(`✅ Leave room request sent for room: ${roomData.roomId}`);
      return true;
    } catch (error) {
      console.error("❌ Error leaving room:", error);
      return false;
    }
  }

  // Chat functionality - use NEW project pattern only
  sendMessage(messageData) {
    if (this.socket && this.isConnected) {
      try {
        console.log("🔌 Socket sending message:", messageData);
        this.socket.emit('send-message', messageData);
        return true;
      } catch (error) {
        console.error("🔌 Socket error sending message:", error);
        return false;
      }
    } else {
      console.warn("🔌 Cannot send message - socket not connected");
      return false;
    }
  }

  // Listen for receive-message (NEW project pattern)
  onReceiveMessage(callback) {
    console.log("🔌 Setting up receive-message listener");
    return this.on('receive-message', (message) => {
      console.log("🔌 Socket received message:", message);
      callback(message);
    });
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
    console.log(`🔌 Registering listener for event: ${event}`);
    
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);

    if (this.socket) {
      console.log(`🔌 Attaching ${event} listener to active socket: ${this.socket.id}`);
      this.socket.on(event, callback);
    } else {
      console.warn(`⚠️ Socket not available when registering ${event} listener`);
    }

    // Return cleanup function
    return () => {
      console.log(`🔌 Removing listener for event: ${event}`);
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