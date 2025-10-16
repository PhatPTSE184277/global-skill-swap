import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Tag, Button } from "antd";
import { Link, User } from "lucide-react";
import apiService from "../../../services/apiService";

export default function MeetingHeader({ roomId, userName }) {
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRoomInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getMeetingRoom(roomId);
      setRoomInfo(response);
    } catch (error) {
      console.error("Error loading room info:", error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      loadRoomInfo();
    }
  }, [roomId, loadRoomInfo]);

  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}`;
    navigator.clipboard.writeText(meetingLink);
    // You might want to show a success message here
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "blue",
      ongoing: "green",
      completed: "default",
      canceled: "red",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      scheduled: "Đã lên lịch",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
      canceled: "Đã hủy",
    };
    return texts[status] || status;
  };

  if (loading || !roomInfo) {
    return (
      <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
      {/* Left: Room Info */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-base font-semibold">{roomInfo.room_name}</h2>
          <Tag color={getStatusColor(roomInfo.status)}>
            {getStatusText(roomInfo.status)}
          </Tag>
          <Button
            type="text"
            size="small"
            icon={<Link size={16} />}
            onClick={copyMeetingLink}
            title="Copy meeting link"
          />
        </div>
        <p className="text-xs text-gray-500">
          {roomInfo.actual_start_time
            ? `Bắt đầu: ${new Date(roomInfo.actual_start_time).toLocaleString(
                "vi-VN"
              )}`
            : `Lên lịch: ${new Date(roomInfo.start_time).toLocaleString(
                "vi-VN"
              )}`}{" "}
          | Room ID: {roomInfo.id}
        </p>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <Avatar
            icon={<User size={16} />}
            src={`https://i.pravatar.cc/40?u=${userName}`}
            size={40}
          />
          {/* Add more avatars for other participants if needed */}
        </div>
        <div className="ml-4 text-sm">
          <p className="font-medium">{userName}</p>
          <p className="text-gray-500">Participant</p>
        </div>
      </div>
    </div>
  );
}
