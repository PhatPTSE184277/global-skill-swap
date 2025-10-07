import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ChatBox from "../../components/user/Meeting/ChatBox";
import VideoSection from "../../components/user/Meeting/VideoSection";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";
import socketService from "../../services/socketService";
import userService from "../../services/userService";
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
  // State cho UI panels
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

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
      } catch {
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
            console.log(
              "🔌 MeetingPage - Rejoining room to ensure connection:",
              roomId
            );
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
  }, [roomLink, navigate]);

  return (
    <div className="h-screen flex bg-gray-900 relative overflow-hidden">
      {/* Main Video Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          showChat || showParticipants ? "mr-80" : ""
        }`}
      >
        {uid && currentUser && roomId ? (
          <VideoSection
            roomId={roomId}
            userName={currentUser?.username}
            uid={uid}
            currentUser={currentUser}
            onLeave={() => navigate("/meeting")}
            showChat={showChat}
            showParticipants={showParticipants}
            showRoomInfo={showRoomInfo}
            onToggleChat={() => {
              setShowChat(!showChat);
              setShowParticipants(false);
              setShowRoomInfo(false);
            }}
            onToggleParticipants={() => {
              setShowParticipants(!showParticipants);
              setShowChat(false);
              setShowRoomInfo(false);
            }}
            onToggleRoomInfo={() => {
              setShowRoomInfo(!showRoomInfo);
              setShowChat(false);
              setShowParticipants(false);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Đang tải thông tin user...</p>
            </div>
          </div>
        )}
      </div>

      {/* Side Panels */}
      {(showChat || showParticipants || showRoomInfo) && (
        <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl z-10 transform transition-transform duration-300">
          {showChat && uid && currentUser && roomId && (
            <ChatBox
              roomId={roomId}
              userName={currentUser?.username}
              userId={uid}
              onClose={() => setShowChat(false)}
            />
          )}

          {showParticipants && uid && currentUser && roomId && (
            <Participants
              roomId={roomId}
              userName={currentUser?.username}
              userId={uid}
              remoteUsers={remoteUsers}
              isJoined={isJoined}
              onClose={() => setShowParticipants(false)}
            />
          )}

          {showRoomInfo && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Thông tin phòng họp</h3>
                <button
                  onClick={() => setShowRoomInfo(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <svg
                    className="w-5 h-5"
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

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room ID
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {roomId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link phòng
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded word-break">
                    {roomLink}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người tạo
                  </label>
                  <p className="text-sm text-gray-900">
                    {currentUser?.username}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số người tham gia
                  </label>
                  <p className="text-sm text-gray-900">
                    {remoteUsers.length + (isJoined ? 1 : 0)} người
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
