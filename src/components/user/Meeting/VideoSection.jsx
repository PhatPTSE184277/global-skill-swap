import React, { useEffect, useState, useRef, useCallback } from "react";
import { message, Spin } from "antd";
import { Video, VideoOff, Users, Monitor } from "lucide-react";
import useAgora from "../../../hooks/useAgora";
import MeetingControls from "./MeetingControls";

export default function VideoSection({ roomId, userName, uid, onLeave }) {
  const {
    localVideoTrack,
    localAudioTrack,
    localScreenTrack,
    remoteUsers,
    remoteScreenUser, // NEW: Get remote screen user
    isJoined,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    joinChannel,
    connectionState,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  } = useAgora();

  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const localVideoRef = useRef(null);
  const localScreenRef = useRef(null);
  const remoteScreenRef = useRef(null); // NEW: Ref for remote screen

  // Callback ref to ensure ref is set properly
  const setLocalVideoRef = useCallback((element) => {
    console.log('🎯 Setting local video ref:', !!element);
    localVideoRef.current = element;
    
    // If we have both ref and track, play immediately
    if (element && localVideoTrack) {
      console.log('📹 Ref set, playing video immediately...');
      localVideoTrack.play(element);
    }
  }, [localVideoTrack]);

  // Auto-join when component mounts
  useEffect(() => {
    if (roomId && userName && uid && !hasJoined) {
      console.log('🚀 Auto-joining channel...');
      setHasJoined(true);
      handleJoinChannel();
    }
  }, [roomId, userName, uid, hasJoined]);

  // Play local video track
  useEffect(() => {
    console.log('🔍 VideoSection debug:', {
      localVideoTrack: !!localVideoTrack,
      localVideoRef: !!localVideoRef.current,
      isJoined,
      connectionState
    });
    
    if (localVideoTrack && localVideoRef.current) {
      console.log('📹 Playing local video track');
      localVideoTrack.play(localVideoRef.current);
    } else if (localVideoTrack && !localVideoRef.current) {
      console.log('⏰ Waiting for DOM ref, retrying in 100ms...');
      // Retry after DOM is ready
      setTimeout(() => {
        if (localVideoRef.current) {
          console.log('📹 Playing local video track (delayed)');
          localVideoTrack.play(localVideoRef.current);
        } else {
          console.log('❌ Still no DOM ref after delay');
        }
      }, 100);
    } else {
      console.log('❌ Cannot play video track:', {
        hasTrack: !!localVideoTrack,
        hasRef: !!localVideoRef.current
      });
    }
  }, [localVideoTrack, isJoined, connectionState]);

  // Force video track play when ref becomes available
  useEffect(() => {
    if (localVideoRef.current && localVideoTrack) {
      console.log('🎯 Ref is now available, force playing video...');
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoRef.current, localVideoTrack]);

  // Play local screen track
  useEffect(() => {
    if (localScreenTrack && localScreenRef.current) {
      console.log('🖥️ Playing local screen track');
      localScreenTrack.play(localScreenRef.current);
    }
  }, [localScreenTrack]);

  // Play remote screen track (NEW: Like NEW project)
  useEffect(() => {
    if (remoteScreenUser && remoteScreenUser.videoTrack && remoteScreenRef.current) {
      console.log('🖥️ Playing remote screen track from user:', remoteScreenUser.uid);
      remoteScreenUser.videoTrack.play(remoteScreenRef.current);
    }
  }, [remoteScreenUser]);

  const handleJoinChannel = async () => {
    setLoading(true);
    try {
      console.log('🎯 Joining channel...', { roomId, userName, uid });
      await joinChannel(roomId, userName, parseInt(uid));
      console.log('✅ Successfully joined channel');
    } catch (error) {
      console.error('❌ Error joining channel:', error);
      message.error("Lỗi khi tham gia video call: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remote Video Card
  const RemoteVideoCard = ({ user }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
      if (user.videoTrack && videoRef.current) {
        user.videoTrack.play(videoRef.current);
      }
      if (user.audioTrack && audioRef.current) {
        user.audioTrack.play(audioRef.current);
      }
    }, [user.videoTrack, user.audioTrack]);

    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {user.videoTrack ? (
          <div ref={videoRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <VideoOff size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera tắt</p>
            </div>
          </div>
        )}
        <div ref={audioRef} className="hidden" />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {user.uid}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
        <span className="ml-3">Đang tham gia video call...</span>
      </div>
    );
  }

  // Determine if any screen sharing is active (local or remote)
  const hasScreenShare = isScreenSharing || remoteScreenUser;

  return (
    <div className="h-full flex flex-col">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              connectionState === "CONNECTED" ? "bg-green-500" : 
              connectionState === "CONNECTING" ? "bg-yellow-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {connectionState === "CONNECTED" ? "Đã kết nối" : 
             connectionState === "CONNECTING" ? "Đang kết nối" : "Mất kết nối"}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users size={16} />
          <span>{remoteUsers.length + (isJoined ? 1 : 0)} người tham gia</span>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1">
        {/* Screen Sharing View (NEW: Support both local and remote) */}
        {hasScreenShare ? (
          <div className="h-full flex flex-col">
            {/* Main screen share display */}
            <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative mb-4">
              {/* Local screen share */}
              {isScreenSharing && localScreenTrack && (
                <>
                  <div ref={localScreenRef} className="w-full h-full" />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Monitor size={16} className="mr-1" />
                    Bạn đang chia sẻ màn hình
                  </div>
                </>
              )}
              
              {/* Remote screen share (NEW: Like NEW project) */}
              {!isScreenSharing && remoteScreenUser && (
                <>
                  <div ref={remoteScreenRef} className="w-full h-full" />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Monitor size={16} className="mr-1" />
                    User {remoteScreenUser.uid} đang chia sẻ màn hình
                  </div>
                </>
              )}
            </div>
            
            {/* Participant thumbnails during screen share */}
            <div className="flex gap-2 overflow-x-auto">
              {/* Local video thumbnail (show if not sharing screen) */}
              {!isScreenSharing && (
                <div className="flex-shrink-0 w-32 h-24 bg-gray-800 rounded overflow-hidden relative">
                  {localVideoTrack ? (
                    <div ref={localVideoRef} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoOff size={20} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                    Bạn ({userName})
                  </div>
                </div>
              )}
              
              {/* Remote participants thumbnails */}
              {remoteUsers.map((user) => (
                <div key={user.uid} className="flex-shrink-0 w-32 h-24">
                  <RemoteVideoCard user={user} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Normal Video Grid (when no screen sharing) */
          <div className={`h-full grid gap-4 ${
            remoteUsers.length === 0 ? 'grid-cols-1' :
            remoteUsers.length === 1 ? 'grid-cols-2' :
            remoteUsers.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
          }`}>
            {/* Local Video */}
            <div className="bg-gray-800 rounded-lg overflow-hidden relative">
              {/* Always render video element for ref */}
              <div ref={setLocalVideoRef} className={`w-full h-full ${localVideoTrack ? 'block' : 'hidden'}`} />
              
              {/* Show placeholder when no video */}
              {!localVideoTrack && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Camera tắt</p>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Bạn ({userName})
              </div>
            </div>

            {/* Remote participants */}
            {remoteUsers.map((user) => (
              <RemoteVideoCard key={user.uid} user={user} />
            ))}
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <MeetingControls 
        onLeave={onLeave}
        isLeaving={loading}
        isCameraOn={isCameraOn}
        isMicOn={isMicOn}
        isScreenSharing={isScreenSharing}
        remoteScreenUser={remoteScreenUser}
        toggleCamera={toggleCamera}
        toggleMicrophone={toggleMicrophone}
        toggleScreenShare={toggleScreenShare}
      />
    </div>
  );
}
