import { createContext, useState, useCallback } from "react";
import {
  fetchConversations,
  fetchMessagesByConversation,
  sendMessage,
  deleteConversation,
} from "../services/messageService";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách cuộc trò chuyện
  const getConversations = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await fetchConversations(params);
      setConversations(res?.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy tin nhắn theo conversationId
  const getMessages = useCallback(async ({ conversationId, page = 0, size = 50 }) => {
    setLoading(true);
    try {
      const res = await fetchMessagesByConversation({ conversationId, page, size });
      setMessages(res?.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gửi tin nhắn mới
  const sendNewMessage = useCallback(async ({ recipientId, conversationId, content }) => {
    setLoading(true);
    try {
      const res = await sendMessage({ recipientId, conversationId, content });
      // Sau khi gửi, reload lại messages
      if (conversationId) {
        await getMessages({ conversationId });
      }
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMessages]);

  // Xóa cuộc trò chuyện
  const removeConversation = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      await deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation]);

  const value = {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    loading,
    getConversations,
    getMessages,
    sendNewMessage,
    removeConversation,
    setMessages,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;