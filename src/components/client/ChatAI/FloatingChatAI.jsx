import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  Trash2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import chatAIService from "../../../services/chatAIService";

const FloatingChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("translate"); // 'translate' or 'chat'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    chatAIService.clearHistory();
  };

  const detectLanguage = (text) => {
    // Simple detection based on character sets
    if (/[\u4e00-\u9fa5]/.test(text)) return "zh"; // Chinese
    if (/[a-zA-Z]/.test(text)) return "en"; // English
    return "auto";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsLoading(true);

    // Add user message
    const newMessage = {
      id: Date.now(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
      mode: mode, // Lưu mode hiện tại vào message
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      let response;
      let aiMessageContent;

      if (mode === "translate") {
        // Translation mode
        const sourceLang = detectLanguage(userMessage);
        response = await chatAIService.translate(userMessage, sourceLang);

        if (response.success) {
          const langNames = {
            en: "Tiếng Anh",
            zh: "Tiếng Trung",
            auto: "Tự động",
          };
          aiMessageContent = (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-purple-900">
                <Bot size={14} />→ Tiếng Việt
              </div>
              <div className="font-medium">{response.data.translatedText}</div>
            </div>
          );
        }
      } else {
        // Chat mode - Trả lời các câu hỏi thường ngày
        try {
          // Thử dùng conversation endpoint với lịch sử trước
          const history = chatAIService.getHistory();
          response = await chatAIService.sendConversation(userMessage, history);

          if (response.success) {
            // API conversation có thể trả về response hoặc reply
            aiMessageContent = response.data.response || response.data.reply;
            if (aiMessageContent) {
              chatAIService.addToHistory(userMessage, aiMessageContent);
            }
          }
        } catch {
          console.log("Conversation API failed, trying simple chat...");

          // Nếu conversation API lỗi, thử dùng simple message endpoint
          try {
            const detectedLang = detectLanguage(userMessage);
            response = await chatAIService.sendMessage(
              userMessage,
              detectedLang
            );

            if (response.success) {
              // API message trả về reply
              aiMessageContent = response.data.reply || response.data.response;
              if (aiMessageContent) {
                chatAIService.addToHistory(userMessage, aiMessageContent);
              }
            }
          } catch (messageError) {
            console.error("Both chat methods failed:", messageError);
            throw messageError;
          }
        }
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          aiMessageContent ||
          "Xin lỗi, tôi không thể trả lời câu hỏi của bạn lúc này. Vui lòng thử lại sau.",
        timestamp: new Date(),
        mode: mode, // Lưu mode hiện tại vào AI response
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "error",
        content: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    const isUser = message.type === "user";
    const isError = message.type === "error";

    // Xác định màu dựa trên mode của message đó (không phải mode hiện tại)
    const messageMode = message.mode || "translate"; // Fallback to translate nếu không có mode
    const userBgColor =
      messageMode === "translate" ? "bg-purple-900" : "bg-orange-500";
    const userTextColor =
      messageMode === "translate" ? "text-purple-100" : "text-orange-100";

    return (
      <div
        key={message.id}
        className={`flex ${
          isUser ? "justify-end" : "justify-start"
        } mb-3 animate-fade-in`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
            isUser
              ? `${userBgColor} text-white rounded-br-sm`
              : isError
              ? "bg-red-50 text-red-600 border border-red-200 rounded-bl-sm"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          <div className="text-sm break-words">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              isUser ? userTextColor : "text-gray-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed bottom-6 right-6 z-50 bg-purple-900 text-white rounded-full p-4 shadow-2xl hover:shadow-purple-800/50 hover:scale-110 transition-all duration-300 group"
          aria-label="Open AI Chat"
        >
          <Bot
            size={28}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
          } flex flex-col`}
          style={{ maxHeight: "calc(100vh - 3rem)" }}
        >
          {/* Header */}
          <div className="bg-purple-900 text-white rounded-t-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot size={24} />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">GS Assistant</h3>
                <p className="text-xs text-purple-200">
                  Dịch thuật & Trò chuyện
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMinimize}
                className="hover:bg-purple-800/50 rounded-lg p-1.5 transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 size={18} />
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-purple-800/50 rounded-lg p-1.5 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode Selector */}
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode("translate")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      mode === "translate"
                        ? "bg-purple-900 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Bot size={16} />
                    Dịch văn bản
                  </button>
                  <button
                    onClick={() => setMode("chat")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      mode === "chat"
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Sparkles size={16} />
                    Trò chuyện
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {mode === "translate"
                    ? "Dịch từ Tiếng Anh/Trung → Tiếng Việt"
                    : "Hỏi đáp mọi thứ - Thời tiết, tin tức, kiến thức..."}
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-white">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-400 space-y-3">
                      {mode === "translate" ? (
                        <Bot
                          size={48}
                          className="mx-auto opacity-50 text-purple-400"
                        />
                      ) : (
                        <Sparkles
                          size={48}
                          className="mx-auto opacity-50 text-orange-400"
                        />
                      )}
                      <p className="text-sm font-medium">
                        {mode === "translate"
                          ? "Gửi văn bản để dịch sang Tiếng Việt"
                          : "Hỏi tôi bất cứ điều gì!"}
                      </p>
                      <p className="text-xs">
                        {mode === "translate"
                          ? "Hỗ trợ Tiếng Anh & Tiếng Trung"
                          : "Thời tiết, tin tức, kiến thức chung..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map(renderMessage)}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        mode === "translate"
                          ? "Nhập văn bản cần dịch..."
                          : "Hỏi về thời tiết, tin tức, kiến thức..."
                      }
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-transparent resize-none text-sm"
                      rows="2"
                      disabled={isLoading}
                    />
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa hội thoại"
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className={`${
                      mode === "translate"
                        ? "bg-purple-900 hover:bg-purple-800"
                        : "bg-orange-500 hover:bg-orange-600"
                    } text-white rounded-xl p-3 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95`}
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Nhấn Enter để gửi, Shift + Enter để xuống dòng
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default FloatingChatAI;
