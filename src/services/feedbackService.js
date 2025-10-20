import axios from 'axios';

// Use the same ROOM service URL as chatAIService (fallback to localhost)
const ROOM_SERVICE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_ROOM_SERVICE_URL || 'https://gss-room-service.onrender.com'
  : import.meta.env.VITE_ROOM_SERVICE_URL || 'http://localhost:3000';

const BASE_URL = `${ROOM_SERVICE_URL}/api/feedbacks`;

console.log('🔍 feedbackService - PROD mode:', import.meta.env.PROD);
console.log('🔍 feedbackService - ROOM_SERVICE_URL:', ROOM_SERVICE_URL);
console.log('🔍 feedbackService - BASE_URL:', BASE_URL);

// Create axios instance
const feedbackClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const feedbackService = {
  /**
   * Create a new feedback
   * @param {Object} feedbackData - { module_type, module_id, user_id, rating, comment }
   * @returns {Promise}
   */
  createFeedback: async (feedbackData) => {
    try {
      const response = await feedbackClient.post('/', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all feedbacks with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @returns {Promise}
   */
  getAllFeedbacks: async (page = 1, limit = 20) => {
    try {
      const response = await feedbackClient.get('/', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get feedbacks by module type
   * @param {string} moduleType - Module type (meeting_room, mentor, user, course, system, chatbot, other)
   * @param {string} moduleId - Optional module ID
   * @returns {Promise}
   */
  getFeedbacksByModule: async (moduleType, moduleId = null) => {
    try {
      const response = await feedbackClient.get(`/module/${moduleType}`, {
        params: moduleId ? { module_id: moduleId } : {},
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get feedback by ID
   * @param {number} id - Feedback ID
   * @returns {Promise}
   */
  getFeedbackById: async (id) => {
    try {
      const response = await feedbackClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get feedbacks by user ID
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise}
   */
  getFeedbacksByUser: async (userId, page = 1, limit = 20) => {
    try {
      const response = await feedbackClient.get(`/user/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get feedback statistics
   * @param {string} moduleType - Optional module type filter
   * @param {string} moduleId - Optional module ID filter
   * @returns {Promise}
   */
  getStatistics: async (moduleType = null, moduleId = null) => {
    try {
      const params = {};
      if (moduleType) params.module_type = moduleType;
      if (moduleId) params.module_id = moduleId;

      const response = await feedbackClient.get('/statistics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get rating distribution
   * @param {string} moduleType - Optional module type filter
   * @param {string} moduleId - Optional module ID filter
   * @returns {Promise}
   */
  getRatingDistribution: async (moduleType = null, moduleId = null) => {
    try {
      const params = {};
      if (moduleType) params.module_type = moduleType;
      if (moduleId) params.module_id = moduleId;

      const response = await feedbackClient.get('/rating-distribution', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Admin respond to feedback
   * @param {number} id - Feedback ID
   * @param {Object} responseData - { admin_response, admin_id }
   * @returns {Promise}
   */
  respondToFeedback: async (id, responseData) => {
    try {
      const response = await feedbackClient.put(`/${id}/respond`, responseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update feedback
   * @param {number} id - Feedback ID
   * @param {Object} updateData - { rating, comment, status }
   * @returns {Promise}
   */
  updateFeedback: async (id, updateData) => {
    try {
      const response = await feedbackClient.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete feedback
   * @param {number} id - Feedback ID
   * @returns {Promise}
   */
  deleteFeedback: async (id) => {
    try {
      const response = await feedbackClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check if user has submitted feedback for a module
   * @param {string} userId - User ID
   * @param {string} moduleType - Module type
   * @param {string} moduleId - Module ID
   * @returns {Promise<boolean>}
   */
  checkUserFeedback: async (userId, moduleType, moduleId = null) => {
    try {
      const response = await feedbackService.getFeedbacksByUser(userId, 1, 100);
      if (response.success) {
        const feedbacks = response.data.feedbacks;
        return feedbacks.some(
          (fb) => 
            fb.module_type === moduleType && 
            (!moduleId || fb.module_id === moduleId)
        );
      }
      return false;
    } catch (error) {
      console.error('Error checking user feedback:', error);
      return false;
    }
  },
};

export default feedbackService;
