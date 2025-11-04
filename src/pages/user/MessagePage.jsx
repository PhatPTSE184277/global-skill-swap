import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import MessageContext from "../../contexts/MessageContext";

const DEFAULT_AVATAR = "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg";

const MessagesPage = () => {
  const user = useSelector(authSelector);
  const {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    loading,
    getConversations,
    getMessages,
    sendNewMessage,
    setMessages,
  } = useContext(MessageContext);

  const myAvatar =
    user?.avatar ||
    user?.avatarUrl ||
    DEFAULT_AVATAR;
  const myAvatarSidebar =
    user?.avatar ||
    user?.avatarUrl ||
    DEFAULT_AVATAR;
  const myName = user?.username || "User";
  const myUsername = user?.email ? `@${user.email.split("@")[0]}` : "";
  const myUserId = user?.id || user?._id;

  const [input, setInput] = useState("");

  // Ref để scroll xuống cuối khi có tin nhắn mới
  const messagesEndRef = useRef(null);

  // Load conversations khi component mount
  useEffect(() => {
    getConversations({ page: 0, size: 20 });
  }, []);

  // Load messages khi chọn conversation
  useEffect(() => {
    if (selectedConversation) {
      getMessages({ conversationId: selectedConversation, page: 0, size: 50 });
    }
  }, [selectedConversation]);

  // Scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedConversation]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedConversation) return;

    try {
      await sendNewMessage({
        conversationId: selectedConversation,
        content: input.trim(),
      });
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Lấy thông tin người nhận trong conversation
  const getRecipient = (conversation) => {
    return conversation.participants?.find(
      (p) => p.id !== myUserId
    ) || {};
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const recipient = selectedConv ? getRecipient(selectedConv) : {};

  if (loading && conversations.length === 0) {
    return (
      <div className="flex h-[90vh] items-center justify-center">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
      {/* Sidebar */}
      <div className="w-[320px] border-r bg-gradient-to-b from-white to-gray-50 flex flex-col">
        <div className="flex flex-col items-center py-6 border-b">
          <img
            src={myAvatarSidebar}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border shadow-sm"
          />
          <div className="mt-2 font-semibold text-gray-900">{myName}</div>
          <div className="text-gray-400 text-sm">{myUsername}</div>
        </div>

        <div className="px-5 py-3">
          <input
            className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Search messages"
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-400 text-sm">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = getRecipient(conv);
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-all
                    ${selectedConversation === conv.id
                      ? "bg-indigo-50"
                      : "hover:bg-gray-100"
                    }`}
                >
                  <div className="relative">
                    <img
                      src={
                        otherUser.avatarUrl || DEFAULT_AVATAR
                      }
                      alt={otherUser.fullName || otherUser.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {otherUser.fullName || otherUser.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {conv.lastMessageTimestamp
                          ? new Date(conv.lastMessageTimestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : ""}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-[180px]">
                      {conv.lastMessageContent || "Chưa có tin nhắn"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat box */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center gap-3 border-b px-6 py-4">
            <img
              src={
                recipient.avatarUrl || DEFAULT_AVATAR
              }
              alt={recipient.fullName || recipient.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-gray-900">
                {recipient.fullName || recipient.username}
              </div>
              <div className="text-xs text-gray-400">
                @{recipient.username}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3 custom-scrollbar bg-gray-50/50">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Chưa có tin nhắn nào
              </div>
            ) : (
              <>
                {messages
                  .slice() // tạo bản sao để không mutate state
                  .reverse() // đảo ngược để tin nhắn cũ ở trên, mới ở dưới
                  .map((msg, idx) =>
                    String(msg.sender?.id) === String(myUserId) ? (
                      <div key={idx} className="flex justify-end items-end gap-2">
                        <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl rounded-br-sm shadow-md max-w-[65%] text-sm leading-relaxed">
                          {msg.content}
                        </div>
                        <img
                          src={myAvatar}
                          alt="me"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      </div>
                    ) : (
                      <div key={idx} className="flex items-end gap-2">
                        <img
                          src={
                            msg.sender?.avatarUrl || DEFAULT_AVATAR
                          }
                          alt={msg.sender?.fullName || msg.sender?.username}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="bg-white border px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm max-w-[65%] text-sm text-gray-900 leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    )
                  )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-6 py-4 flex items-center gap-3 bg-white">
            <button className="text-gray-500 hover:text-indigo-600 text-xl transition">
              <i className="fa-regular fa-paperclip"></i>
            </button>
            <input
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12l16.5-7.5-7.5 16.5-2.25-7.5-6.75-1.5z"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
          Chọn một cuộc trò chuyện để bắt đầu nhắn tin
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;