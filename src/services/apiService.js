// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Meeting Room API methods
  async createMeetingRoom(roomData) {
    return this.request('/meetingrooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async getMeetingRooms() {
    return this.request('/meetingrooms');
  }

  async getMeetingRoom(roomId) {
    return this.request(`/meetingrooms/${roomId}`);
  }

  async updateMeetingRoom(roomId, roomData) {
    return this.request(`/meetingrooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async deleteMeetingRoom(roomId) {
    return this.request(`/meetingrooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  // Agora Integration API methods
  async joinRoom(roomId, userData) {
    return this.request(`/meetingrooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async leaveRoom(roomId, userData) {
    return this.request(`/meetingrooms/${roomId}/leave`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getRoomParticipants(roomId) {
    return this.request(`/meetingrooms/${roomId}/participants`);
  }

  async generateAgoraTokens(roomId, tokenData) {
    return this.request(`/meetingrooms/${roomId}/tokens`, {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }
}

const apiService = new ApiService();
export default apiService;