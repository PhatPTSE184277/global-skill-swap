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
  showChat,
  showParticipants,
  showRoomInfo,
  onToggleChat,
  onToggleParticipants,
  onToggleRoomInfo,
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

  // Remote video component
  const RemoteVideoCard = ({ user }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
      if (user.videoTrack && videoRef.current) {
        try {
          user.videoTrack.play(videoRef.current);
        } catch {
          // Error handled silently
        }
      }

      return () => {
        // Cleanup video element
        const currentRef = videoRef.current;
        if (currentRef) {
          try {
            const videoElement = currentRef.querySelector("video");
            if (videoElement) {
              videoElement.srcObject = null;
            }
          } catch {
            // Cleanup error handled silently
          }
        }
      };
    }, [user.videoTrack]);

    useEffect(() => {
      if (user.audioTrack && audioRef.current) {
        try {
          user.audioTrack.play(audioRef.current);
        } catch {
          // Error handled silently
        }
      }
    }, [user.audioTrack]);

    return (
      <div className="relative bg-black rounded-2xl overflow-hidden w-full h-full">
        {user.videoTrack ? (
          <div ref={videoRef} className="agora-video-container w-full h-full" />
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
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          UID: {user.uid}
        </div>

        {/* Audio indicator */}
        {user.audioTrack && (
          <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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
    <div className="h-screen flex flex-col bg-gray-900 relative">
      {/* Main Video Area */}
      <div className="flex-1 p-6">
        {/* Screen Sharing View */}
        {isScreenSharing && localScreenTrack && (
          <div className="h-full flex flex-col gap-4">
            {/* Main screen share display */}
            <div className="flex-1 bg-black rounded-2xl overflow-hidden relative">
              <div ref={localScreenRef} className="w-full h-full" />
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                🖥️ Bạn đang chia sẻ màn hình
              </div>
            </div>
            {/* Ẩn local video khi đang chia sẻ màn hình */}
          </div>
        )}

        {/* Normal Video Grid */}
  {!isScreenSharing && !remoteScreenUser && (
          <div className="h-full">
            {/* Show loading state when not joined yet */}
            {!isJoined && (
              <div className="h-full bg-gray-800 rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Video size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Đang kết nối vào phòng họp...</p>
                  {loading && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mt-2"></div>
                  )}
                </div>
              </div>
            )}

            {/* Show video grid when joined */}
            {isJoined && (
              <div className="h-full w-full flex items-center justify-center relative">
                {/* Nếu có remote user, hiển thị remote to, local nhỏ (trừ khi có remoteScreenUser thì ẩn local) */}
                {remoteUsers.length > 0 ? (
                  <>
                    {/* Remote video lớn */}
                    <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                      <RemoteVideoCard user={remoteUsers[0]} />
                    </div>
                    {/* Local video nhỏ, overlay góc phải dưới, chỉ ẩn khi tôi là người chia sẻ màn hình (isScreenSharing) */}
                    {!isScreenSharing && (
                      <div className="absolute bottom-8 right-8 w-56 h-40 bg-black rounded-xl overflow-hidden shadow-lg border-2 border-white">
                        {localVideoTrack ? (
                          <div ref={localVideoRef} className="agora-video-container w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-white">
                              <VideoOff size={32} className="mx-auto mb-2 opacity-50" />
                              <p className="text-xs opacity-75">Camera tắt</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-0.5 rounded text-xs">
                          Bạn ({userName})
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Nếu không có remote user, local video to
                  <div className="w-full h-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                    {localVideoTrack ? (
                      <div ref={localVideoRef} className="agora-video-container w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white">
                          <VideoOff size={48} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">Camera tắt</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                      Bạn ({userName})
                    </div>
                    {/* Thông báo chờ */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-70 rounded-2xl px-6 py-4 border-2 border-dashed border-gray-600">
                      <div className="text-center text-white">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Chờ người khác tham gia...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
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
          showChat={showChat}
          showParticipants={showParticipants}
          showRoomInfo={showRoomInfo}
          onToggleChat={onToggleChat}
          onToggleParticipants={onToggleParticipants}
          onToggleRoomInfo={onToggleRoomInfo}
        />
      </div>
    </div>
  );
}
