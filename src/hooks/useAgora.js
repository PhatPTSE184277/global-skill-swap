import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import socketService from '../services/socketService';
import apiService from '../services/apiService';

const useAgora = () => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [remoteScreenUser, setRemoteScreenUser] = useState(null); // NEW: Track remote screen share
  const [isJoined, setIsJoined] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [agoraTokens, setAgoraTokens] = useState(null);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  
  const clientRef = useRef(null);
  const isLeavingRef = useRef(false);
  const isJoiningRef = useRef(false); // Add joining guard
  const tokenRefreshTimer = useRef(null);
  const currentRoomId = useRef(null);
  const currentUserInfo = useRef(null);

  // Helper function to sanitize channel name for Agora
  const sanitizeChannelName = (name) => {
    if (!name) return 'default';
    
    const sanitized = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 64)
      .trim()
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
    
    return sanitized || 'default';
  };

  // Initialize Agora client
  useEffect(() => {
    AgoraRTC.setLogLevel(1);

    // Initialize socket connection
    socketService.connect();

    return () => {
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
      }
      socketService.disconnect();
      if (tokenRefreshTimer.current) {
        clearInterval(tokenRefreshTimer.current);
      }
    };
  }, []);

  // Setup client event handlers function
  const setupClientEvents = useCallback((client) => {
    // Remove any existing listeners first
    client.removeAllListeners();

    client.on('user-published', async (user, mediaType) => {
      try {
        console.log('👤 User published:', user.uid, 'mediaType:', mediaType);
        await client.subscribe(user, mediaType);
        console.log('👤 Subscribe to user:', user.uid, 'mediaType:', mediaType);
        
        // Enhanced user management - avoid duplicates and handle updates properly
        setRemoteUsers(prevUsers => {
          const existingUserIndex = prevUsers.findIndex(u => u.uid === user.uid);
          
          if (existingUserIndex >= 0) {
            // Update existing user
            const updatedUsers = [...prevUsers];
            updatedUsers[existingUserIndex] = user;
            console.log('📝 Updated existing user:', user.uid);
            return updatedUsers;
          } else {
            // Add new user
            console.log('➕ Added new user:', user.uid);
            return [...prevUsers, user];
          }
        });

        // Play audio track immediately like NEW project
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
          console.log('🎵 Playing audio for user:', user.uid);
        }
      } catch (error) {
        console.error('❌ Error subscribing to user:', user.uid, error);
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      console.log('👤 User unpublished:', user.uid, 'mediaType:', mediaType);
      // Simple approach - just remove the user if they unpublish video
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => {
          const updatedUsers = [...prevUsers];
          const userIndex = updatedUsers.findIndex(u => u.uid === user.uid);
          if (userIndex >= 0) {
            // Remove video track but keep user if they still have audio
            if (user.audioTrack) {
              updatedUsers[userIndex] = { ...user, videoTrack: null };
            } else {
              updatedUsers.splice(userIndex, 1);
            }
          }
          return updatedUsers;
        });
      }
    });

    client.on('user-left', (user) => {
      console.log('👤 User left:', user.uid);
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
    });

    client.on('connection-state-change', (curState, revState) => {
      console.log('🔗 Connection state changed:', revState, '->', curState);
      setConnectionState(curState);
    });

    console.log('✅ Client event handlers setup complete');
  }, []);

  // Setup socket event listeners (simplified)
  useEffect(() => {
    // Debug log states
    console.log('DEBUG: useAgora hook states:', {
      remoteScreenUser,
      isJoined,
      isCameraOn,
      isMicOn,
      isScreenSharing,
      remoteUsersCount: remoteUsers.length
    });

    const cleanupFunctions = [];

    // Media status updates
    cleanupFunctions.push(
      socketService.onMediaStatusUpdate((data) => {
        console.log('📱 Media status update:', data);
        // You can handle remote user media status here if needed
      })
    );

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [remoteScreenUser, isJoined, isCameraOn, isMicOn, isScreenSharing, remoteUsers.length]);

  // Token refresh mechanism
  const setupTokenRefresh = useCallback((tokens) => {
    if (tokenRefreshTimer.current) {
      clearInterval(tokenRefreshTimer.current);
    }

    // Refresh tokens 5 minutes before expiry
    const refreshTime = new Date(tokens.expiresAt).getTime() - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      tokenRefreshTimer.current = setTimeout(async () => {
        try {
          if (currentRoomId.current && currentUserInfo.current) {
            const newTokens = await apiService.refreshAgoraTokens(
              currentRoomId.current, 
              currentUserInfo.current.uid
            );
            
            if (newTokens.success) {
              await clientRef.current?.renewToken(newTokens.data.rtcToken);
              setAgoraTokens(newTokens.data);
              setupTokenRefresh(newTokens.data);
              console.log('🔄 Tokens refreshed successfully');
            }
          }
        } catch (error) {
          console.error('❌ Error refreshing tokens:', error);
        }
      }, refreshTime);
    }
  }, []);

  // Leave channel function (define first to avoid circular dependency)
  const leaveChannel = useCallback(async () => {
    if (isLeavingRef.current) {
      console.log('⚠️ Already in leaving process');
      return;
    }

    isLeavingRef.current = true;
    
    try {
      console.log('🚪 Leaving channel...');

      // Stop all local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      if (localScreenTrack) {
        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);
        setIsScreenSharing(false);
        
        // Notify others about screen sharing stop
        if (currentRoomId.current && currentUserInfo.current) {
          socketService.updateScreenSharingStatus({
            roomId: currentRoomId.current,
            isScreenSharing: false,
            userId: currentUserInfo.current.uid
          });
        }
      }

      // Leave Agora channel
      if (clientRef.current && isJoined) {
        await clientRef.current.leave();
        console.log('✅ Left Agora channel');
      }

      // Leave socket room
      if (currentRoomId.current) {
        socketService.leaveRoom({
          roomId: currentRoomId.current,
          userId: currentUserInfo.current?.uid
        });
      }

      // Reset states
      setIsJoined(false);
      setRemoteUsers([]);
      setRemoteScreenUser(null);
      setConnectionState('DISCONNECTED');
      setAgoraTokens(null);
      setIsCameraOn(false);
      setIsMicOn(false);
      setIsScreenSharing(false);

      // Clear stored info
      currentRoomId.current = null;
      currentUserInfo.current = null;

      // Clear token refresh timer
      if (tokenRefreshTimer.current) {
        clearInterval(tokenRefreshTimer.current);
        tokenRefreshTimer.current = null;
      }

      console.log('✅ Successfully left channel');

    } catch (error) {
      console.error('❌ Error leaving channel:', error);
    } finally {
      isLeavingRef.current = false;
    }
  }, [
    localVideoTrack, 
    localAudioTrack, 
    localScreenTrack, 
    isJoined
  ]);

  // Join channel function
  const joinChannel = useCallback(async (roomId, userName, uid) => {
    // Guard against double invocation (React StrictMode)
    if (isJoiningRef.current) {
      console.log('⚠️ Join already in progress, skipping...');
      return;
    }

    if (isLeavingRef.current) {
      console.log('⚠️ Currently in leaving process, please wait');
      return;
    }

    if (isJoined) {
      console.log('⚠️ Already joined, skipping...');
      return;
    }

    isJoiningRef.current = true; // Set joining flag

    try {
      console.log('� Starting join process...', { roomId, userName, uid });

      // Force cleanup any existing client
      if (clientRef.current) {
        console.log('🧹 Cleaning up existing client...');
        try {
          clientRef.current.removeAllListeners();
          if (clientRef.current.connectionState === 'CONNECTED') {
            await clientRef.current.leave();
          }
        } catch (error) {
          console.warn('⚠️ Cleanup error (continuing):', error.message);
        }
      }

      // Create fresh client
      clientRef.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8'
      });

      const client = clientRef.current;
      console.log('✅ Fresh Agora client created');

      // Setup client event handlers
      setupClientEvents(client);

      // Store current user info
      currentRoomId.current = roomId;
      currentUserInfo.current = { roomId, userName, uid };

      // Join socket room first and wait for confirmation
      await socketService.connect();
      console.log('🔌 Socket connected, joining room...');
      
      socketService.joinRoom({ 
        roomId,
        userName, 
        userId: uid 
      });

      // Wait longer for socket to properly join room and for existing participants info
      console.log('⏳ Waiting for socket room sync...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get Agora tokens from backend
      const tokenResponse = await apiService.joinRoom(roomId, {
        uid: parseInt(uid),
        userName,
        userId: uid
      });

      if (!tokenResponse.success) {
        throw new Error('Failed to get Agora tokens');
      }

      const tokens = tokenResponse.data;
      setAgoraTokens(tokens);
      setupTokenRefresh(tokens);

      // Join Agora channel
      const channelName = sanitizeChannelName(`room_${roomId}`);
      console.log('🎯 Joining Agora channel:', { channelName, uid: parseInt(uid) });
      
      await client.join(
        tokens.appId,
        channelName,
        tokens.rtcToken,
        parseInt(uid)
      );

      setIsJoined(true);
      setConnectionState('CONNECTED');
      console.log('✅ Successfully joined channel');

      // CRITICAL FIX: Subscribe to existing remote users in the channel
      console.log('🔍 Checking for existing remote users...');
      const existingUsers = client.remoteUsers;
      console.log('👥 Found existing remote users:', existingUsers.length);
      
      for (const user of existingUsers) {
        console.log('🔄 Subscribing to existing user:', user.uid);
        try {
          // Subscribe to both video and audio if available
          if (user.hasVideo && user.videoTrack) {
            await client.subscribe(user, 'video');
            console.log('📹 Subscribed to existing user video:', user.uid);
          }
          if (user.hasAudio && user.audioTrack) {
            await client.subscribe(user, 'audio');
            user.audioTrack.play();
            console.log('🎵 Subscribed to existing user audio:', user.uid);
          }
        } catch (error) {
          console.error('❌ Error subscribing to existing user:', user.uid, error);
        }
      }

      // Update remote users state with existing users
      if (existingUsers.length > 0) {
        console.log('📥 Adding existing users to state:', existingUsers.length);
        setRemoteUsers(existingUsers);
      }

      // Don't auto-enable camera and microphone - let user choose
      console.log('✅ Joined successfully - camera and mic are OFF by default');
      
      // Send initial media status to others
      if (currentRoomId.current && currentUserInfo.current) {
        socketService.updateMediaStatus({
          roomId: currentRoomId.current,
          userId: currentUserInfo.current.uid,
          userName: currentUserInfo.current.userName,
          isCameraOn: false, // Start with camera OFF
          isMicOn: false // Start with mic OFF
        });
        console.log('📡 Sent initial media status (both OFF)');
      }

    } catch (error) {
      console.error('❌ Error joining channel:', error);
      setConnectionState('DISCONNECTED');
      throw error;
    } finally {
      isJoiningRef.current = false; // Reset joining flag
    }
  }, [isJoined, setupTokenRefresh, setupClientEvents]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    try {
      if (!localVideoTrack) {
        console.log('📹 Turning camera ON...');
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: '720p_2'
        });
        
        if (isJoined && clientRef.current) {
          console.log('📹 Publishing video track...');
          await clientRef.current.publish(videoTrack);
          console.log('📹 Video track published successfully');
        }
        
        setLocalVideoTrack(videoTrack);
        setIsCameraOn(true);
        console.log('✅ Camera turned ON');
      } else {
        console.log('📹 Turning camera OFF...');
        if (isJoined && clientRef.current) {
          await clientRef.current.unpublish(localVideoTrack);
          console.log('📹 Video track unpublished');
        }
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
        setIsCameraOn(false);
        console.log('✅ Camera turned OFF');
      }

      // Notify others via socket with NEW status
      if (currentRoomId.current && currentUserInfo.current) {
        const newCameraStatus = !localVideoTrack ? true : false; // True if we just turned ON, false if we just turned OFF
        socketService.updateMediaStatus({
          roomId: currentRoomId.current,
          userId: currentUserInfo.current.uid,
          userName: currentUserInfo.current.userName,
          isCameraOn: newCameraStatus,
          isMicOn: isMicOn
        });
        console.log('📡 Sent camera status update:', { isCameraOn: newCameraStatus, isMicOn });
      }

    } catch (error) {
      console.error('❌ Error toggling camera:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
      
      // Specific error handling
      if (error.code === 'PERMISSION_DENIED') {
        alert('Vui lòng cấp quyền truy cập camera để sử dụng chức năng này');
      } else if (error.code === 'DEVICE_NOT_FOUND') {
        alert('Không tìm thấy camera trên thiết bị');
      } else if (error.code === 'DEVICE_BUSY') {
        alert('Camera đang được sử dụng bởi ứng dụng khác');
      } else {
        alert('Lỗi khi bật/tắt camera: ' + error.message);
      }
      
      throw error;
    }
  }, [localVideoTrack, isJoined, isCameraOn, isMicOn]);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    try {
      if (!localAudioTrack) {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          echoCancellation: true,
          noiseSuppression: true
        });
        
        if (isJoined) {
          await clientRef.current.publish(audioTrack);
        }
        
        setLocalAudioTrack(audioTrack);
        setIsMicOn(true);
      } else {
        await clientRef.current.unpublish(localAudioTrack);
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
        setIsMicOn(false);
      }

      // Notify others via socket with NEW status
      if (currentRoomId.current && currentUserInfo.current) {
        const newMicStatus = !localAudioTrack ? true : false; // True if we just turned ON, false if we just turned OFF
        socketService.updateMediaStatus({
          roomId: currentRoomId.current,
          userId: currentUserInfo.current.uid,
          userName: currentUserInfo.current.userName,
          isCameraOn: isCameraOn,
          isMicOn: newMicStatus
        });
        console.log('📡 Sent mic status update:', { isCameraOn, isMicOn: newMicStatus });
      }

    } catch (error) {
      console.error('❌ Error toggling microphone:', error);
      throw error;
    }
  }, [localAudioTrack, isJoined, isCameraOn, isMicOn]);

  // Toggle screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Stopping screen share...');
      
      if (localScreenTrack) {
        // Unpublish screen track
        if (isJoined) {
          console.log('📡 Unpublishing screen track');
          await clientRef.current.unpublish(localScreenTrack);
        }

        console.log('🛑 Stopping and closing screen track');
        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);

        // Republish camera if it was on (like in NEW project)
        if (localVideoTrack && isJoined) {
          console.log('📹 Republishing camera track after screen share');
          await clientRef.current.publish(localVideoTrack);
        }
      }

      setIsScreenSharing(false);

      // Notify others via socket
      if (currentRoomId.current && currentUserInfo.current) {
        socketService.updateScreenSharingStatus({
          roomId: currentRoomId.current,
          isScreenSharing: false,
          userId: currentUserInfo.current.uid
        });
      }

      console.log('✅ Screen sharing stopped successfully');

    } catch (error) {
      console.error('❌ Error stopping screen share:', error);
      throw error;
    }
  }, [localScreenTrack, localVideoTrack, isJoined]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing (similar to NEW project pattern)
        console.log('🖥️ Starting screen share...');
        
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_2',
          optimizationMode: 'detail'
        });

        // Log track info for debugging
        const mediaStreamTrack = screenTrack.getMediaStreamTrack();
        console.log('🖥️ Screen track created:', {
          label: mediaStreamTrack?.label,
          kind: mediaStreamTrack?.kind,
          source: screenTrack._source
        });

        // If camera is on, unpublish it temporarily
        if (localVideoTrack && isJoined) {
          console.log('📹 Unpublishing camera track during screen share');
          await clientRef.current.unpublish(localVideoTrack);
        }

        // Publish screen track
        if (isJoined) {
          console.log('📡 Publishing screen track');
          await clientRef.current.publish(screenTrack);
        }

        setLocalScreenTrack(screenTrack);
        setIsScreenSharing(true);

        // Handle screen share end (when user stops sharing via browser)
        screenTrack.on('track-ended', async () => {
          console.log('🖥️ Screen track ended by user');
          await stopScreenShare();
        });

        // Notify others via socket
        if (currentRoomId.current && currentUserInfo.current) {
          socketService.updateScreenSharingStatus({
            roomId: currentRoomId.current,
            isScreenSharing: true,
            userId: currentUserInfo.current.uid
          });
        }

        console.log('✅ Screen sharing started successfully');

      } else {
        console.log('🖥️ Stopping screen share...');
        await stopScreenShare();
      }
    } catch (error) {
      console.error('❌ Error toggling screen share:', error);
      if (error.message.includes('Permission denied')) {
        console.log('⚠️ Screen share permission denied by user');
      }
      throw error;
    }
  }, [isScreenSharing, localVideoTrack, isJoined, stopScreenShare]);

  return {
    // States
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    remoteUsers,
    remoteScreenUser: remoteScreenUser || null, // NEW: Expose remote screen user with fallback
    isJoined,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    connectionState,
    agoraTokens,
    
    // Functions
    joinChannel,
    leaveChannel,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
    stopScreenShare,
    
    // Utility
    client: clientRef.current,
    socketService
  };
};

export default useAgora;