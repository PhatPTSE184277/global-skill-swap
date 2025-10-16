import React, { useState, useEffect } from "react";
import {
  MicOff,
  VideoOff,
  Mic,
  Video,
  RefreshCw,
  User,
  Monitor,
} from "lucide-react";
import { Button, Avatar, Badge, List, Typography } from "antd";
import socketService from "../../../services/socketService";
import axios from "axios";

const { Text } = Typography;

export default function Participants({
  roomId,
  remoteUsers,
  isJoined,
  apiParticipants,
  participantCount,
  onRefresh,
  onClose,
}) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Combine socket participants with Agora remote users
  useEffect(() => {
    if (!roomId) return;

    console.log("👥 Setting up participants listeners for room:", roomId);

    // Listen for participant updates from socket
    const handleRoomParticipants = (participantList) => {
      console.log("👥 Room participants update:", participantList);
      setParticipants(participantList);
    };

    const handleUserJoined = (user) => {
      console.log("👥 User joined:", user);
      setParticipants((prev) => {
        const exists = prev.find((p) => p.socketId === user.socketId);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      });
    };

    const handleUserLeft = (user) => {
      console.log("👥 User left:", user);
      setParticipants((prev) =>
        prev.filter((p) => p.socketId !== user.socketId)
      );
    };

    const handleMediaStatusUpdate = (data) => {
      console.log("👥 Media status update:", data);
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === data.socketId
            ? { ...p, isCameraOn: data.isCameraOn, isMicOn: data.isMicOn }
            : p
        )
      );
    };

    const handleScreenSharingUpdate = (data) => {
      console.log("👥 Screen sharing update:", data);
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === data.socketId
            ? { ...p, isScreenSharing: data.isScreenSharing }
            : p
        )
      );
    };

    // Set up socket listeners
    const unsubscribeParticipants = socketService.onRoomParticipants(
      handleRoomParticipants
    );
    const unsubscribeJoined = socketService.onUserJoined(handleUserJoined);
    const unsubscribeLeft = socketService.onUserLeft(handleUserLeft);
    const unsubscribeMedia = socketService.onMediaStatusUpdate(
      handleMediaStatusUpdate
    );
    const unsubscribeScreen = socketService.onScreenSharingUpdate(
      handleScreenSharingUpdate
    );

    return () => {
      unsubscribeParticipants();
      unsubscribeJoined();
      unsubscribeLeft();
      unsubscribeMedia();
      unsubscribeScreen();
    };
  }, [roomId]);

  // Use API participants if available, otherwise fallback to socket participants
  useEffect(() => {
    if (apiParticipants && apiParticipants.length > 0) {
      setParticipants(apiParticipants);
    }
  }, [apiParticipants]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      console.log("👥 Refreshing participants...");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("❌ Error loading participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (userName) => {
    const colors = [
      "#f56565",
      "#48bb78",
      "#ed8936",
      "#4299e1",
      "#9f7aea",
      "#38b2ac",
    ];
    const hash =
      userName?.split("").reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0) || 0;
    return colors[Math.abs(hash) % colors.length];
  };

  const isUserInAgoraCall = (participant) => {
    return remoteUsers.some(
      (user) => user.uid.toString() === participant.userId?.toString()
    );
  };

  const totalParticipants = participantCount || (participants.length + (isJoined ? 1 : 0));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <User size={20} className="text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-900">Người tham gia</h3>
            <p className="text-xs text-gray-500">{totalParticipants} người</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadParticipants}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-500 ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        <List
          size="small"
          dataSource={[
            // Add self as first participant if joined
            ...(isJoined
              ? [
                  {
                    id: "self",
                    userName: "Bạn",
                    userId: "self",
                    socketId: "self",
                    isCameraOn: true, // This should come from useAgora
                    isMicOn: true, // This should come from useAgora
                    isScreenSharing: false,
                    joinedAt: new Date(),
                    isSelf: true,
                  },
                ]
              : []),
            ...participants,
          ]}
          renderItem={(participant) => (
            <List.Item className="px-3 py-2">
              <div className="flex items-center justify-between w-full">
                {/* User Info */}
                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative">
                    <Avatar
                      size="small"
                      style={{
                        backgroundColor: getAvatarColor(participant.userName),
                      }}
                      icon={<User size={12} />}
                    >
                      {participant.userName?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    {/* Online indicator */}
                    {(participant.isSelf || isUserInAgoraCall(participant)) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <Text className="text-sm font-medium truncate">
                        {participant.userName}
                        {participant.isSelf && " (Bạn)"}
                      </Text>
                      {participant.isScreenSharing && (
                        <Monitor size={12} className="text-blue-500" />
                      )}
                    </div>
                    <Text type="secondary" className="text-xs">
                      {participant.isSelf
                        ? "Đang tham gia"
                        : isUserInAgoraCall(participant)
                        ? "Trong cuộc gọi"
                        : "Đang chờ"}
                    </Text>
                  </div>
                </div>

                {/* Media Status */}
                <div className="flex items-center space-x-1">
                  {/* Microphone Status */}
                  <div
                    className={`p-1 rounded ${
                      participant.isMicOn
                        ? "text-green-500 bg-green-50"
                        : "text-red-500 bg-red-50"
                    }`}
                  >
                    {participant.isMicOn ? (
                      <Mic size={12} />
                    ) : (
                      <MicOff size={12} />
                    )}
                  </div>

                  {/* Camera Status */}
                  <div
                    className={`p-1 rounded ${
                      participant.isCameraOn
                        ? "text-green-500 bg-green-50"
                        : "text-red-500 bg-red-50"
                    }`}
                  >
                    {participant.isCameraOn ? (
                      <Video size={12} />
                    ) : (
                      <VideoOff size={12} />
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <User size={32} className="mx-auto mb-2 text-gray-400" />
                <Text type="secondary">Chưa có người tham gia</Text>
              </div>
            ),
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t bg-gray-50">
        <Text type="secondary" className="text-xs">
          {participants.filter((p) => isUserInAgoraCall(p)).length +
            (isJoined ? 1 : 0)}{" "}
          trong cuộc gọi video
        </Text>
      </div>
    </div>
  );
}
