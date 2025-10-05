import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { ArrowLeft } from "lucide-react";
import ChatBox from "../../components/user/Meeting/ChatBox";
import MeetingHeader from "../../components/user/Meeting/MeetingHeader";
import VideoSection from "../../components/user/Meeting/VideoSection";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";
import socketService from "../../services/socketService";
import userService from "../../services/userService"; // Import userService

export default function MeetingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userName = searchParams.get("userName") || "Anonymous";

  // State để lưu thông tin user thực
  const [currentUser, setCurrentUser] = useState(null);
  const [uid, setUid] = useState(null);

  const [isLeaving, setIsLeaving] = useState(false);

  // Get Agora hook values
  const { leaveChannel, remoteUsers, isJoined } = useAgora();

  // Lấy thông tin user thực khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await userService.getUserInfo();
        if (user) {
          setCurrentUser(user);
          setUid(user.id);
        } else {
          const fallbackUid = Math.floor(Math.random() * 100000);
          setUid(fallbackUid);
        }
      } catch (error) {
        const fallbackUid = Math.floor(Math.random() * 100000);
        setUid(fallbackUid);
      }
    };

    fetchUserInfo();
  }, []);

  // Join socket room when component mounts and user info is available
  useEffect(() => {
    if (roomId && userName && uid && currentUser) {
      const socket = socketService.connect();

      const joinWhenReady = () => {
        if (socket.connected) {
          socketService.joinRoom({
            roomId: String(roomId),
            userName: currentUser.username || userName,
            userId: String(currentUser.id),
          });
        } else {
          setTimeout(joinWhenReady, 100);
        }
      };

      joinWhenReady();
    }

    return () => {
      if (roomId) {
        socketService.leaveRoom({ roomId: String(roomId) });
      }
    };
  }, [roomId, userName, uid, currentUser]);

  useEffect(() => {
    if (!roomId) {
      message.error("Room ID không hợp lệ");
      navigate("/room");
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
        navigate("/room");
      }
    }
  }, [roomId, userName, uid, navigate]);

  const handleBackToLobby = () => {
    if (window.confirm("Bạn có chắc muốn rời khỏi cuộc họp?")) {
      navigate("/room");
    }
  };

  const handleLeaveMeeting = async () => {
    setIsLeaving(true);
    try {
      await leaveChannel();
      message.success("Đã rời khỏi cuộc họp");
      navigate("/room");
    } catch (error) {
      message.error("Lỗi khi rời khỏi cuộc họp");
      navigate("/room");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={handleLeaveMeeting}
        >
          Quay lại Phòng Học
        </Button>
        <div className="flex-1">
          <MeetingHeader roomId={roomId} userName={userName} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <div className="flex flex-col flex-1 p-4">
          {uid && currentUser ? (
            <VideoSection
              roomId={roomId}
              userName={currentUser.username || userName}
              uid={uid}
              currentUser={currentUser}
              onLeave={() => navigate("/room")}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p>Đang tải thông tin user...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l flex flex-col h-full">
          <div className="h-1/3 overflow-hidden">
            {uid && currentUser ? (
              <Participants
                roomId={roomId}
                userName={currentUser.username || userName}
                userId={uid}
                remoteUsers={remoteUsers}
                isJoined={isJoined}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Đang tải...</p>
              </div>
            )}
          </div>
          <div className="flex-1 border-t overflow-hidden">
            {uid && currentUser ? (
              <ChatBox
                roomId={roomId}
                userName={currentUser.username || userName}
                userId={uid}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Đang tải...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
