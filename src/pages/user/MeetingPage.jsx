import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Button } from "antd";
import { ArrowLeft } from "lucide-react";
import ChatBox from "../../components/user/Meeting/ChatBox";
import MeetingHeader from "../../components/user/Meeting/MeetingHeader";
import VideoSection from "../../components/user/Meeting/VideoSection";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";
import socketService from "../../services/socketService";
import userService from "../../services/userService"; // Import userService
import apiService from "../../services/apiService";

export default function MeetingPage() {
  const { roomLink } = useParams();
  const navigate = useNavigate();

  // getIdbyLink is async and returns a Promise. Store resolved id in state
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (!roomLink) return;
    (async () => {
      try {
        const resp = await apiService.getIdbyLink(roomLink);
        const id =
          resp?.data?.meeting_id ?? resp?.meeting_id ?? resp?.id ?? null;
        setRoomId(id);
      } catch {
        setRoomId(null);
      }
    })();
  }, [roomLink]);
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
    if (roomId && currentUser) {
      const socket = socketService.connect();
      console.log("🔌 MeetingPage - Connecting to socket for room:", roomId);

      const joinWhenReady = () => {
        if (socket && socket.connected) {
          console.log("🔌 MeetingPage - Socket ready, joining room:", roomId);
          const joinData = {
            roomId: String(roomId),
            userName: currentUser?.username || "Anonymous User",
            userId: String(currentUser?.id || uid || Date.now()),
          };
          console.log("🔌 MeetingPage - Join data:", joinData);
          socketService.joinRoom(joinData);
          
          // Force a rejoin after 1 second to ensure connection
          setTimeout(() => {
            console.log("🔌 MeetingPage - Rejoining room to ensure connection:", roomId);
            socketService.joinRoom(joinData);
          }, 1000);
        } else {
          console.log("🔌 MeetingPage - Socket not ready, retrying in 100ms");
          setTimeout(joinWhenReady, 100);
        }
      };

      joinWhenReady();
    }

    return () => {
      if (roomId) {
        console.log("🔌 MeetingPage - Leaving room:", roomId);
        socketService.leaveRoom({ 
          roomId: String(roomId),
          userName: currentUser?.username || "Anonymous User",
          userId: String(currentUser?.id || uid || Date.now()),
        });
      }
    };
  }, [roomId, currentUser?.username, uid, currentUser]);

  useEffect(() => {
    if (!roomLink) {
      message.error("Link không hợp lệ");
      navigate("/meeting");
      return;
    }
  }, []);

  const handleLeaveMeeting = async () => {
    setIsLeaving(true);
    try {
      await leaveChannel();
      message.success("Đã rời khỏi cuộc họp");
      navigate("/meeting");
    } catch (error) {
      message.error("Lỗi khi rời khỏi cuộc họp");
      navigate("/meeting");
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
          <MeetingHeader roomId={roomId} userName={currentUser?.username} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Section */}
        <div className="flex flex-col flex-1 p-4">
          {uid && currentUser && roomId ? (
            <VideoSection
              roomId={roomId}
              userName={currentUser?.username}
              uid={uid}
              currentUser={currentUser}
              onLeave={() => navigate("/meeting")}
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
            {uid && currentUser && roomId ? (
              <Participants
                roomId={roomId}
                userName={currentUser?.username}
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
            {uid && currentUser && roomId ? (
              <ChatBox
                roomId={roomId}
                userName={currentUser?.username}
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
