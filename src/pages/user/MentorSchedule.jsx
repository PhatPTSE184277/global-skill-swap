import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm dòng này

const MentorSchedule = ({ userId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate(); // Thêm dòng này

  useEffect(() => {
    // Fetch schedule data based on userId
    if (userId) {
      try {
        // TODO: Implement API call to get schedule by user ID
        // const response = await scheduleApi.getScheduleByUserId(userId);
        console.log("Fetching schedule for user ID:", userId);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    }
  }, [userId]);

  // Fake data: khung giờ theo ngày (demo)
  const timeSlotsByDate = {
    "2025-07-05": [
      { id: 1, label: "Khung giờ 1", time: "9:00 AM - 10:00 AM" },
      { id: 2, label: "Khung giờ 2", time: "10:00 AM - 11:00 AM" },
    ],
    "2025-07-06": [
      { id: 3, label: "Khung giờ 3", time: "11:00 AM - 12:00 PM" },
      { id: 4, label: "Khung giờ 4", time: "1:00 PM - 2:00 PM" },
      { id: 5, label: "Khung giờ 5", time: "2:00 PM - 3:00 PM" },
    ],
  };

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  // Lấy danh sách khung giờ theo ngày
  const getSlotsForDate = (date) => {
    const key = formatDateKey(date);
    return timeSlotsByDate[key] || [];
  };

  // Render ngày trong tháng
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  // Đổi tháng
  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    );
  };

  // Quay lại hôm nay
  const goToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const isSameDay = (d1, d2) =>
    d1 &&
    d2 &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  return (
    <div className="flex justify-between p-8 bg-white -screen text-gray-800">
      {/* Calendar */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Lịch trình</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="flex justify-between items-center mb-4 text-sm">
            <button
              className="px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            <span className="font-medium">
              Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
            </span>
            <button
              className="px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => changeMonth(1)}
            >
              &gt;
            </button>
          </div>
          <button
            className="mb-4 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-orange-500 hover:text-white transition"
            onClick={goToday}
          >
            Hôm nay
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 text-center text-sm gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="font-medium text-gray-500">
              {d}
            </div>
          ))}
          {days.map((day, i) =>
            day ? (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition
                  ${
                    isSameDay(day, selectedDate)
                      ? "bg-purple-950 text-white"
                      : "hover:bg-gray-100"
                  }
                `}
              >
                {day.getDate()}
              </button>
            ) : (
              <div key={i}></div>
            )
          )}
        </div>
      </div>

      {/* Time slots */}
      <div className="w-3/5 pl-15 border-l border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Các khung giờ học</h2>
        <div className="space-y-4">
          {getSlotsForDate(selectedDate).length > 0 ? (
            getSlotsForDate(selectedDate).map((slot) => (
              <div key={slot.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{slot.label}</p>
                  <p className="text-sm text-gray-500">{slot.time}</p>
                </div>
                <button
                  className="px-4 py-1 bg-gray-100 rounded-lg hover:bg-purple-950 hover:text-white transition"
                  onClick={() => navigate("/paymentconfirmation")} // Sửa dòng này
                >
                  Đặt
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có khung giờ cho ngày này</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSchedule;
