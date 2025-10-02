import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { ArrowLeft } from "lucide-react";
import ChatBox from "../../components/user/Meeting/ChatBox";
import MeetingHeader from "../../components/user/Meeting/MeetingHeader";
import VideoSection from "../../components/user/Meeting/VideoSection";
import MeetingControls from "../../components/user/Meeting/MeetingControls";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";
import apiService from "../../services/apiService";

export default function MeetingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { leaveChannel } = useAgora();

  const userName = searchParams.get("userName") || "Anonymous";

  // Use useMemo to ensure uid doesn't change on re-renders
  const uid = useMemo(() => {
    const uidFromParams = searchParams.get("uid");
    const generatedUid = uidFromParams || Math.floor(Math.random() * 100000);
    console.log("UID generated/retrieved:", generatedUid);
    return generatedUid;
  }, [searchParams]);

  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!roomId) {
      message.error("Room ID không hợp lệ");
      navigate("/meeting-lobby");
      return;
    }

    if (!userName || userName === "Anonymous") {
      const newUserName = prompt("Nhập tên của bạn:");
      if (newUserName) {
        const newUrl = `/meeting/${roomId}?userName=${encodeURIComponent(
          newUserName
        )}&uid=${uid}`;
        navigate(newUrl, { replace: true });
      } else {
        navigate("/meeting-lobby");
      }
    }
  }, [roomId, userName, uid, navigate]);

  const handleLeaveMeeting = async () => {
    console.log("🚪 Starting leave process...", { roomId, uid });
    setIsLeaving(true);
    try {
      // 1. Call backend API to leave room first
      try {
        const leaveData = {
          roomId: parseInt(roomId),
          uid: parseInt(uid),
        };
        console.log("📡 Calling backend leave API...", leaveData);
        const response = await apiService.leaveRoom(roomId, leaveData);
        console.log("✅ Backend leave response:", response);
      } catch (apiError) {
        console.error("❌ Error leaving room via API:", apiError);
        // Continue with Agora cleanup even if API fails
      }

      // 2. Leave Agora channel
      console.log("🎥 Leaving Agora channel...");
      await leaveChannel();
      console.log("✅ Left Agora channel successfully");

      message.success("Đã rời khỏi cuộc họp");
      navigate("/meeting-lobby");
    } catch (error) {
      console.error("❌ Error leaving meeting:", error);
      message.error("Lỗi khi rời khỏi cuộc họp");
      // Still navigate back even if there's an error
      navigate("/meeting-lobby");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleBackToLobby = () => {
    navigate("/meeting-lobby");
  };

  if (!roomId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2>Room không tồn tại</h2>
          <Button type="primary" onClick={handleBackToLobby}>
            Quay lại Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-2">
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={handleBackToLobby}
        >
          Quay lại Lobby
        </Button>
        <div className="flex-1">
          <MeetingHeader roomId={roomId} userName={userName} />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <div className="flex flex-col flex-1 p-4">
          <VideoSection
            roomId={roomId}
            userName={userName}
            uid={parseInt(uid)}
          />
          <MeetingControls onLeave={handleLeaveMeeting} isLeaving={isLeaving} />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l flex flex-col h-full">
          <div className="h-1/3 overflow-hidden">
            <Participants roomId={roomId} />
          </div>
          <div className="flex-1 border-t overflow-hidden">
            <ChatBox roomId={roomId} userName={userName} />
          </div>
        </div>
      </div>
    </div>
  );
}
