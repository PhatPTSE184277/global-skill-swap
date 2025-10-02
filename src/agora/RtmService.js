// Real-time chat service using WebSocket
import { io } from 'socket.io-client';

let socket = null;
let isConnected = false;
let currentChannelName = null;
let currentUid = null;
let messageCallback = null;

export const initRtm = async (appId, uid, channelName, onMessageReceived) => {
  try {
    // Prevent duplicate initialization
    if (isConnected && currentChannelName === channelName && currentUid === uid) {
      console.log('🔄 RTM already initialized for this channel and user');
      return true;
    }

    // Clean up previous connection
    if (isConnected) {
      await leaveRtm();
    }

    // Connect to WebSocket server
    socket = io('http://localhost:4000');
    
    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      isConnected = true;
      
      // Join room
      socket.emit('join-room', channelName, `User_${uid}`);
    });

    socket.on('disconnect', () => {
      console.log('📡 WebSocket disconnected');
      isConnected = false;
    });

    // Listen for new messages
    socket.on('new-message', (message) => {
      console.log('📩 Message received:', message);
      if (onMessageReceived) {
        onMessageReceived(message.text, message.sender);
      }
    });

    socket.on('user-joined', (data) => {
      console.log('👤 User joined:', data.userName);
    });

    socket.on('user-left', (data) => {
      console.log('� User left:', data.userName);
    });

    // Store callback for receiving messages
    messageCallback = onMessageReceived;
    currentChannelName = channelName;
    currentUid = uid;

    console.log('✅ WebSocket RTM initialized successfully');
    console.log(`📱 User ${uid} joined channel ${channelName}`);

    return true;
  } catch (error) {
    console.error('❌ Error initializing WebSocket RTM:', error);
    return false;
  }
};

export const sendMessage = async (text) => {
  try {
    if (!socket || !isConnected) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    // Send message via WebSocket
    socket.emit('send-message', {
      roomId: currentChannelName,
      message: text,
      userName: `User_${currentUid}`
    });

    console.log('✅ Message sent:', text);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

// Send screen sharing status to other users
export const sendScreenSharingStatus = async (isSharing) => {
  try {
    if (!socket || !isConnected) {
      console.warn('⚠️ WebSocket not connected for screen sharing signal');
      return false;
    }

    socket.emit('screen-sharing-status', {
      roomId: currentChannelName,
      uid: currentUid,
      isSharing,
      userName: `User_${currentUid}`
    });

    console.log('📺 Screen sharing status sent:', { uid: currentUid, isSharing });
    return true;
  } catch (error) {
    console.error('Error sending screen sharing status:', error);
    return false;
  }
};

// Listen for screen sharing status from other users
export const onScreenSharingStatusReceived = (callback) => {
  if (socket) {
    socket.on('screen-sharing-status', (data) => {
      console.log('📺 Received screen sharing status:', data);
      callback(data);
    });
  }
};

export const leaveRtm = async () => {
  try {
    if (socket && isConnected) {
      socket.disconnect();
      console.log('✅ Left WebSocket RTM channel');
    }
    
    socket = null;
    isConnected = false;
    messageCallback = null;
    currentChannelName = null;
    currentUid = null;
  } catch (error) {
    console.error('Error leaving RTM:', error);
  }
};