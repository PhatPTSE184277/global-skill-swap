import React, { useEffect, useState, useRef } from "react";
import { Input, Button, List, Avatar, Typography, Space } from "antd";
import { Send, MessageCircle, User } from "lucide-react";
import socketService from "../../../services/socketService";

const { Text } = Typography;

export default function ChatBox({ roomId, userName, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection (like NEW project)
  useEffect(() => {
    if (!roomId || !userName) return;

    console.log('💬 Initializing chat for room:', roomId);

    // Connect to socket server using socketService
    const socket = socketService.connect('http://localhost:3000');
    socketRef.current = socket;

    // Wait for connection and join room
    if (socketService.isConnected) {
      joinRoom();
    } else {
      socket.on('connect', joinRoom);
    }

    function joinRoom() {
      console.log('✅ Chat connected');
      setConnected(true);
      
      // Join room
      socket.emit('join-room', {
        roomId,
        userId,
        displayName: userName
      });
    }

    socket.on('disconnect', () => {
      console.log('❌ Chat disconnected');
      setConnected(false);
    });

    // Listen for messages (NEW project pattern)
    socket.on('receive-message', (message) => {
      console.log('💬 Received message:', message);
      
      // Only add messages from other users (not our own)
      if (message.userId !== userId) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          message: message.message,
          userName: message.displayName,
          userId: message.userId,
          timestamp: new Date(message.timestamp)
        }]);
      }
    });

    // Listen for user join/leave events for chat notifications
    socket.on('user-joined', (data) => {
      console.log('👤 User joined notification:', data);
      if (data.userId !== userId) {
        setMessages(prev => [...prev, {
          id: `join_${Date.now()}`,
          message: `${data.displayName || data.userName} đã tham gia cuộc họp`,
          userName: "Hệ thống",
          timestamp: new Date(),
          isSystem: true,
          type: 'join'
        }]);
      }
    });

    socket.on('user-left', (data) => {
      console.log('👤 User left notification:', data);
      if (data.userId !== userId) {
        setMessages(prev => [...prev, {
          id: `leave_${Date.now()}`,
          message: `${data.displayName || data.userName} đã rời khỏi cuộc họp`,
          userName: "Hệ thống",
          timestamp: new Date(),
          isSystem: true,
          type: 'leave'
        }]);
      }
    });

    // Add welcome message
    setMessages([{
      id: "welcome",
      message: `Chào mừng ${userName} đến với cuộc họp!`,
      userName: "Hệ thống",
      timestamp: new Date(),
      isSystem: true
    }]);

    return () => {
      // Emit leave-room before cleanup
      if (socketRef.current) {
        socketRef.current.emit('leave-room', {
          roomId,
          userId,
          displayName: userName
        });
      }
      
      // Clean up listeners but don't disconnect socket
      // as it might be used by other components
      socket.off('connect', joinRoom);
      socket.off('disconnect');
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [roomId, userName, userId]);

  const handleSend = async () => {
    if (!input.trim() || !connected) return;

    try {
      // Create message data
      const messageData = {
        roomId,
        message: input.trim(),
        userId,
        displayName: userName,
        timestamp: new Date().toISOString()
      };

      // Add message immediately to own chat (optimistic update)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        message: messageData.message,
        userName: messageData.displayName,
        userId: messageData.userId,
        timestamp: new Date(messageData.timestamp)
      }]);

      // Send to server
      socketRef.current?.emit('send-message', messageData);
      console.log('💬 Message sent:', messageData);

      setInput("");
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
    const colors = ["#f56565", "#48bb78", "#ed8936", "#4299e1", "#9f7aea", "#38b2ac"];
    const hash = userName?.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} className="text-blue-500" />
          <Text strong>Chat</Text>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <Text type="secondary" className="text-xs">
            {connected ? "Đã kết nối" : "Mất kết nối"}
          </Text>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "400px" }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <List
            dataSource={messages}
            split={false}
            renderItem={(msg) => (
              <List.Item className="px-0 py-2">
                <div className={`flex items-start space-x-2 w-full ${
                  msg.userId === userId ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <Avatar
                    size="small"
                    style={{ backgroundColor: getAvatarColor(msg.userName) }}
                    icon={<User size={12} />}
                  >
                    {msg.userName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  
                  <div className={`flex-1 ${msg.userId === userId ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Text className="text-xs font-medium text-gray-600">
                        {msg.userName}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {formatTime(msg.timestamp)}
                      </Text>
                    </div>
                    <div className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                      msg.isSystem 
                        ? 'bg-yellow-100 text-yellow-800'
                        : msg.userId === userId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Text className={msg.userId === userId ? 'text-white' : ''}>
                        {msg.isSystem && msg.type === 'join' && '� '}
                        {msg.isSystem && msg.type === 'leave' && '� '}
                        {msg.isSystem && !msg.type && 'ℹ️ '}
                        {msg.message}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <Space.Compact className="w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            disabled={!connected}
          />
          <Button
            type="primary"
            icon={<Send size={16} />}
            onClick={handleSend}
            disabled={!connected || !input.trim()}
          />
        </Space.Compact>
      </div>
    </div>
  );
}
