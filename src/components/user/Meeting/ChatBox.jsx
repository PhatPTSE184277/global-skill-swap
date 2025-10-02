import React, { useEffect, useState, useMemo } from "react";
import { Input, Button, List, Avatar, Typography, Space } from "antd";
import { Send, MessageCircle } from "lucide-react";
import { initRtm, leaveRtm, sendMessage } from "../../../agora/RtmService";

const { Text } = Typography;

export default function ChatBox({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  // Generate stable UID only once
  const uid = useMemo(() => Math.floor(Math.random() * 100000), []);
  const channelName = useMemo(() => `room_${roomId}_chat`, [roomId]);

  useEffect(() => {
    const startChat = async () => {
      if (!roomId) return;

      try {
        const appId = import.meta.env.VITE_AGORA_APP_ID;
        if (!appId) {
          console.warn("VITE_AGORA_APP_ID not configured, chat disabled");
          setMessages([
            {
              id: 1,
              sender: "System",
              text: "Chat chưa được cấu hình. Vui lòng thiết lập VITE_AGORA_APP_ID.",
              timestamp: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isSystem: true,
            },
          ]);
          return;
        }

        const success = await initRtm(
          appId,
          uid,
          channelName,
          (text, sender) => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                sender,
                text,
                timestamp: new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          }
        );
        setConnected(success);
      } catch (error) {
        console.error("Chat initialization error:", error);
      }
    };

    startChat();

    return () => {
      leaveRtm();
      setConnected(false);
    };
  }, [roomId, channelName, uid]); // Stable values from useMemo

  const handleSend = async () => {
    if (input.trim() && connected) {
      try {
        const success = await sendMessage(input);
        if (success) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              sender: userName || "Me",
              text: input,
              timestamp: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isMe: true,
            },
          ]);
          setInput("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} />
          <h3 className="font-semibold">Chat</h3>
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item style={{ border: "none", padding: "8px 0" }}>
              <div
                className={`w-full ${
                  message.isSystem
                    ? "text-center"
                    : message.isMe
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-2 rounded-lg ${
                    message.isSystem
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : message.isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {!message.isMe && !message.isSystem && (
                    <Text
                      strong
                      style={{
                        fontSize: "12px",
                        color: message.isMe ? "#fff" : "#666",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      {message.sender}
                    </Text>
                  )}
                  <div style={{ wordBreak: "break-word" }}>{message.text}</div>
                  <Text
                    style={{
                      fontSize: "10px",
                      color: message.isSystem
                        ? "rgba(180, 83, 9, 0.7)"
                        : message.isMe
                        ? "rgba(255,255,255,0.7)"
                        : "#999",
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    {message.timestamp}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: "Chưa có tin nhắn nào" }}
        />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <Space.Compact style={{ width: "100%" }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connected ? "Nhập tin nhắn..." : "Đang kết nối..."}
            disabled={!connected}
            maxLength={200}
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
