import React, { useEffect, useState, useRef } from "react";
import { message } from "antd";
import useAgora from "../../../hooks/useAgora";
import apiService from "../../../services/apiService";

export default function VideoSection({ roomId, userName, uid }) {
  const {
    localVideoTrack,
    localScreenTrack,
    isScreenSharing,
    remoteUsers,
    isJoined,
    joinChannel,
    leaveChannel,
  } = useAgora();

  const [loading, setLoading] = useState(false);
  const localVideoRef = useRef(null);
  const localScreenRef = useRef(null);

  // Check if any user (local or remote) is sharing screen
  // Use manual signaling instead of auto-detection
  const remoteScreenShareUser = remoteUsers.find(
    (user) => user.isScreenSharing === true
  );
  const anyScreenSharing = isScreenSharing || !!remoteScreenShareUser;

  // Debug log for screen sharing detection
  useEffect(() => {
    console.log("🖥️ Screen sharing debug (manual signaling):", {
      localScreenSharing: isScreenSharing,
      hasLocalScreenTrack: !!localScreenTrack,
      localScreenTrackDetails: localScreenTrack
        ? {
            id: localScreenTrack._ID,
            type: localScreenTrack.trackMediaType,
            enabled: localScreenTrack.enabled,
          }
        : null,
      remoteUsers: remoteUsers.map((user) => ({
        uid: user.uid,
        hasVideoTrack: !!user.videoTrack,
        isScreenSharing: user.isScreenSharing,
      })),
      remoteScreenShareUser: remoteScreenShareUser
        ? {
            uid: remoteScreenShareUser.uid,
            isScreenSharing: remoteScreenShareUser.isScreenSharing,
          }
        : null,
      anyScreenSharing,
      renderConditions: {
        shouldShowLocalScreen: !!(localScreenTrack && !remoteScreenShareUser),
        localScreenRef: !!localScreenRef.current,
      },
    });
  }, [
    isScreenSharing,
    localScreenTrack,
    remoteUsers,
    remoteScreenShareUser,
    anyScreenSharing,
  ]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const initializingRef = useRef(false); // Prevent multiple simultaneous calls
  const lastInitTimeRef = useRef(0); // Debounce mechanism
  const joinChannelRef = useRef(joinChannel); // Stable reference
  const leaveChannelRef = useRef(leaveChannel); // Stable reference
  const hasInitializedRef = useRef(false); // Stable reference for cleanup

  // Update refs when values change
  useEffect(() => {
    joinChannelRef.current = joinChannel;
    leaveChannelRef.current = leaveChannel;
    hasInitializedRef.current = hasInitialized;
  }, [joinChannel, leaveChannel, hasInitialized]);

  useEffect(() => {
    // Auto-initialize when props are ready and not already initialized
    const shouldInitialize =
      roomId &&
      userName &&
      uid &&
      !hasInitialized &&
      !loading &&
      !initializingRef.current;

    console.log("VideoSection useEffect check:", {
      roomId,
      userName,
      uid,
      hasInitialized,
      loading,
      initializingRef: initializingRef.current,
      shouldInitialize,
    });

    if (shouldInitialize) {
      console.log("Auto-initializing call for room:", roomId);

      // Call init directly instead of using the callback
      const init = async () => {
        const now = Date.now();
        const timeSinceLastInit = now - lastInitTimeRef.current;

        // Debounce: only allow init every 2 seconds
        if (timeSinceLastInit < 2000) {
          console.log("Debouncing init call, too recent");
          return;
        }

        if (initializingRef.current) {
          console.log("Already initializing, skipping");
          return;
        }

        lastInitTimeRef.current = now;
        initializingRef.current = true;
        setLoading(true);
        setHasInitialized(true);

        try {
          console.log(
            "Initializing call for room:",
            roomId,
            "user:",
            userName,
            "uid:",
            uid
          );

          // 1. Join room via API
          const joinData = {
            roomId: parseInt(roomId),
            uid: parseInt(uid),
            displayName: userName,
          };

          const response = await apiService.joinRoom(roomId, joinData);
          const { appId, channelName, rtcToken } = response.data;

          message.success("Đã join room thành công!");

          // 2. Join Agora channel using ref to avoid dependency issues
          await joinChannelRef.current(
            appId,
            channelName,
            rtcToken,
            parseInt(uid)
          );

          message.success("Đã kết nối video call!");
        } catch (error) {
          console.error("Error initializing call:", error);
          message.error(`Lỗi kết nối: ${error.message}`);
          setHasInitialized(false); // Reset on error
        } finally {
          setLoading(false);
          initializingRef.current = false;
        }
      };

      init();
    }
  }, [roomId, userName, uid, hasInitialized, loading]); // Removed joinChannel from dependencies

  // Separate effect for cleanup on unmount only
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts - use refs to avoid dependencies
      if (hasInitializedRef.current && !initializingRef.current) {
        console.log("Component unmounting, cleaning up...");
        // Use ref to call leaveChannel
        leaveChannelRef.current();
      }
    };
  }, []); // Empty dependencies - only runs on mount/unmount

  useEffect(() => {
    // Play local video when track is available
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  useEffect(() => {
    // Play local screen when track is available - with retry mechanism
    const playScreenTrack = () => {
      if (localScreenTrack && localScreenRef.current) {
        console.log("📺 Playing local screen track in ref:", {
          trackId: localScreenTrack._ID,
          refElement: localScreenRef.current,
          isScreenSharing,
        });
        try {
          localScreenTrack.play(localScreenRef.current);
          console.log("✅ Local screen track play() called successfully");
        } catch (error) {
          console.error("❌ Failed to play screen track:", error);
        }
      } else {
        console.log("❌ Cannot play local screen track:", {
          hasTrack: !!localScreenTrack,
          hasRef: !!localScreenRef.current,
          isScreenSharing,
        });

        // Retry after a short delay if ref is not ready
        if (localScreenTrack && !localScreenRef.current) {
          console.log("🔄 Retrying screen track play in 100ms...");
          setTimeout(playScreenTrack, 100);
        }
      }
    };

    playScreenTrack();
  }, [localScreenTrack, isScreenSharing]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kết nối...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 rounded-lg p-4 relative">
      {/* Main video grid */}
      <div
        className={`grid gap-4 h-full ${
          // When any user is screen sharing, use different layout
          anyScreenSharing
            ? "grid-cols-1 lg:grid-cols-4" // Screen takes main area, videos in sidebar
            : localVideoTrack && remoteUsers.length > 0
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : localVideoTrack || remoteUsers.length > 0
            ? "grid-cols-1"
            : "grid-cols-1"
        }`}
      >
        {/* Remote screen sharing takes highest priority */}
        {remoteScreenShareUser && (
          <div className="relative bg-black rounded-lg overflow-hidden lg:col-span-3 row-span-2">
            <RemoteVideoPlayer
              user={remoteScreenShareUser}
              isScreenShare={true}
              isCompact={false}
            />
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Remote Screen Share
            </div>
          </div>
        )}

        {/* Local screen sharing (only if no remote screen sharing) */}
        {(() => {
          const shouldRender = localScreenTrack && !remoteScreenShareUser;
          console.log("🖥️ Local screen render check:", {
            localScreenTrack: !!localScreenTrack,
            localScreenTrackId: localScreenTrack?._ID,
            remoteScreenShareUser: !!remoteScreenShareUser,
            shouldRender,
            isScreenSharing,
          });
          return shouldRender;
        })() && (
          <div
            className={`relative bg-black rounded-lg overflow-hidden ${
              isScreenSharing ? "lg:col-span-3 row-span-2" : ""
            }`}
          >
            <div ref={localScreenRef} className="w-full h-full min-h-[400px]" />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              📺 {userName} đang chia sẻ màn hình
            </div>
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Your Screen Share
            </div>
          </div>
        )}

        {/* Local video - smaller when any screen sharing */}
        {localVideoTrack && (
          <div
            className={`relative bg-black rounded-lg overflow-hidden ${
              anyScreenSharing ? "h-40" : ""
            }`}
          >
            <div
              ref={localVideoRef}
              className={`w-full h-full ${
                anyScreenSharing ? "min-h-[160px]" : "min-h-[200px]"
              }`}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              🎥 {userName} (You)
            </div>
          </div>
        )}

        {/* Remote videos - smaller when screen sharing, exclude screen sharing user */}
        {remoteUsers
          .filter((user) => !user.isScreenSharing)
          .map((user) => (
            <RemoteVideoPlayer
              key={`remote-video-${user.uid}`}
              user={user}
              isCompact={anyScreenSharing}
              isScreenShare={false}
            />
          ))}

        {/* Empty placeholder when no videos */}
        {!localVideoTrack &&
          !localScreenTrack &&
          !remoteScreenShareUser &&
          remoteUsers.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-96 bg-gray-800 rounded-lg">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-xl">Chưa có video nào</p>
                <p className="text-sm">
                  Bật camera hoặc chia sẻ màn hình để bắt đầu
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Connection status */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isJoined ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isJoined ? "bg-white" : "bg-white animate-pulse"
            }`}
          />
          {isJoined ? "Đã kết nối" : "Đang kết nối..."}
        </div>
      </div>
    </div>
  );
}

// Component for remote video player
function RemoteVideoPlayer({ user, isCompact = false, isScreenShare = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);
    }
  }, [user.videoTrack]);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${
        isCompact ? "h-40" : ""
      } ${isScreenShare ? "min-h-[400px]" : ""}`}
    >
      <div
        ref={videoRef}
        className={`w-full h-full ${
          isScreenShare
            ? "min-h-[400px]"
            : isCompact
            ? "min-h-[160px]"
            : "min-h-[200px]"
        }`}
      />

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        {isScreenShare ? "📺" : "🎥"} User {user.uid}{" "}
        {isScreenShare ? "đang chia sẻ màn hình" : ""}
      </div>

      {/* Audio indicator */}
      {user.audioTrack && (
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
          🎤
        </div>
      )}

      {/* Screen share indicator */}
      {isScreenShare && (
        <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
          Screen Share
        </div>
      )}
    </div>
  );
}
