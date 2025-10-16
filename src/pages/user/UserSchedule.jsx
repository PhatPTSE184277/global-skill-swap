import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";

const UserSchedule = ({ userId }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);

  // Tạo thời khóa biểu theo tuần
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Lấy ngày của tuần dựa trên currentWeek
  const getCurrentWeekDates = () => {
    const referenceDate = new Date(currentWeek);
    const currentDay = referenceDate.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Tính offset để về thứ 2

    const monday = new Date(referenceDate);
    monday.setDate(referenceDate.getDate() + mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  // Functions để chuyển tuần
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const weekDates = getCurrentWeekDates();
  const weekDays = [
    { key: "monday", label: "Thứ 2", date: weekDates[0] },
    { key: "tuesday", label: "Thứ 3", date: weekDates[1] },
    { key: "wednesday", label: "Thứ 4", date: weekDates[2] },
    { key: "thursday", label: "Thứ 5", date: weekDates[3] },
    { key: "friday", label: "Thứ 6", date: weekDates[4] },
    { key: "saturday", label: "Thứ 7", date: weekDates[5] },
    { key: "sunday", label: "Chủ nhật", date: weekDates[6] },
  ];

  useEffect(() => {
    // Mock data theo thời khóa biểu
    const mockSchedule = {
      // Dữ liệu theo format: day_hour
      monday_14: {
        id: 1,
        mentorName: "Liam Harper",
        subject: "Tiếng Anh Giao Tiếp",
        status: "confirmed",
        room: "A1",
      },
      wednesday_10: {
        id: 2,
        mentorName: "Emma Wilson",
        subject: "Business English",
        status: "confirmed",
        room: "B2",
      },
      friday_16: {
        id: 3,
        mentorName: "James Chen",
        subject: "IELTS Preparation",
        status: "pending",
        room: "C3",
      },
      tuesday_09: {
        id: 4,
        mentorName: "Sarah Johnson",
        subject: "Grammar Basics",
        status: "confirmed",
        room: "D1",
      },
      thursday_15: {
        id: 5,
        mentorName: "David Lee",
        subject: "Conversation Skills",
        status: "confirmed",
        room: "E2",
      },
    };

    setTimeout(() => {
      setScheduleData(mockSchedule);
    }, 300);
  }, [userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 border-green-300 text-green-800";
      case "pending":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "completed":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  if (!scheduleData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Đang tải thời khóa biểu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-orange-700" />
          <h3 className="text-xl font-bold text-purple-950">Thời khóa biểu</h3>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Tuần trước"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <div className="text-sm font-medium text-gray-800">
                {weekDates[0].getDate()}/{weekDates[0].getMonth() + 1} -{" "}
                {weekDates[6].getDate()}/{weekDates[6].getMonth() + 1}/
                {weekDates[6].getFullYear()}
              </div>
              <button
                onClick={goToCurrentWeek}
                className="text-xs text-orange-700 hover:text-orange-800 hover:underline"
              >
                Hôm nay
              </button>
            </div>

            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Tuần sau"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Header với các ngày trong tuần */}
        <div className="grid grid-cols-8 bg-gray-50">
          <div className="p-3 text-center font-semibold text-gray-700 border-r border-gray-200">
            Giờ
          </div>
          {weekDays.map((day) => (
            <div
              key={day.key}
              className="p-2 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
            >
              <div className="text-sm">{day.label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {day.date.getDate()}/{day.date.getMonth() + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Lưới thời gian */}
        {timeSlots.map((time, timeIndex) => (
          <div
            key={time}
            className={`grid grid-cols-8 border-b border-gray-100 ${
              timeIndex === timeSlots.length - 1 ? "border-b-0" : ""
            }`}
          >
            {/* Cột thời gian */}
            <div className="p-3 text-center font-medium text-gray-600 bg-gray-50 border-r border-gray-200">
              {time}
            </div>

            {/* Các ô lịch học */}
            {weekDays.map((day) => {
              const classKey = `${day.key}_${time.split(":")[0]}`;
              const classData = scheduleData[classKey];

              return (
                <div
                  key={`${day.key}_${time}`}
                  className="p-2 border-r border-gray-100 h-16 last:border-r-0"
                >
                  {classData ? (
                    <div
                      className={`h-full rounded-md border p-2 ${getStatusColor(
                        classData.status
                      )}`}
                    >
                      <div className="text-xs font-semibold truncate mb-1">
                        {classData.subject}
                      </div>
                      <div className="text-xs truncate">
                        {classData.mentorName}
                      </div>
                      <div className="text-xs truncate">{classData.room}</div>
                    </div>
                  ) : (
                    <div className="h-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Đã xác nhận</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span className="text-gray-600">Chờ xác nhận</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
          <span className="text-gray-600">Hoàn thành</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">
            {
              Object.keys(scheduleData).filter(
                (key) => scheduleData[key].status === "confirmed"
              ).length
            }
          </div>
          <div className="text-sm text-orange-600">Buổi học tuần này</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">
            {
              Object.keys(scheduleData).filter(
                (key) => scheduleData[key].status === "pending"
              ).length
            }
          </div>
          <div className="text-sm text-purple-600">Chờ xác nhận</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">
            {Object.keys(scheduleData).length}
          </div>
          <div className="text-sm text-gray-600">Tổng lịch học</div>
        </div>
      </div>
    </div>
  );
};

export default UserSchedule;
