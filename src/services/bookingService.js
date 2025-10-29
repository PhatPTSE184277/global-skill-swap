import axiosClient from '../apis/axiosClient';

const bookingService = {
  // Lấy tất cả booking của current user
  getCurrentUserBookings: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'desc',
        bookingStatus = 'PENDING'
      } = params;

      const response = await axiosClient.get('/booking/all/current-user', {
        params: {
          page,
          size,
          sortBy,
          sortDir,
          bookingStatus
        }
      });
      return response?.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Lấy booking theo ID
  getBookingById: async (bookingId) => {
    try {
      const response = await axiosClient.get(`/booking/${bookingId}`);
      return response?.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Tạo booking mới
  createBooking: async (bookingData) => {
    try {
      const response = await axiosClient.post('/booking', bookingData);
      return response?.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Cập nhật booking
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await axiosClient.put(`/booking/${bookingId}`, bookingData);
      return response?.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Hủy booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await axiosClient.delete(`/booking/${bookingId}`);
      return response?.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Lấy tất cả timeslot của current user (mentor)
  getCurrentUserTimeslots: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'desc'
      } = params;

      const response = await axiosClient.get('/timeslot/all/current-user', {
        params: {
          page,
          size,
          sortBy,
          sortDir
        }
      });
      return response?.data;
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      throw error;
    }
  },

  // Tạo timeslot mới (mentor)
  createTimeslot: async (timeslotData) => {
    try {
      const response = await axiosClient.post('/timeslot', timeslotData);
      return response?.data;
    } catch (error) {
      console.error('Error creating timeslot:', error);
      throw error;
    }
  },

  // Lấy calendar của một user cụ thể theo accountId
  getCalendarByAccountId: async (accountId, params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'id',
        sortDir = 'desc'
      } = params;

      const response = await axiosClient.get(`/calendar/all/${accountId}`, {
        params: {
          page,
          size,
          sortBy,
          sortDir
        }
      });
      return response?.data;
    } catch (error) {
      console.error('Error fetching calendar by account ID:', error);
      throw error;
    }
  }
};

export default bookingService;
