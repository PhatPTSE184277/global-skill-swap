import axiosRoom from '../apis/axiosRoom.js';

class ApiService {
  constructor() {
    this.api = axiosRoom;
  }

  // Meeting Room API methods
  async createMeetingRoom(roomData) {
    const response = await this.api.post('/meeting-rooms', roomData);
    return response.data;
  }

  async getMeetingRooms() {
    const response = await this.api.get('/meeting-rooms');
    return response.data?.data?.rooms|| [];
  }

  async getMeetingRoom(roomId) {
    const response = await this.api.get(`/meeting-rooms/${roomId}`);
    return response.data?.data?.rooms || response.data;
  }

  async updateMeetingRoom(roomId, roomData) {
    const response = await this.api.put(`/meeting-rooms/${roomId}`, roomData);
    return response.data;
  }

  async updateMeetingRoomStatus(roomId, status) {
    const response = await this.api.patch(`/meeting-rooms/${roomId}/status`, { status });
    return response.data;
  }

  async deleteMeetingRoom(roomId) {
    const response = await this.api.delete(`/meeting-rooms/${roomId}`);
    return response.data;
  }

  // Agora Integration API methods
  async generateAgoraTokens(roomId, userData) {
    const response = await this.api.post('/agora/tokens', {
      roomId,
      ...userData
    });
    return response.data;
  }

  async joinRoom(roomId, userData) {
    const response = await this.api.post(`/agora/rooms/${roomId}/join`, userData);
    return response.data;
  }

  async leaveRoom(roomId, userData) {
    const response = await this.api.post(`/agora/rooms/${roomId}/leave`, userData);
    return response.data;
  }

  async getRoomParticipants(roomId) {
    const response = await this.api.get(`/agora/rooms/${roomId}/participants`);
    return response.data?.participants || [];
  }

  async refreshAgoraTokens(roomId, uid) {
    const response = await this.api.post('/agora/tokens/refresh', { roomId, uid });
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;