const BaseRepository = require('./BaseRepository');
const { Meetinghistory, Meetingroom } = require('../models');
const { Op } = require('sequelize');

class MeetingHistoryRepository extends BaseRepository {
  constructor() {
    super(Meetinghistory);
  }

  async findCompletedAndCancelledMeetings() {
    try {
      return await this.model.findAll({
        include: [
          {
            model: Meetingroom,
            as: 'room',
            where: {
              status: { [Op.in]: ['completed', 'canceled'] }
            },
            required: true
          }
        ],
        order: [['id', 'DESC']]
      });
    } catch (error) {
      console.error('Error in findCompletedAndCancelledMeetings:', error);
      throw error;
    }
  }

  async findHistoryByRoomId(roomId) {
    return await this.model.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: Meetingroom,
          as: 'room'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async createFromMeetingRoom(meetingRoom) {
    return await this.create({
      room_id: meetingRoom.id,
      room_name: meetingRoom.room_name,
      mentor_id: meetingRoom.mentor_id,
      user_id: meetingRoom.user_id,
      start_time: meetingRoom.start_time,
      end_time: meetingRoom.end_time,
      actual_start_time: meetingRoom.actual_start_time,
      status: meetingRoom.status
    });
  }

  async getStatistics() {
    try {
      const completed = await this.model.count({
        include: [
          {
            model: Meetingroom,
            as: 'room',
            where: { status: 'completed' },
            required: true
          }
        ]
      });

      const canceled = await this.model.count({
        include: [
          {
            model: Meetingroom,
            as: 'room',
            where: { status: 'canceled' },
            required: true
          }
        ]
      });

      return { completed, canceled, total: completed + canceled };
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw error;
    }
  }
}

module.exports = MeetingHistoryRepository;