import axiosClient from "../apis/axiosClient";

// Gửi tin nhắn mới
export const sendMessage = async ({ recipientId, conversationId, content }) => {
    const response = await axiosClient.post("/chat/message", {
        recipientId,
        conversationId,
        content,
    });
    return response?.data;
};

export const fetchMessagesByConversation = async ({ conversationId, page = 0, size = 10 }) => {
    const response = await axiosClient.get(`/chat/messages/conversation/${conversationId}`, {
        params: { page, size }
    });
    return response?.data;
};

export const fetchConversations = async ({ page = 0, size = 10 } = {}) => {
    const response = await axiosClient.get("/chat/conversations", {
        params: { page, size }
    });
    return response?.data;
};

export const deleteConversation = async (conversationId) => {
    const response = await axiosClient.delete(`/chat/conversation/${conversationId}`);
    return response?.data;
};