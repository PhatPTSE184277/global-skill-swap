// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Meeting Room API methods
  async createMeetingRoom(roomData) {
    return this.request('/meeting-rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async getMeetingRooms() {
    const response = await this.request('/meeting-rooms');
    return response.data?.rooms || response.data || [];
  }

  async getMeetingRoom(roomId) {
    const response = await this.request(`/meeting-rooms/${roomId}`);
    return response.data?.room || response.data;
  }

  async updateMeetingRoom(roomId, roomData) {
    return this.request(`/meeting-rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async updateMeetingRoomStatus(roomId, status) {
    return this.request(`/meeting-rooms/${roomId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteMeetingRoom(roomId) {
    return this.request(`/meeting-rooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  // Agora Integration API methods
  async generateAgoraTokens(roomId, userData) {
    return this.request('/agora/tokens', {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        ...userData
      }),
    });
  }

  async joinRoom(roomId, userData) {
    return this.request(`/agora/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async leaveRoom(roomId, userData) {
    return this.request(`/agora/rooms/${roomId}/leave`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getRoomParticipants(roomId) {
    const response = await this.request(`/agora/rooms/${roomId}/participants`);
    return response.data?.participants || [];
  }

  async refreshAgoraTokens(roomId, uid) {
    return this.request('/agora/tokens/refresh', {
      method: 'POST',
      body: JSON.stringify({ roomId, uid }),
    });
  }
}

const apiService = new ApiService();
export default apiService;