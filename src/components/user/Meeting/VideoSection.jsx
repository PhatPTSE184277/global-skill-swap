import React, { useEffect, useState, useRef } from "react";
import { message, Spin, Button, Modal } from "antd";
import { Video, VideoOff, Users, TestTube } from "lucide-react";
import AgoraRTC from 'agora-rtc-sdk-ng';
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
    leaveChannel,
    connectionState,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  } = useAgora();

  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // Track mounting
  const [testCameraVisible, setTestCameraVisible] = useState(false); // For camera test

  const localVideoRef = useRef(null);
  const localScreenRef = useRef(null);
  const testVideoRef = useRef(null); // For camera test

  // Debug logging for screen sharing state changes
  useEffect(() => {
    console.log('🖥️ Screen sharing state changed:', {
      isScreenSharing,
      hasLocalScreenTrack: !!localScreenTrack,
      totalRemoteUsers: remoteUsers.length
    });
  }, [isScreenSharing, localScreenTrack, remoteUsers.length]);

  // Mark as mounted
  useEffect(() => {
    setHasMounted(true);
    return () => setHasMounted(false);
  }, []);

  // Auto-join channel when component mounts (only once)
  useEffect(() => {
    if (
      hasMounted &&
      !hasInitialized &&
      roomId &&
      userName &&
      uid &&
      !isJoined &&
      !loading
    ) {
      console.log("🚀 Auto-joining channel for the first time...");
      handleJoinChannel();
      setHasInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName, uid, hasInitialized, isJoined, loading, hasMounted]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isJoined) {
        console.log("🧹 VideoSection unmounting, leaving channel...");
        leaveChannel().catch((error) => {
          console.error("❌ Error leaving on unmount:", error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoined]);

  const handleJoinChannel = async () => {
    if (loading) {
      console.log("⚠️ Already loading, skipping...");
      return;
    }

    if (isJoined) {
      console.log("⚠️ Already joined, skipping...");
      return;
    }

    if (connectionState === "CONNECTED" || connectionState === "CONNECTING") {
      console.log("⚠️ Already connected/connecting, skipping...");
      return;
    }

    if (!roomId || !userName || !uid) {
      console.error("❌ Missing required parameters:", {
        roomId,
        userName,
        uid,
      });
      message.error("Thiếu thông tin cần thiết để tham gia cuộc gọi");
      return;
    }

    setLoading(true);
    try {
      console.log("🎯 Joining video channel...", {
        roomId,
        userName,
        uid: parseInt(uid),
        currentState: connectionState,
        isJoined,
      });

      await joinChannel(roomId, userName, parseInt(uid));
      message.success("Đã tham gia video call thành công!");
    } catch (error) {
      console.error("❌ Error joining channel:", error);
      if (error.code === "INVALID_OPERATION") {
        message.error("Đang thử kết nối lại...");
        // Try again after a short delay
        setTimeout(() => {
          handleJoinChannel();
        }, 2000);
      } else {
        message.error("Lỗi khi tham gia video call: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test camera function
  const testCamera = async () => {
    try {
      console.log('🧪 Testing camera...');
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: '480p_1'
      });
      
      if (testVideoRef.current) {
        videoTrack.play(testVideoRef.current);
        console.log('✅ Camera test successful');
        message.success('Camera hoạt động bình thường!');
      }
      
      // Stop test track after 3 seconds
      setTimeout(() => {
        videoTrack.stop();
        videoTrack.close();
        setTestCameraVisible(false);
      }, 3000);
      
    } catch (error) {
      console.error('❌ Camera test failed:', error);
      if (error.code === 'PERMISSION_DENIED') {
        message.error('Vui lòng cấp quyền truy cập camera');
      } else if (error.code === 'DEVICE_NOT_FOUND') {
        message.error('Không tìm thấy camera');
      } else if (error.code === 'DEVICE_BUSY') {
        message.error('Camera đang được sử dụng bởi ứng dụng khác');
      } else {
        message.error('Lỗi camera: ' + error.message);
      }
    }
  };

  // Play local video track
  useEffect(() => {
    const videoElement = localVideoRef.current;
    console.log('🎬 Local video effect triggered:', {
      hasVideoTrack: !!localVideoTrack,
      hasVideoElement: !!videoElement,
      isCameraOn,
      isJoined,
      videoElementDetails: videoElement ? {
        tagName: videoElement.tagName,
        children: videoElement.children.length,
        innerHTML: videoElement.innerHTML.substring(0, 100)
      } : null
    });
    
    if (localVideoTrack && videoElement) {
      try {
        console.log('📹 Playing local video track on element:', videoElement);
        localVideoTrack.play(videoElement);
        console.log("📹 Local video track playing successfully");
        
        // Check if video element got a video tag
        setTimeout(() => {
          const videoTag = videoElement.querySelector('video');
          console.log('🎥 Video tag after play:', {
            hasVideoTag: !!videoTag,
            videoSrc: videoTag ? videoTag.src : null,
            videoWidth: videoTag ? videoTag.videoWidth : null,
            videoHeight: videoTag ? videoTag.videoHeight : null
          });
        }, 1000);
        
      } catch (error) {
        console.error("❌ Error playing local video:", error);
      }
    }

    return () => {
      if (localVideoTrack && videoElement) {
        try {
          localVideoTrack.stop();
        } catch (error) {
          console.error("❌ Error stopping local video:", error);
        }
      }
    };
  }, [localVideoTrack, isCameraOn]);

  // Play local screen track (similar to NEW project)
  useEffect(() => {
    const screenElement = localScreenRef.current;
    if (localScreenTrack && screenElement) {
      try {
        console.log("🖥️ Playing local screen track");
        localScreenTrack.play(screenElement);
      } catch (error) {
        console.error("❌ Error playing local screen:", error);
      }
    }

    return () => {
      // Cleanup when screen track changes
      if (screenElement) {
        try {
          // Clear the video element
          const videoElement = screenElement.querySelector('video');
          if (videoElement) {
            videoElement.srcObject = null;
            videoElement.remove();
          }
        } catch (error) {
          console.log('Screen cleanup error:', error);
        }
      }
    };
  }, [localScreenTrack]);

  // Remote video component (improved similar to NEW project)
  const RemoteVideoCard = ({ user }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
      if (user.videoTrack && videoRef.current) {
        try {
          console.log(`📹 Playing remote video for user ${user.uid}`);
          user.videoTrack.play(videoRef.current);
        } catch (error) {
          console.error("❌ Error playing remote video:", error);
        }
      }

      return () => {
        // Cleanup video element
        if (videoRef.current) {
          try {
            const videoElement = videoRef.current.querySelector('video');
            if (videoElement) {
              videoElement.srcObject = null;
            }
          } catch (error) {
            console.log('Remote video cleanup error:', error);
          }
        }
      };
    }, [user.videoTrack]);

    useEffect(() => {
      if (user.audioTrack && audioRef.current) {
        try {
          user.audioTrack.play(audioRef.current);
        } catch (error) {
          console.error("❌ Error playing remote audio:", error);
        }
      }
    }, [user.audioTrack]);

    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {user.videoTrack ? (
          <div ref={videoRef} className="agora-video-container" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <VideoOff size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm opacity-75">Camera tắt</p>
            </div>
          </div>
        )}

        {/* Audio element (hidden) */}
        <div ref={audioRef} className="hidden" />

        {/* User info overlay */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          UID: {user.uid}
        </div>

        {/* Audio indicator */}
        {user.audioTrack && (
          <div className="absolute top-2 left-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
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
              connectionState === "CONNECTED"
                ? "bg-green-500"
                : connectionState === "CONNECTING"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {connectionState === "CONNECTED"
              ? "Đã kết nối"
              : connectionState === "CONNECTING"
              ? "Đang kết nối"
              : "Mất kết nối"}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{remoteUsers.length + (isJoined ? 1 : 0)} người tham gia</span>
          </div>
          
          {/* Camera Test Button */}
          <Button
            size="small"
            type="default"
            icon={<TestTube size={16} />}
            onClick={() => {
              setTestCameraVisible(true);
              testCamera();
            }}
            disabled={loading || isJoined}
          >
            Test Camera
          </Button>
          
          {/* Manual Camera Toggle for Debug */}
          {isJoined && (
            <Button
              size="small"
              type={isCameraOn ? "primary" : "default"}
              danger={!isCameraOn}
              onClick={async () => {
                try {
                  await toggleCamera();
                } catch (error) {
                  console.error('Manual camera toggle error:', error);
                }
              }}
            >
              {isCameraOn ? "Turn OFF Camera" : "Turn ON Camera"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 grid gap-4">
        {/* Screen Sharing View - only show when local user is sharing */}
        {isScreenSharing && localScreenTrack && (
          <div className="grid grid-cols-1 gap-4">
            {/* Main screen share display */}
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <div ref={localScreenRef} className="w-full h-full" />
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                🖥️ Bạn đang chia sẻ màn hình
              </div>
            </div>

            {/* Participant thumbnails during screen share */}
            <div className="grid grid-cols-4 gap-2">
              {/* Local video thumbnail (only show camera if not screen sharing) */}
              {isJoined && localVideoTrack && (
                <div className="aspect-video bg-gray-800 rounded overflow-hidden relative">
                  <div ref={localVideoRef} className="w-full h-full" />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
                    Bạn
                  </div>
                </div>
              )}

              {/* Remote participants thumbnails */}
              {remoteUsers.map((user) => (
                <div key={user.uid} className="aspect-video">
                  <RemoteVideoCard user={user} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Video Grid (no local screen sharing) */}
        {!isScreenSharing && (
          <div
            className={`grid gap-4 ${
              remoteUsers.length === 0
                ? "grid-cols-1"
                : remoteUsers.length === 1
                ? "grid-cols-2"
                : remoteUsers.length <= 4
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {/* Local video */}
            {isJoined && (
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                {localVideoTrack ? (
                  <>
                    <div 
                      ref={localVideoRef} 
                      className="agora-video-container"
                    />
                    {/* Debug info overlay */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      📹 Camera ON
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoOff size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Camera tắt</p>
                      </div>
                    </div>
                    {/* Debug info overlay */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      📹 Camera OFF
                    </div>
                  </>
                )}

                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Bạn ({userName})
                </div>
              </div>
            )}

            {/* Remote participants - includes screen sharing from other users */}
            {remoteUsers.map((user) => (
              <div key={user.uid} className="aspect-video">
                <RemoteVideoCard user={user} />
              </div>
            ))}

            {/* Empty state */}
            {remoteUsers.length === 0 && !isJoined && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Đang chờ kết nối...</p>
                </div>
              </div>
            )}
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

      {/* Camera Test Modal */}
      <Modal
        title="Test Camera"
        open={testCameraVisible}
        onCancel={() => setTestCameraVisible(false)}
        footer={null}
        width={480}
        centered
      >
        <div className="text-center">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <div ref={testVideoRef} className="w-full h-full" />
          </div>
          <p className="text-gray-600">Kiểm tra camera... (sẽ tự đóng sau 3 giây)</p>
        </div>
      </Modal>
    </div>
  );
}
