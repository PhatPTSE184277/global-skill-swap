import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Input, Button, Avatar, Typography, Badge } from "antd";
import { Send, User } from "lucide-react";
import VideoSection from "../../components/user/Meeting/VideoSection";
import Participants from "../../components/user/Meeting/Participants";
import useAgora from "../../hooks/useAgora";
import socketService from "../../services/socketService";
import userService from "../../services/userService";
import apiService from "../../services/apiService";
import axios from "axios";

const { Text } = Typography;

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

  // State for API participants
  const [apiParticipants, setApiParticipants] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);

  // Chat state - persistent
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Get Agora hook values
  const { leaveChannel, remoteUsers, isJoined } = useAgora();

  // Fetch participants from API
  const fetchParticipants = async () => {
    if (!roomId) return;

    try {
      const response = await axios.get(
        `https://gss-room-service.onrender.com/api/agora/rooms/${roomId}/participants`
      );
      if (response.data.success) {
        setApiParticipants(response.data.data.participants);
        setParticipantCount(response.data.data.count);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  // Fetch participants when roomId changes
  useEffect(() => {
    if (roomId) {
      fetchParticipants();
      // Refresh every 5 seconds
      const interval = setInterval(fetchParticipants, 5000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  // Lấy thông tin user thực khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await userService.getCurrentUser();
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
    let hasJoined = false;
    let retryTimeout = null;

    if (roomId && currentUser) {
      socketService.connect();
      console.log("🔌 MeetingPage - Connecting to socket for room:", roomId);

      const joinWhenReady = () => {
        if (hasJoined) return; // Prevent multiple joins

        const connectionState = socketService.getConnectionState();
        console.log("🔌 MeetingPage - Checking socket state:", connectionState);

        if (connectionState.isConnected && connectionState.socketId) {
          console.log("🔌 MeetingPage - Socket ready, joining room:", roomId);
          const joinData = {
            roomId: String(roomId),
            userName: currentUser?.username || "Anonymous User",
            userId: String(currentUser?.id || uid || Date.now()),
          };
          console.log("🔌 MeetingPage - Join data:", joinData);
          socketService.joinRoom(joinData);
          hasJoined = true;
        } else {
          console.log("🔌 MeetingPage - Socket not ready, retrying in 1000ms");
          retryTimeout = setTimeout(joinWhenReady, 1000);
        }
      };

      // Wait a bit for socket to connect before first attempt
      retryTimeout = setTimeout(joinWhenReady, 500);
    }

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      if (roomId && hasJoined) {
        console.log("🔌 MeetingPage - Leaving room:", roomId);
        socketService.leaveRoom({
          roomId: String(roomId),
          userName: currentUser?.username || "Anonymous User",
          userId: String(currentUser?.id || uid || Date.now()),
        });
      }
    };
  }, [roomId, currentUser?.username, uid, currentUser]);

  // Chat setup - copy từ ChatBox
  useEffect(() => {
    if (!roomId || !currentUser?.username) return;

    const socket = socketService.connect();
    const connectionState = socketService.getConnectionState();
    setConnected(connectionState.isConnected);

    const handleReceiveMessage = (message) => {
      const formattedMessage = {
        id: `${message.userId}-${Date.now()}-${Math.random()}`,
        message: message.message,
        userName: message.displayName || message.userName,
        userId: message.userId,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      // Increment unread if chat closed and not own message
      if (!showChat && String(message.userId) !== String(uid)) {
        setUnreadCount((prev) => prev + 1);
      }

      setMessages((prev) => {
        const isMyMessage = String(message.userId) === String(uid);
        if (isMyMessage) {
          const hasLocalVersion = prev.find(
            (msg) =>
              msg.message === formattedMessage.message &&
              msg.userId === formattedMessage.userId &&
              msg.isLocal === true
          );
          if (hasLocalVersion) return prev;
        }

        const recentDuplicate = prev.find(
          (msg) =>
            msg.message === formattedMessage.message &&
            msg.userId === formattedMessage.userId &&
            Math.abs(
              new Date(msg.timestamp) - new Date(formattedMessage.timestamp)
            ) < 2000
        );

        if (recentDuplicate) return prev;
        return [...prev, formattedMessage];
      });
    };

    const unsubscribe = socketService.onReceiveMessage(handleReceiveMessage);
    return () => unsubscribe();
  }, [roomId, currentUser?.username, uid, showChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset unread count when chat opens
  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;

    const messageData = {
      roomId: String(roomId),
      message: input.trim(),
      displayName: currentUser?.username,
      userName: currentUser?.username,
      userId: String(uid),
      timestamp: new Date().toISOString(),
    };

    // Add local message immediately
    const localMessage = {
      ...messageData,
      id: `local-${Date.now()}`,
      isLocal: true,
    };
    setMessages((prev) => [...prev, localMessage]);

    socketService.sendMessage(messageData);
    setInput("");
  };

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
            unreadCount={unreadCount}
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
            <div className="h-full flex flex-col bg-white">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b bg-blue-50">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">💬</div>
                  <h3 className="text-lg font-semibold text-gray-800">Chat</h3>
                  <Badge
                    count={connected ? 0 : 1}
                    dot
                    status={connected ? "success" : "error"}
                  />
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ maxHeight: "calc(100vh - 140px)" }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      String(msg.userId) === String(uid)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-xs">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar size="small" icon={<User size={12} />}>
                          {msg.userName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Text strong className="text-sm">
                          {msg.userName}
                        </Text>
                        <Text type="secondary" className="text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </div>
                      <div
                        className={`border rounded-lg px-3 py-2 ${
                          String(msg.userId) === String(uid)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Text>{msg.message}</Text>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="Nhập tin nhắn..."
                    disabled={!connected}
                    className="flex-1"
                  />
                  <Button
                    type="primary"
                    icon={<Send size={16} />}
                    onClick={handleSend}
                    disabled={!input.trim() || !connected}
                  />
                </div>
              </div>
            </div>
          )}

          {showParticipants && uid && currentUser && roomId && (
            <Participants
              roomId={roomId}
              userName={currentUser?.username}
              userId={uid}
              remoteUsers={remoteUsers}
              isJoined={isJoined}
              apiParticipants={apiParticipants}
              participantCount={participantCount}
              onRefresh={fetchParticipants}
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
                    {participantCount} người
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
