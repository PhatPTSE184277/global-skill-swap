const MeetingHistoryRepository = require('../repositories/MeetingHistoryRepository');

class MeetingHistoryService {
  constructor() {
    this.meetingHistoryRepo = new MeetingHistoryRepository();
  }

  async getCompletedAndCancelledHistory() {
    try {
      const history = await this.meetingHistoryRepo.findCompletedAndCancelledMeetings();
      return {
        history: history,
        total: history.length
      };
    } catch (error) {
      console.error('Error in getCompletedAndCancelledHistory service:', error);
      throw error;
    }
  }

  async getHistoryByRoomId(roomId) {
    try {
      const history = await this.meetingHistoryRepo.findHistoryByRoomId(roomId);
      return {
        history: history,
        total: history.length
      };
    } catch (error) {
      console.error('Error in getHistoryByRoomId service:', error);
      throw error;
    }
  }

  async getHistoryStatistics() {
    try {
      const stats = await this.meetingHistoryRepo.getStatistics();
      return stats;
    } catch (error) {
      console.error('Error in getHistoryStatistics service:', error);
      throw error;
    }
  }

  async createHistoryRecord(meetingRoom) {
    return await this.meetingHistoryRepo.createFromMeetingRoom(meetingRoom);
  }
}

module.exports = MeetingHistoryService;