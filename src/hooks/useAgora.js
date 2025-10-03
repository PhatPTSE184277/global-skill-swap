import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

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
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  
  const clientRef = useRef(null);
  const currentChannelRef = useRef(null);

  // Debug states
  useEffect(() => {
    console.log('🔍 useAgora states:', {
      localVideoTrack: !!localVideoTrack,
      localAudioTrack: !!localAudioTrack,
      isJoined,
      isCameraOn,
      isMicOn,
      connectionState,
      remoteUsersCount: remoteUsers.length
    });
  }, [localVideoTrack, localAudioTrack, isJoined, isCameraOn, isMicOn, connectionState, remoteUsers.length]);

  // Initialize Agora client
  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    // Client event handlers
    client.on('connection-state-change', (curState, revState) => {
      console.log('🔗 Connection state changed:', revState, '->', curState);
      setConnectionState(curState);
    });

    client.on('user-published', async (user, mediaType) => {
      console.log('👤 User published:', user.uid, 'mediaType:', mediaType);
      
      try {
        await client.subscribe(user, mediaType);
        console.log('👤 Subscribe to user:', user.uid, 'mediaType:', mediaType);
        
        // Handle screen sharing detection (like NEW project)
        if (mediaType === 'video') {
          // Check if this is a screen share by track type or UID pattern
          const isScreenShare = user.videoTrack && 
            (user.videoTrack.getMediaStreamTrack().label.includes('screen') || 
             user.uid.toString().includes('screen'));
          
          if (isScreenShare) {
            console.log('🖥️ Remote screen share detected from user:', user.uid);
            setRemoteScreenUser(user);
          } else {
            // Regular video track
            setRemoteUsers(prevUsers => {
              const existingUserIndex = prevUsers.findIndex(u => u.uid === user.uid);
              if (existingUserIndex >= 0) {
                const updatedUsers = [...prevUsers];
                updatedUsers[existingUserIndex] = user;
                return updatedUsers;
              } else {
                return [...prevUsers, user];
              }
            });
          }
        }

        // Auto-play audio
        if (mediaType === 'audio' && user.audioTrack) {
          user.audioTrack.play();
        }
      } catch (error) {
        console.error('❌ Error subscribing to user:', error);
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      console.log('👤 User unpublished:', user.uid, 'mediaType:', mediaType);
      
      if (mediaType === 'video') {
        // Check if this was screen share
        if (remoteScreenUser && remoteScreenUser.uid === user.uid) {
          console.log('🖥️ Remote screen share ended');
          setRemoteScreenUser(null);
        } else {
          setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        }
      }
    });

    client.on('user-left', (user) => {
      console.log('👤 User left:', user.uid);
      setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
      
      // Clear screen share if user left
      if (remoteScreenUser && remoteScreenUser.uid === user.uid) {
        setRemoteScreenUser(null);
      }
    });

    return () => {
      console.log('🧹 Cleaning up Agora client...');
      client.removeAllListeners();
      client.leave().catch(console.error);
    };
  }, []); // Empty dependency array - only run once

  // Join channel function
  const joinChannel = useCallback(async (channelName, displayName, uid) => {
    if (isJoined) {
      console.log('⚠️ Already joined, skipping...');
      return;
    }

    try {
      console.log('🚀 Joining channel...', { channelName, displayName, uid });
      
      const client = clientRef.current;
      const appId = import.meta.env.VITE_AGORA_APP_ID;
      
      if (!appId) {
        throw new Error('Agora App ID not found');
      }

      // Get token from backend
      console.log('🎯 Getting token from backend...');
      const response = await fetch(`http://localhost:3000/api/agora/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: channelName,
          uid: uid
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.status}`);
      }

      const tokenData = await response.json();
      console.log('🔍 Token response from backend:', tokenData);
      const token = tokenData.data?.rtcToken || tokenData.rtcToken;
      
      console.log('🔑 Got token from backend:', token);
      
      if (!token) {
        throw new Error('No token received from backend');
      }
      
      await client.join(appId, channelName, token, uid);
      console.log('✅ Joined channel successfully');
      
      setIsJoined(true);
      currentChannelRef.current = channelName;

      // Auto-enable camera and microphone
      try {
        console.log('📹 Auto-enabling camera...');
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          optimizationMode: 'motion',
          encoderConfig: '480p_1'
        });
        
        await client.publish(videoTrack);
        setLocalVideoTrack(videoTrack);
        setIsCameraOn(true);
        console.log('✅ Camera enabled and published');

      } catch (cameraError) {
        console.warn('⚠️ Could not auto-enable camera:', cameraError);
        setIsCameraOn(false); // Set to false if failed
      }

      try {
        console.log('🎤 Auto-enabling microphone...');
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          echoCancellation: true,
          noiseSuppression: true
        });
        
        await client.publish(audioTrack);
        setLocalAudioTrack(audioTrack);
        setIsMicOn(true);
        console.log('✅ Microphone enabled and published');

      } catch (micError) {
        console.warn('⚠️ Could not auto-enable microphone:', micError);
        setIsMicOn(false); // Set to false if failed
      }

    } catch (error) {
      console.error('❌ Error joining channel:', error);
      setConnectionState('DISCONNECTED');
      throw error;
    }
  }, [isJoined]);

  // Toggle screen share (like NEW project)
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        console.log('🖥️ Starting screen share...');
        
        // Create screen track with unique UID pattern
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_2',
          optimizationMode: 'detail'
        });

        // Unpublish camera temporarily
        if (localVideoTrack && isJoined) {
          await clientRef.current.unpublish(localVideoTrack);
          console.log('📹 Camera unpublished for screen share');
        }

        // Publish screen track
        if (isJoined) {
          await clientRef.current.publish(screenTrack);
          console.log('🖥️ Screen track published');
        }

        setLocalScreenTrack(screenTrack);
        setIsScreenSharing(true);

        // Handle screen share end (browser native stop)
        screenTrack.on('track-ended', async () => {
          console.log('🖥️ Screen track ended by user (browser stop button)');
          await stopScreenShare();
        });

        console.log('✅ Screen sharing started');

      } else {
        await stopScreenShare();
      }
    } catch (error) {
      console.error('❌ Error toggling screen share:', error);
      
      // Reset state on error
      setIsScreenSharing(false);
      setLocalScreenTrack(null);
      
      // Republish camera if available
      if (localVideoTrack && isJoined) {
        try {
          await clientRef.current.publish(localVideoTrack);
          console.log('📹 Camera republished after screen share error');
        } catch (republishError) {
          console.error('❌ Error republishing camera:', republishError);
        }
      }
    }
  }, [isScreenSharing, localVideoTrack, isJoined]);

  // Stop screen share (like NEW project)
  const stopScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Stopping screen share...');
      
      if (localScreenTrack) {
        // Unpublish screen track
        if (isJoined) {
          await clientRef.current.unpublish(localScreenTrack);
          console.log('🖥️ Screen track unpublished');
        }

        localScreenTrack.stop();
        localScreenTrack.close();
        setLocalScreenTrack(null);

        // Republish camera if it was on before screen share
        if (localVideoTrack && isJoined) {
          await clientRef.current.publish(localVideoTrack);
          console.log('📹 Camera republished after screen share stop');
        }
      }

      setIsScreenSharing(false);
      console.log('✅ Screen sharing stopped');

    } catch (error) {
      console.error('❌ Error stopping screen share:', error);
    }
  }, [localScreenTrack, localVideoTrack, isJoined]);

  // Other functions remain the same...
  const leaveChannel = useCallback(async () => {
    try {
      console.log('🚪 Leaving channel...');

      // Stop all tracks
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

      // Leave Agora channel
      if (clientRef.current && isJoined) {
        await clientRef.current.leave();
        console.log('✅ Left Agora channel');
      }

      // Reset states
      setIsJoined(false);
      setRemoteUsers([]);
      setRemoteScreenUser(null);
      setConnectionState('DISCONNECTED');
      currentChannelRef.current = null;

      console.log('✅ Successfully left channel');

    } catch (error) {
      console.error('❌ Error leaving channel:', error);
    }
  }, [localVideoTrack, localAudioTrack, localScreenTrack, isJoined]);

  const toggleCamera = useCallback(async () => {
    console.log('🎯 toggleCamera called:', {
      localVideoTrack: !!localVideoTrack,
      isCameraOn,
      isJoined
    });
    
    try {
      if (localVideoTrack) {
        // If we have a track, toggle mute/unmute
        const shouldMute = isCameraOn; // If camera is on, we should mute it
        console.log(`📹 Toggling camera: shouldMute=${shouldMute}`);
        await localVideoTrack.setMuted(shouldMute);
        setIsCameraOn(!shouldMute);
        console.log(`📹 Camera ${!shouldMute ? 'enabled' : 'disabled'}, new state: ${!shouldMute}`);
      } else if (isJoined) {
        // If no track but joined, create new track
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          optimizationMode: 'motion',
          encoderConfig: '480p_1'
        });
        await clientRef.current.publish(videoTrack);
        setLocalVideoTrack(videoTrack);
        setIsCameraOn(true);
        console.log('📹 Camera created and enabled');
      }
    } catch (error) {
      console.error('❌ Error toggling camera:', error);
      setIsCameraOn(false); // Set to false on error
    }
  }, [localVideoTrack, isCameraOn, isJoined]);

  const toggleMicrophone = useCallback(async () => {
    try {
      if (localAudioTrack) {
        // If we have a track, toggle mute/unmute
        const shouldMute = isMicOn; // If mic is on, we should mute it
        await localAudioTrack.setMuted(shouldMute);
        setIsMicOn(!shouldMute);
        console.log(`🎤 Microphone ${!shouldMute ? 'enabled' : 'disabled'}`);
      } else if (isJoined) {
        // If no track but joined, create new track
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          echoCancellation: true,
          noiseSuppression: true
        });
        await clientRef.current.publish(audioTrack);
        setLocalAudioTrack(audioTrack);
        setIsMicOn(true);
        console.log('🎤 Microphone created and enabled');
      }
    } catch (error) {
      console.error('❌ Error toggling microphone:', error);
      setIsMicOn(false); // Set to false on error
    }
  }, [localAudioTrack, isMicOn, isJoined]);

  return {
    // States
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    remoteUsers,
    remoteScreenUser, // NEW: Expose remote screen user
    isJoined,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    connectionState,
    
    // Functions
    joinChannel,
    leaveChannel,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
    stopScreenShare,
    
    // Utility
    client: clientRef.current
  };
};

export default useAgora;