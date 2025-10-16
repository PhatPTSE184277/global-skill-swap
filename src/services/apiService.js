import apiRoom from '../apis/axiosRoom.js';
import userRoomService from './userRoomService.js';

class ApiService {
  constructor() {
    this.api = apiRoom;
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
    return response.data?.data?.room ;
  }

   async getIdbyLink(roomLink) {
    const response = await this.api.get(`/meeting-rooms/by-link?meeting_link=${roomLink}`);
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
    return response?.data || [];
  }

  async refreshAgoraTokens(roomId, uid) {
    const response = await this.api.post('/agora/tokens/refresh', { roomId, uid });
    return response.data;
  }

  // Get user information from meeting room
  async getUsernameFromMeetingRoom(roomId) {
    try {
      // Lấy thông tin meeting room
      const roomResponse = await this.getMeetingRoom(roomId);
      const roomData = roomResponse ;
      
      if (!roomData || !roomData?.user_id) {
        throw new Error('Meeting room not found or missing user_id');
      }
  // Lấy thông tin user từ user_id
  const userResponse = await userRoomService.getUserById(roomData?.user_id);
      
      return userResponse?.username;
    } catch (error) {
     console.error('Error getting username from meeting room:', error);
      return 'Mentor GSS'; // Fallback name
    }
  }

}

const apiService = new ApiService();  
export default apiService;