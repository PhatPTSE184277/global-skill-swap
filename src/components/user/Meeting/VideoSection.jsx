import React, { useEffect, useState, useRef } from "react";
import { message, Spin, Button, Modal } from "antd";
import { Video, VideoOff, Users, TestTube } from "lucide-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import useAgora from "../../../hooks/useAgora";
import MeetingControls from "./MeetingControls";
import apiService from "../../../services/apiService"; // Import apiService

export default function VideoSection({
  roomId,
  userName,
  uid,
  currentUser,
  onLeave,
}) {
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
    // Screen sharing state tracking
  }, [isScreenSharing, localScreenTrack, remoteUsers.length]);

  // Mark as mounted
  useEffect(() => {
    setHasMounted(true);
    return () => setHasMounted(false);
  }, []);

  // Auto-join channel when component mounts (only once)
  useEffect(() => {
    console.log("🎯 VideoSection useEffect check:", {
      hasMounted,
      hasInitialized,
      roomId,
      userName,
      uid,
      isJoined,
      loading,
      connectionState,
    });

    if (
      hasMounted &&
      !hasInitialized &&
      roomId &&
      userName &&
      uid &&
      !isJoined &&
      !loading
    ) {
      console.log("🚀 All conditions met, starting join process...");
      handleJoinChannel();
      setHasInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName, uid, hasInitialized, isJoined, loading, hasMounted]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isJoined) {
        leaveChannel().catch(() => {
          // Error handled silently
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoined]);

  const handleJoinChannel = async () => {
    if (loading) {
      return;
    }

    if (isJoined) {
      return;
    }

    if (connectionState === "CONNECTED" || connectionState === "CONNECTING") {
      return;
    }

    if (!roomId || !userName || !uid) {
      message.error("Thiếu thông tin cần thiết để tham gia cuộc gọi");
      return;
    }

    setLoading(true);
    try {
      await joinChannel(roomId, userName, parseInt(uid));
      message.success("Đã tham gia video call thành công!");
    } catch (error) {
      if (error.code === "INVALID_OPERATION") {
        message.error("Đang thử kết nối lại...");
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
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: "480p_1",
      });

      if (testVideoRef.current) {
        videoTrack.play(testVideoRef.current);
        message.success("Camera hoạt động bình thường!");
      }

      // Stop test track after 3 seconds
      setTimeout(() => {
        videoTrack.stop();
        videoTrack.close();
        setTestCameraVisible(false);
      }, 3000);
    } catch (error) {
      if (error.code === "PERMISSION_DENIED") {
        message.error("Vui lòng cấp quyền truy cập camera");
      } else if (error.code === "DEVICE_NOT_FOUND") {
        message.error("Không tìm thấy camera");
      } else if (error.code === "DEVICE_BUSY") {
        message.error("Camera đang được sử dụng bởi ứng dụng khác");
      } else {
        message.error("Lỗi camera: " + error.message);
      }
    }
  };

  // Play local video track
  useEffect(() => {
    const videoElement = localVideoRef.current;

    if (localVideoTrack && videoElement) {
      try {
        localVideoTrack.play(videoElement);

        // Check if video element got a video tag
        setTimeout(() => {
          const videoTag = videoElement.querySelector("video");
          // Video tag available for display
        }, 1000);
      } catch (error) {
        // Error handled silently
      }
    }

    return () => {
      if (localVideoTrack && videoElement) {
        try {
          localVideoTrack.stop();
        } catch (error) {
          // Error handled silently
        }
      }
    };
  }, [localVideoTrack, isCameraOn]);

  // Play local screen track (similar to NEW project)
  useEffect(() => {
    const screenElement = localScreenRef.current;
    if (localScreenTrack && screenElement) {
      try {
        localScreenTrack.play(screenElement);
      } catch (error) {
        // Error handled silently
      }
    }

    return () => {
      // Cleanup when screen track changes
      if (screenElement) {
        try {
          // Clear the video element
          const videoElement = screenElement.querySelector("video");
          if (videoElement) {
            videoElement.srcObject = null;
            videoElement.remove();
          }
        } catch (error) {
          // Cleanup error handled silently
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
          user.videoTrack.play(videoRef.current);
        } catch (error) {
          // Error handled silently
        }
      }

      return () => {
        // Cleanup video element
        if (videoRef.current) {
          try {
            const videoElement = videoRef.current.querySelector("video");
            if (videoElement) {
              videoElement.srcObject = null;
            }
          } catch (error) {
            // Cleanup error handled silently
          }
        }
      };
    }, [user.videoTrack]);

    useEffect(() => {
      if (user.audioTrack && audioRef.current) {
        try {
          user.audioTrack.play(audioRef.current);
        } catch (error) {
          // Error handled silently
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
    <div className="h-full flex flex-col min-h-0">
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
            <span>
              {remoteUsers.length + (isJoined ? 1 : 0)} người tham gia
            </span>
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
                  // Error handled silently
                }
              }}
            >
              {isCameraOn ? "Turn OFF Camera" : "Turn ON Camera"}
            </Button>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 grid gap-4 overflow-auto max-h-[65vh]">
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
                        <VideoOff
                          size={48}
                          className="mx-auto mb-2 opacity-50"
                        />
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
            {remoteUsers.map((user) => {
              console.log("🎭 Rendering remote user:", {
                uid: user.uid,
                hasVideo: !!user.videoTrack,
                hasAudio: !!user.audioTrack,
              });
              return (
                <div key={user.uid} className="aspect-video">
                  <RemoteVideoCard user={user} />
                </div>
              );
            })}

            {/* Debug info for remote users */}
            {remoteUsers.length > 0 && (
              <div className="col-span-full">
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                  🔍 Debug: {remoteUsers.length} remote user(s) detected - UIDs:{" "}
                  {remoteUsers.map((u) => u.uid).join(", ")}
                </div>
              </div>
            )}

            {/* Empty state */}
            {remoteUsers.length === 0 && !isJoined && (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Đang chờ kết nối...</p>
                </div>
              </div>
            )}

            {/* Debug state when joined but no remote users */}
            {remoteUsers.length === 0 && isJoined && (
              <div className="aspect-video bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-yellow-700">
                  <Users size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Đã kết nối - chờ người khác tham gia</p>
                  <p className="text-xs mt-1">
                    Hoặc có thể người khác đã có sẵn nhưng chưa được sync
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meeting Controls (fixed footer area so buttons don't get pushed out) */}
      <div className="flex-none mt-3">
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
          <p className="text-gray-600">
            Kiểm tra camera... (sẽ tự đóng sau 3 giây)
          </p>
        </div>
      </Modal>
    </div>
  );
}
