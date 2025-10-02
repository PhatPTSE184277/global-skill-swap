import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { sendScreenSharingStatus, onScreenSharingStatusReceived } from '../agora/RtmService';

const useAgora = () => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [remoteScreenSharingUsers, setRemoteScreenSharingUsers] = useState(new Set());
  const [isJoined, setIsJoined] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const clientRef = useRef(null);
  const isLeavingRef = useRef(false);

  // Helper function to sanitize channel name for Agora
  const sanitizeChannelName = (name) => {
    if (!name) return 'default';
    
    // Replace Vietnamese/Unicode characters with safe alternatives
    const sanitized = name
      .normalize('NFD') // Decompose accented characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .replace(/[đĐ]/g, 'd') // Replace đ/Đ with d
      .replace(/[^a-zA-Z0-9_-]/g, '_') // Only allow letters, numbers, underscore, and hyphen
      .substring(0, 64) // Limit to 64 characters
      .trim()
      .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
      .replace(/_+/g, '_'); // Replace multiple underscores with single
    
    return sanitized || 'default';
  };

  useEffect(() => {
    // Initialize Agora client with better network configuration
    clientRef.current = AgoraRTC.createClient({ 
      mode: 'rtc', 
      codec: 'vp8',
      clientRoleOptions: {
        level: AgoraRTC.AUDIENCE_LEVEL_HIGH_LATENCY
      }
    });
    
    // Set log level for debugging
    AgoraRTC.setLogLevel(1); // 0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR, 4: NONE
    
    const client = clientRef.current;

    // Add connection error handlers
    client.on('connection-state-change', (curState, revState) => {
      console.log(`🔄 Connection state changed: ${revState} -> ${curState}`);
    });

    client.on('exception', (evt) => {
      console.error('🚨 Agora client exception:', evt);
    });

    // Setup WebSocket listener for screen sharing signals
    onScreenSharingStatusReceived((data) => {
      console.log('📺 Received screen sharing signal:', data);
      const { uid, isSharing } = data;
      
      setRemoteUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.uid.toString() === uid.toString()) {
            return { ...user, isScreenSharing: isSharing };
          }
          return user;
        });
      });
      
      // Also track in separate set for easier access
      setRemoteScreenSharingUsers(prevSet => {
        const newSet = new Set(prevSet);
        if (isSharing) {
          newSet.add(uid.toString());
        } else {
          newSet.delete(uid.toString());
        }
        return newSet;
      });
    });

    // Event handlers
    const handleUserPublished = async (user, mediaType) => {
      console.log(`📡 User ${user.uid} published ${mediaType}:`, user);
      
      await client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        // Enhanced screen sharing detection
        let isScreenShare = false;
        
        if (user.videoTrack) {
          try {
            // Method 1: Check track properties
            const trackLabel = user.videoTrack.getTrackLabel?.() || '';
            const trackSettings = user.videoTrack.getSettings?.() || {};
            
            // Method 2: Check track dimensions (screen shares usually have higher resolution)
            const mediaStreamTrack = user.videoTrack.getMediaStreamTrack?.();
            let trackConstraints = {};
            
            if (mediaStreamTrack) {
              trackConstraints = mediaStreamTrack.getConstraints?.() || {};
            }
            
            // Method 3: Check if it's explicitly marked as screen track
            const explicitScreenTrack = user.videoTrack.isScreenTrack === true;
            
            // Method 4: Check dimensions - screen shares typically have different aspect ratios
            const width = trackSettings.width || 0;
            const height = trackSettings.height || 0;
            const hasHighResolution = width >= 1280 || height >= 720;
            const hasScreenAspectRatio = width > 0 && height > 0 && (width / height > 1.5);
            
            // Screen sharing detection logic
            isScreenShare = explicitScreenTrack ||
                           trackLabel.includes('screen') || 
                           trackSettings.displaySurface === 'monitor' ||
                           trackSettings.displaySurface === 'window' ||
                           trackSettings.displaySurface === 'application' ||
                           (hasHighResolution && hasScreenAspectRatio);
          
            console.log(`🖥️ User ${user.uid} video track detailed analysis:`, {
              trackLabel,
              trackSettings,
              trackConstraints,
              explicitScreenTrack,
              width,
              height,
              hasHighResolution,
              hasScreenAspectRatio,
              computed_isScreenShare: isScreenShare,
              mediaStreamTrack: !!mediaStreamTrack
            });
          } catch (error) {
            console.warn(`⚠️ Error analyzing track for user ${user.uid}:`, error);
            isScreenShare = false;
          }
        }
        
        setRemoteUsers(prevUsers => {
          const existingUser = prevUsers.find(u => u.uid === user.uid);
          if (existingUser) {
            // Update existing user with new video track
            return prevUsers.map(u => u.uid === user.uid ? {
              ...user,
              isScreenSharing: isScreenShare
            } : u);
          }
          // Add new user
          return [...prevUsers, {
            ...user,
            isScreenSharing: isScreenShare
          }];
        });
      }
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteUsers(prevUsers => 
          prevUsers.filter(u => u.uid !== user.uid)
        );
      }
    };

    const handleUserLeft = (user) => {
      setRemoteUsers(prevUsers => 
        prevUsers.filter(u => u.uid !== user.uid)
      );
    };

    // Add event listeners
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      // Cleanup
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, []);

  const joinChannel = useCallback(async (appId, channelName, token, uid) => {
    try {
      const client = clientRef.current;
      
      // Check connection state
      const connectionState = client.connectionState;
      console.log('Current connection state:', connectionState);
      
      // Check if already connected or in process of leaving
      if (isJoined || isLeavingRef.current) {
        console.warn('Already joined a channel or leaving, skipping...');
        return false;
      }
      
      // Check if client is already connecting or connected
      if (connectionState === 'CONNECTED' || connectionState === 'CONNECTING') {
        console.warn('Client already in connecting/connected state:', connectionState);
        return false;
      }
      
      console.log('Attempting to join channel:', channelName, 'with UID:', uid);
      
      // Sanitize channel name to remove invalid characters
      const sanitizedChannelName = sanitizeChannelName(channelName);
      console.log('Sanitized channel name:', sanitizedChannelName);
      
      // Get token from backend
      let token = null;
      
      // Test token service with debug logging
      try {
        console.log('� Attempting to get token from backend...');
        const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL}/agora/tokens`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channelName: sanitizedChannelName, // Use sanitized name
            uid: uid,
            role: 'publisher'
          }),
        });
        
        console.log('🔍 Token response status:', tokenResponse.status);
        
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          console.log('📦 Full token response:', tokenData);
          
          token = tokenData.data?.rtcToken || tokenData.rtcToken || null;
          console.log('✅ Extracted RTC token:', token ? `Token length: ${token.length}` : 'null token');
          console.log('🔍 Token starts with:', token ? token.substring(0, 20) + '...' : 'null');
          
          if (tokenData.data) {
            console.log('📋 Token data structure:', {
              hasData: !!tokenData.data,
              hasRtcToken: !!tokenData.data.rtcToken,
              hasRtmToken: !!tokenData.data.rtmToken,
              appId: tokenData.data.appId
            });
          }
        } else {
          const errorText = await tokenResponse.text();
          console.warn('⚠️ Token service failed:', tokenResponse.status, errorText);
          token = null;
        }
      } catch (error) {
        console.warn('⚠️ Token service error:', error);
        token = null;
      }
      
      // Ensure token is never undefined
      if (token === undefined) {
        token = null;
      }
      
      console.log('🚀 Attempting to join Agora channel with:', {
        appId: appId,
        channelName: sanitizedChannelName,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        uid: uid
      });
      
      // Join with retry logic for network issues
      let joinAttempts = 0;
      const maxAttempts = 3;
      
      while (joinAttempts < maxAttempts) {
        try {
          await client.join(appId, sanitizedChannelName, token, uid);
          setIsJoined(true);
          console.log('✅ Successfully joined channel on attempt:', joinAttempts + 1);
          
          // After joining, publish any pending tracks
          const pendingTracks = [];
          if (localVideoTrack) pendingTracks.push(localVideoTrack);
          if (localAudioTrack) pendingTracks.push(localAudioTrack);
          if (localScreenTrack) pendingTracks.push(localScreenTrack);
          
          if (pendingTracks.length > 0) {
            console.log('📤 Publishing pending tracks after join:', pendingTracks.map(t => t._ID));
            await client.publish(pendingTracks);
            console.log('✅ All pending tracks published successfully');
          }
          
          return true;
        } catch (joinError) {
          joinAttempts++;
          console.error(`❌ Join attempt ${joinAttempts} failed:`, joinError);
          console.error('🔍 Error details:', {
            name: joinError.name,
            message: joinError.message,
            code: joinError.code,
            data: joinError.data
          });
          
          if (joinAttempts >= maxAttempts) {
            // Try one more time with different connection mode
            if (joinError.message.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
              console.log('🔄 Trying fallback connection mode...');
              try {
                // Reset client
                await client.leave();
                clientRef.current = AgoraRTC.createClient({ 
                  mode: 'rtc', 
                  codec: 'h264' // Try different codec
                });
                await clientRef.current.join(appId, sanitizedChannelName, token, uid);
                setIsJoined(true);
                console.log('✅ Successfully joined with fallback mode');
                return true;
              } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
              }
            }
            throw joinError;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * joinAttempts));
          console.log(`🔄 Retrying join (attempt ${joinAttempts + 1}/${maxAttempts})...`);
        }
      }
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  }, [isJoined, localVideoTrack, localAudioTrack, localScreenTrack]); // Include track dependencies

  const leaveChannel = useCallback(async () => {
    try {
      const client = clientRef.current;
      
      // Prevent multiple leave calls
      if (isLeavingRef.current || !isJoined) {
        return true;
      }
      
      isLeavingRef.current = true;
      
      // Stop and close local tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        setLocalVideoTrack(null);
        setIsCameraOn(false);
      }
      
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
        setIsMicOn(false);
      }
      
      if (localScreenTrack) {
        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);
        setIsScreenSharing(false);
      }
      
      // Leave channel
      await client.leave();
      setIsJoined(false);
      setRemoteUsers([]);
      
      isLeavingRef.current = false;
      
      return true;
    } catch (error) {
      console.error('Failed to leave channel:', error);
      isLeavingRef.current = false;
      throw error;
    }
  }, [isJoined, localVideoTrack, localAudioTrack, localScreenTrack]); // Dependencies for leave channel

  const toggleCamera = useCallback(async () => {
    try {
      const client = clientRef.current;
      
      if (!isCameraOn) {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        
        if (isJoined) {
          await client.publish([videoTrack]);
        }
        
        setIsCameraOn(true);
      } else {
        if (localVideoTrack) {
          if (isJoined) {
            await client.unpublish([localVideoTrack]);
          }
          localVideoTrack.stop();
          localVideoTrack.close();
          setLocalVideoTrack(null);
        }
        setIsCameraOn(false);
      }
    } catch (error) {
      console.error('Failed to toggle camera:', error);
      throw error;
    }
  }, [localVideoTrack, isCameraOn, isJoined]); // Dependencies for toggle camera

  const toggleMicrophone = useCallback(async () => {
    try {
      const client = clientRef.current;
      
      if (!isMicOn) {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
        
        if (isJoined) {
          await client.publish([audioTrack]);
        }
        
        setIsMicOn(true);
      } else {
        if (localAudioTrack) {
          if (isJoined) {
            await client.unpublish([localAudioTrack]);
          }
          localAudioTrack.stop();
          localAudioTrack.close();
          setLocalAudioTrack(null);
        }
        setIsMicOn(false);
      }
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      throw error;
    }
  }, [localAudioTrack, isMicOn, isJoined]); // Dependencies for toggle microphone

  const stopScreenShare = useCallback(async () => {
    try {
      const client = clientRef.current;
      
      if (localScreenTrack) {
        if (isJoined) {
          await client.unpublish([localScreenTrack]);
        }
        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);
      }
      
      setIsScreenSharing(false);
      
      // Send screen sharing signal to other users
      await sendScreenSharingStatus(false);
      console.log('📺 Screen sharing stopped signal sent');
    } catch (error) {
      console.error('Failed to stop screen share:', error);
      throw error;
    }
  }, [localScreenTrack, isJoined]);

  const toggleScreenShare = useCallback(async () => {
    try {
      const client = clientRef.current;
      console.log('🖥️ Starting screen share toggle, current state:', isScreenSharing);
      console.log('🔍 Debug join status:', {
        isJoined,
        clientConnectionState: client?.connectionState,
        clientExists: !!client
      });
      
      if (!isScreenSharing) {
        console.log('📺 Creating screen video track...');
        // Create screen sharing track
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: {
            width: 1920,
            height: 1080,
            frameRate: 15,
            bitrateMax: 3000,
            bitrateMin: 1000,
          },
        });
        
        console.log('✅ Screen track created:', screenTrack);
        setLocalScreenTrack(screenTrack);
        
        // If camera is on, turn it off before sharing screen
        if (isCameraOn && localVideoTrack) {
          console.log('📹 Turning off camera before screen share...');
          if (isJoined) {
            await client.unpublish([localVideoTrack]);
          }
          localVideoTrack.stop();
          localVideoTrack.close();
          setLocalVideoTrack(null);
          setIsCameraOn(false);
        }
        
        // Debug publish attempt
        console.log('🔍 Attempting to publish screen track, join status:', {
          isJoined,
          connectionState: client?.connectionState,
          screenTrackId: screenTrack._ID
        });
        
        // Publish screen sharing track
        if (isJoined && client?.connectionState === 'CONNECTED') {
          console.log('📤 Publishing screen track...');
          await client.publish([screenTrack]);
          console.log('✅ Screen track published successfully');
        } else {
          console.log('⚠️ Cannot publish now. Will auto-publish when joined.', {
            isJoined,
            connectionState: client?.connectionState
          });
        }
        
        // Handle screen sharing end event
        screenTrack.on('track-ended', () => {
          console.log('Screen sharing ended by user');
          stopScreenShare();
        });
        
        setIsScreenSharing(true);
        console.log('📺 Local screen sharing state set to true');
        
        // Send screen sharing signal to other users
        await sendScreenSharingStatus(true);
        console.log('📺 Screen sharing started signal sent');
      } else {
        console.log('⏹️ Stopping screen share...');
        await stopScreenShare();
      }
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
      throw error;
    }
  }, [localVideoTrack, isCameraOn, isScreenSharing, isJoined, stopScreenShare]);

  // Auto-publish screen track when joined 
  useEffect(() => {
    const publishScreenTrackWhenJoined = async () => {
      const client = clientRef.current;
      if (isJoined && localScreenTrack && client) {
        try {
          // Check if track is already published
          const publishedTracks = client.getLocalVideoTracks();
          const isAlreadyPublished = publishedTracks.some(track => track._ID === localScreenTrack._ID);
          
          if (!isAlreadyPublished) {
            console.log('📤 Auto-publishing screen track after join:', localScreenTrack._ID);
            await client.publish([localScreenTrack]);
            console.log('✅ Screen track auto-published successfully');
          } else {
            console.log('ℹ️ Screen track already published');
          }
        } catch (error) {
          console.error('❌ Failed to auto-publish screen track:', error);
        }
      }
    };

    publishScreenTrackWhenJoined();
  }, [isJoined, localScreenTrack]);

  return {
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    remoteUsers,
    isJoined,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    joinChannel,
    leaveChannel,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
    stopScreenShare,
  };
};

export default useAgora;