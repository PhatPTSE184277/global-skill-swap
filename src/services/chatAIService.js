import axios from 'axios';

const ROOM_SERVICE_URL = import.meta.env.VITE_ROOM_SERVICE_URL;

class ChatAIService {
  constructor() {
    this.baseURL = `${ROOM_SERVICE_URL}/api/chat`;
    this.conversationHistory = [];
  }

  /**
   * Dịch văn bản từ tiếng Anh hoặc Trung sang tiếng Việt
   * @param {string} text - Văn bản cần dịch
   * @param {string} sourceLang - Ngôn ngữ nguồn ('en', 'zh', 'auto')
   * @returns {Promise} - Kết quả dịch
   */
  async translate(text, sourceLang = 'auto') {
    try {
      const response = await axios.post(`${this.baseURL}/translate`, {
        text,
        sourceLang
      });
      return response.data;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi dịch văn bản');
    }
  }

  /**
   * Chat với AI
   * @param {string} message - Tin nhắn người dùng
   * @param {string} language - Ngôn ngữ ('en', 'zh', 'vi')
   * @returns {Promise} - Phản hồi từ AI
   */
  async sendMessage(message, language = 'en') {
    try {
      const response = await axios.post(`${this.baseURL}/message`, {
        message,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
  }

  /**
   * Chat với lịch sử hội thoại
   * @param {string} message - Tin nhắn người dùng
   * @param {Array} history - Lịch sử hội thoại
   * @returns {Promise} - Phản hồi từ AI
   */
  async sendConversation(message, history = []) {
    try {
      const response = await axios.post(`${this.baseURL}/conversation`, {
        message,
        history: history.slice(-10) // Giới hạn 10 tin nhắn gần nhất
      });
      return response.data;
    } catch (error) {
      console.error('Conversation error:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi gửi tin nhắn');
    }
  }

  /**
   * Phát hiện ngôn ngữ
   * @param {string} text - Văn bản cần phát hiện
   * @returns {Promise} - Ngôn ngữ được phát hiện
   */
  async detectLanguage(text) {
    try {
      const response = await axios.post(`${this.baseURL}/detect-language`, {
        text
      });
      return response.data;
    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(error.response?.data?.message || 'Lỗi khi phát hiện ngôn ngữ');
    }
  }

  /**
   * Kiểm tra health của API
   * @returns {Promise} - Trạng thái API
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'error' };
    }
  }

  /**
   * Thêm tin nhắn vào lịch sử hội thoại
   */
  addToHistory(userMessage, aiResponse) {
    this.conversationHistory.push({
      userMessage,
      aiResponse,
      timestamp: new Date().toISOString()
    });
    // Giới hạn 20 tin nhắn
    if (this.conversationHistory.length > 20) {
      this.conversationHistory.shift();
    }
  }

  /**
   * Lấy lịch sử hội thoại
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Xóa lịch sử hội thoại
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new ChatAIService();
