// Utility functions for the meeting system
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateUID = () => {
  return Math.floor(Math.random() * 100000) + Date.now();
};

export const formatTime = (date) => {
  return new Date(date).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end - start;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const validateRoomData = (data) => {
  const errors = {};
  
  if (!data.room_name || data.room_name.trim().length < 3) {
    errors.room_name = 'Tên phòng phải có ít nhất 3 ký tự';
  }
  
  if (!data.mentor_id || data.mentor_id < 1) {
    errors.mentor_id = 'Mentor ID không hợp lệ';
  }
  
  if (!data.user_id || data.user_id < 1) {
    errors.user_id = 'User ID không hợp lệ';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};