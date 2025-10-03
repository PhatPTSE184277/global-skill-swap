const MeetingHistoryService = require('../services/MeetingHistoryService');

class MeetingHistoryController {
  constructor() {
    this.meetingHistoryService = new MeetingHistoryService();
  }

  // @desc    Get completed and cancelled meeting history
  // @route   GET /api/meeting-history
  // @access  Public
  getCompletedAndCancelledHistory = async (req, res, next) => {
    try {
      const result = await this.meetingHistoryService.getCompletedAndCancelledHistory();

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getCompletedAndCancelledHistory controller:', error);
      next(error);
    }
  };

  // @desc    Get history by room ID
  // @route   GET /api/meeting-history/room/:roomId
  // @access  Public
  getHistoryByRoomId = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      
      const result = await this.meetingHistoryService.getHistoryByRoomId(roomId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getHistoryByRoomId controller:', error);
      next(error);
    }
  };

  // @desc    Get meeting history statistics
  // @route   GET /api/meeting-history/statistics
  // @access  Public
  getHistoryStatistics = async (req, res, next) => {
    try {
      const stats = await this.meetingHistoryService.getHistoryStatistics();

      res.json({
        success: true,
        data: { statistics: stats }
      });
    } catch (error) {
      console.error('Error in getHistoryStatistics controller:', error);
      next(error);
    }
  };
}

module.exports = MeetingHistoryController;