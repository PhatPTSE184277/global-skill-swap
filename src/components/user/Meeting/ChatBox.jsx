import React, { useEffect, useState, useRef } from "react";
import { Input, Button, List, Avatar, Typography, Space, Badge } from "antd";
import { Send, MessageCircle, User } from "lucide-react";
import socketService from "../../../services/socketService";

const { Text } = Typography;

export default function ChatBox({ roomId, userName, userId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection and set up chat listeners
  useEffect(() => {
    if (!roomId || !userName) {
      console.log("❌ Missing roomId or userName:", { roomId, userName });
      return;
    }

    console.log("💬 Initializing chat for room:", roomId, "user:", userName);
    console.log("🔌 Socket URL from env:", import.meta.env.VITE_SOCKET_URL);

    // Connect to socket if not already connected
    const socket = socketService.connect();
    console.log(
      "🔌 Socket instance:",
      socket?.id || "no-id",
      "connected:",
      socket?.connected || false
    );

    // Set connection status based on socket connection state
    const connectionState = socketService.getConnectionState();
    setConnected(connectionState.isConnected);

    // Set up reconnection handler
    const handleConnect = () => {
      console.log("🔌 Socket reconnected");
      setConnected(true);
    };

    socket?.on?.("connect", handleConnect);

    // DON'T join room here - let MeetingPage handle it
    // We'll just set up listeners

    // Set up message listener - only use NEW project pattern
    const handleReceiveMessage = (message) => {
      console.log("💬 Received receive-message:", message);
      console.log("💬 Current user info:", { userId, userName });
      console.log("💬 Message sender info:", {
        messageUserId: message.userId,
        messageDisplayName: message.displayName,
        messageUserName: message.userName,
      });

      if (!message || !message.message) {
        console.warn("⚠️ Received invalid message format:", message);
        return;
      }

      // Convert NEW project format to our format
      const formattedMessage = {
        id: `${message.userId}-${Date.now()}-${Math.random()}`, // Unique ID to avoid conflicts
        message: message.message,
        userName: message.displayName || message.userName,
        userId: message.userId,
        timestamp: message.timestamp || new Date().toISOString(),
      };

      console.log("✅ Adding formatted message to UI:", formattedMessage);
      console.log(
        "💬 Is this my own message?",
        String(message.userId) === String(userId)
      );

      setMessages((prev) => {
        console.log("💬 Current messages count:", prev.length);

        // If this is my own message, check if we already have a local version
        const isMyMessage = String(message.userId) === String(userId);
        if (isMyMessage) {
          const hasLocalVersion = prev.find(
            (msg) =>
              msg.message === formattedMessage.message &&
              msg.userId === formattedMessage.userId &&
              msg.isLocal === true
          );

          if (hasLocalVersion) {
            console.log(
              "🔄 Server echoed my message, but local version exists, skipping"
            );
            return prev;
          }
        }

        // General duplicate check - avoid adding same content from same user within 2 seconds
        const recentDuplicate = prev.find(
          (msg) =>
            msg.message === formattedMessage.message &&
            msg.userId === formattedMessage.userId &&
            !msg.isLocal && // Don't compare with local messages
            Math.abs(
              new Date(msg.timestamp).getTime() -
                new Date(formattedMessage.timestamp).getTime()
            ) < 2000
        );

        if (recentDuplicate) {
          console.log("🔄 Recent duplicate message detected, skipping");
          return prev;
        }

        const newMessages = [...prev, formattedMessage];
        console.log("💬 New messages count:", newMessages.length);
        return newMessages;
      });
    };

    // Listen for receive-message only (NEW project pattern)
    const unsubscribeReceiveMessage =
      socketService.onReceiveMessage(handleReceiveMessage);

    // Add welcome message
    setMessages([
      {
        id: "welcome",
        message: `Chào mừng ${userName} đến với cuộc họp! (Room: ${roomId})`,
        userName: "Hệ thống",
        timestamp: new Date().toISOString(),
        isSystem: true,
      },
    ]);

    console.log(
      "💬 Chat initialized for room:",
      roomId,
      "user:",
      userName,
      "userId:",
      userId
    );

    return () => {
      // Clean up all event listeners
      unsubscribeReceiveMessage();
      socket?.off?.("connect", handleConnect);
      console.log("🧹 Cleaned up chat room listeners for:", roomId);
    };
  }, [roomId, userName, userId]);

  // Handle socket connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log("💬 Chat connected");
      setConnected(true);
      // DON'T re-join room here - let MeetingPage handle it
    };

    const handleDisconnect = () => {
      console.log("💬 Chat disconnected");
      setConnected(false);
    };

    const handleError = (error) => {
      console.error("💬 Socket error:", error);
    };

    socketService.on("connect", handleConnect);
    socketService.on("disconnect", handleDisconnect);
    socketService.on("connect_error", handleError);

    return () => {
      socketService.off("connect", handleConnect);
      socketService.off("disconnect", handleDisconnect);
      socketService.off("connect_error", handleError);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !connected) {
      console.log("❌ Cannot send message:", {
        input: input.trim(),
        connected,
        roomId,
        userName,
        socketConnected: socketService.getConnectionState().isConnected,
        socketId: socketService.getConnectionState().socketId,
      });
      return;
    }

    try {
      // Use only NEW project pattern to avoid duplicates
      const messageData = {
        roomId: String(roomId), // Ensure string
        message: input.trim(),
        displayName: userName,
        userId: String(userId), // Use consistent userId
      };

      console.log("📤 Sending message:", messageData);
      console.log("📤 Socket state before send:", {
        connected: socketService.getConnectionState().isConnected,
        socketId: socketService.getConnectionState().socketId,
      });

      const success = socketService.sendMessage(messageData);

      if (success) {
        console.log("✅ Message sent to server successfully");

        // Add message locally immediately for better UX (with special ID to avoid duplicates)
        const localMessage = {
          id: `local-${userId}-${Date.now()}`,
          message: input.trim(),
          userName: userName,
          userId: String(userId),
          timestamp: new Date().toISOString(),
          isLocal: true, // Mark as local message
        };

        console.log("✅ Adding local message to UI:", localMessage);
        setMessages((prev) => [...prev, localMessage]);

        // Clear input immediately for better UX
        setInput("");
      } else {
        console.log("❌ Failed to send message to server");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
    const hash = userName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <MessageCircle size={20} className="text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-900">Chat</h3>
            <p className="text-xs text-gray-500">
              {connected ? "Đã kết nối" : "Mất kết nối"}
            </p>
          </div>
        </div>

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

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <Text type="secondary">Chưa có tin nhắn nào</Text>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isSystem ? "justify-center" : "justify-start"
              }`}
            >
              {msg.isSystem ? (
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text type="secondary" className="text-xs">
                    {msg.message}
                  </Text>
                </div>
              ) : (
                <div
                  className={`flex space-x-2 max-w-xs ${
                    String(msg.userId) === String(userId) ? "ml-auto" : ""
                  }`}
                >
                  <Avatar
                    size="small"
                    style={{
                      backgroundColor: getAvatarColor(msg.userName),
                    }}
                    icon={<User size={12} />}
                  >
                    {msg.userName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Text strong className="text-sm">
                        {msg.userName}
                        {String(msg.userId) === String(userId) && (
                          <Text type="secondary" className="text-xs ml-1">
                            (Bạn)
                          </Text>
                        )}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {formatTime(msg.timestamp)}
                      </Text>
                    </div>
                    <div
                      className={`border rounded-lg px-3 py-2 shadow-sm ${
                        String(msg.userId) === String(userId)
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white"
                      }`}
                    >
                      <Text className="text-sm">{msg.message}</Text>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <Space.Compact className="w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connected ? "Nhập tin nhắn..." : "Đang kết nối..."}
            disabled={!connected}
            maxLength={500}
          />
          <Button
            type="primary"
            icon={<Send size={16} />}
            onClick={handleSend}
            disabled={!connected || !input.trim()}
          />
        </Space.Compact>

        {input.length > 0 && (
          <Text type="secondary" className="text-xs">
            {input.length}/500 ký tự
          </Text>
        )}
      </div>
    </div>
  );
}
