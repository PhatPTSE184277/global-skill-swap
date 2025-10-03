import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { ArrowLeft } from "lucide-react";
import ChatBox from "../../components/user/Meeting/ChatBox";
import MeetingHeader from "../../components/user/Meeting/MeetingHeader";
import VideoSection from "../../components/user/Meeting/VideoSection";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";

export default function MeetingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userName = searchParams.get("userName") || "Anonymous";
  const uid = useMemo(() => {
    const uidFromParams = searchParams.get("uid");
    return uidFromParams || Math.floor(Math.random() * 100000);
  }, [searchParams]);

  // Validate required params
  useEffect(() => {
    if (!roomId) {
      message.error("Room ID không hợp lệ");
      navigate("/meeting-lobby");
      return;
    }

    if (!userName || userName === "Anonymous") {
      const newUserName = prompt("Nhập tên của bạn:");
      if (newUserName) {
        const newUrl = `/meeting/${roomId}?userName=${encodeURIComponent(newUserName)}&uid=${uid}`;
        navigate(newUrl, { replace: true });
      } else {
        navigate("/meeting-lobby");
      }
    }
  }, [roomId, userName, uid, navigate]);

  const handleBackToLobby = () => {
    if (window.confirm("Bạn có chắc muốn rời khỏi cuộc họp?")) {
      navigate("/meeting-lobby");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <div className="flex flex-col flex-1 p-4">
          <VideoSection
            roomId={roomId}
            userName={userName}
            uid={parseInt(uid)}
            onLeave={() => navigate("/meeting-lobby")}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l flex flex-col h-full">
          <div className="h-1/3 overflow-hidden">
            <Participants 
              roomId={roomId} 
              userName={userName}
              userId={uid}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatBox 
              roomId={roomId} 
              userName={userName} 
              userId={uid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
