import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
} from "lucide-react";
import bookingService from "../../services/bookingService";
import { message, Modal, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

const CalendarSchedule = ({
  userId,
  userType = "student",
  isOwner = false,
}) => {
  // userType: "student" hoặc "mentor"
  // isOwner: true nếu đang xem profile của chính mình, false nếu xem người khác
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [mentorBookings, setMentorBookings] = useState([]); // Bookings cho mentor (hiển thị người đăng ký)
  const [timeslots, setTimeslots] = useState([]); // Timeslots cho mentor
  const [view, setView] = useState("month"); // month, week, day
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("PENDING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [mentorTab, setMentorTab] = useState("upcoming"); // upcoming hoặc created

  // States for create timeslot modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newTimeslot, setNewTimeslot] = useState({
    slotDate: null,
    startTime: null,
    endTime: null,
    linkUrlRoom: "",
  });

  // States for booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch bookings from API for User
  useEffect(() => {
    const fetchBookings = async () => {
      // Chỉ fetch cho student role HOẶC khi đang xem profile của chính mình
      if (userType !== "student" || !isOwner) {
        return;
      }

      try {
        setLoading(true);

        const response = await bookingService.getCurrentUserBookings({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
          bookingStatus: bookingStatus, // Luôn có giá trị (PENDING, CONFIRMED, COMPLETED, CANCELLED)
        });

        if (response?.success && response?.data?.content) {
          // Transform API data to calendar events format
          const bookings = response.data.content;
          const transformedEvents = bookings.map((booking) => {
            // Parse date and time from timeslotResponse
            const timeslot = booking.timeslotResponse;
            // Fix timezone issue: parse as local date YYYY-MM-DD
            const [year, month, day] = timeslot.slotDate.split("-").map(Number);
            const bookingDate = new Date(year, month - 1, day); // month is 0-indexed
            const timeRange = `${timeslot.startTime.slice(
              0,
              5
            )} - ${timeslot.endTime.slice(0, 5)}`;

            // Determine color based on status
            let color = "orange"; // default PENDING
            if (booking.bookingStatus === "CONFIRMED") color = "blue";
            if (booking.bookingStatus === "CANCELLED") color = "red";
            if (booking.bookingStatus === "COMPLETED") color = "green";

            // Determine tags
            const tags = [];
            if (booking.bookingStatus === "PENDING") tags.push("Chờ xác nhận");
            if (booking.bookingStatus === "CONFIRMED") tags.push("Đã xác nhận");
            if (booking.bookingStatus === "CANCELLED") tags.push("Đã hủy");
            if (booking.bookingStatus === "COMPLETED") tags.push("Hoàn thành");

            return {
              id: booking.id,
              title: `Buổi học với ${booking.mentorId.username}`,
              date: bookingDate,
              time: timeRange,
              mentor: booking.mentorId.fullName,
              mentorAvatar: booking.mentorId.avatarUrl,
              mentorUsername: booking.mentorId.username,
              type: "class",
              tags: tags,
              color: color,
              linkUrlRoom: timeslot.linkUrlRoom,
              slotStatus: timeslot.slotStatus,
              bookingData: booking, // Keep original data for reference
            };
          });

          setEvents(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("Không thể tải danh sách lịch học");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId, userType, bookingStatus, isOwner]);

  // Fetch bookings from API for Mentor (hiển thị người đăng ký)
  useEffect(() => {
    const fetchMentorBookings = async () => {
      // Chỉ fetch cho mentor role và khi đang xem profile của chính mình
      if (userType !== "mentor" || !isOwner) {
        return;
      }

      try {
        setLoading(true);

        const response = await bookingService.getCurrentUserBookings({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
          bookingStatus: bookingStatus,
        });

        if (response?.success && response?.data?.content) {
          // Transform API data to calendar events format
          const bookings = response.data.content;
          const transformedEvents = bookings.map((booking) => {
            // Parse date and time from timeslotResponse
            const timeslot = booking.timeslotResponse;
            // Fix timezone issue: parse as local date YYYY-MM-DD
            const [year, month, day] = timeslot.slotDate.split("-").map(Number);
            const bookingDate = new Date(year, month - 1, day); // month is 0-indexed
            const timeRange = `${timeslot.startTime.slice(
              0,
              5
            )} - ${timeslot.endTime.slice(0, 5)}`;

            // Determine color based on status
            let color = "orange"; // default PENDING
            if (booking.bookingStatus === "CONFIRMED") color = "blue";
            if (booking.bookingStatus === "CANCELLED") color = "red";
            if (booking.bookingStatus === "COMPLETED") color = "green";

            // Determine tags
            const tags = [];
            if (booking.bookingStatus === "PENDING") tags.push("Chờ xác nhận");
            if (booking.bookingStatus === "CONFIRMED") tags.push("Đã xác nhận");
            if (booking.bookingStatus === "CANCELLED") tags.push("Đã hủy");
            if (booking.bookingStatus === "COMPLETED") tags.push("Hoàn thành");

            // Get student info (could be studentId or userId depending on API response)
            const studentInfo = booking.studentId || booking.userId || {};
            const studentName =
              studentInfo.fullName || studentInfo.username || "Học viên";

            return {
              id: booking.id,
              title: `Buổi học với ${studentName}`,
              date: bookingDate,
              time: timeRange,
              student: studentName,
              studentAvatar: studentInfo.avatarUrl,
              studentUsername: studentInfo.username,
              type: "class",
              tags: tags,
              color: color,
              linkUrlRoom: timeslot.linkUrlRoom,
              slotStatus: timeslot.slotStatus,
              bookingData: booking, // Keep original data for reference
            };
          });

          setMentorBookings(transformedEvents);
        }
      } catch (error) {
        console.error("Error fetching mentor bookings:", error);
        message.error("Không thể tải danh sách lịch học");
        setMentorBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorBookings();
  }, [userId, userType, bookingStatus, isOwner]);

  // Fetch timeslots from API for Mentor
  const fetchTimeslots = useCallback(async () => {
    console.log("fetchTimeslots called with:", { userId, userType });
    // Fetch cho mentor role: nếu là owner thì lấy current user, nếu không thì lấy theo userId
    if (userType !== "mentor") {
      console.log("Not mentor type, skipping fetch");
      return;
    }

    try {
      setLoading(true);

      let response;
      // Nếu có userId được truyền vào, dùng API lấy calendar theo accountId
      // Nếu không, dùng API lấy calendar của current user
      if (userId) {
        console.log("Fetching calendar for user ID:", userId);
        response = await bookingService.getCalendarByAccountId(userId, {
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
        });
        console.log("Calendar response:", response);
      } else {
        response = await bookingService.getCurrentUserTimeslots({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
        });
      }

      if (response?.success && response?.data?.content) {
        // Transform API data to calendar events format
        // Với calendar API, data structure khác: content là array of calendars
        // Mỗi calendar có weekSlotResponses -> timeslotResponses
        const calendars = response.data.content;
        const allSlots = [];

        calendars.forEach((calendar) => {
          calendar.weekSlotResponses?.forEach((weekSlot) => {
            weekSlot.timeslotResponses?.forEach((slot) => {
              allSlots.push(slot);
            });
          });
        });

        console.log("All slots extracted:", allSlots);
        console.log(
          "Slots status breakdown:",
          allSlots.map((s) => ({ id: s.id, status: s.slotStatus }))
        );

        const transformedSlots = allSlots.map((slot) => {
          // Parse date and time
          const [year, month, day] = slot.slotDate.split("-").map(Number);
          const slotDate = new Date(year, month - 1, day);
          const timeRange = `${slot.startTime.slice(
            0,
            5
          )} - ${slot.endTime.slice(0, 5)}`;

          // Determine color based on status
          let color = "green"; // default AVAILABLE
          if (slot.slotStatus === "BOOKED") color = "blue";
          if (slot.slotStatus === "CANCELLED") color = "red";

          // Determine tags
          const tags = [];
          if (slot.slotStatus === "AVAILABLE") tags.push("Có sẵn");
          if (slot.slotStatus === "BOOKED") tags.push("Đã đặt");
          if (slot.slotStatus === "CANCELLED") tags.push("Đã hủy");

          return {
            id: slot.id,
            title: `Timeslot ${slot.startTime.slice(
              0,
              5
            )} - ${slot.endTime.slice(0, 5)}`,
            date: slotDate,
            time: timeRange,
            type: "timeslot",
            tags: tags,
            color: color,
            linkUrlRoom: slot.linkUrlRoom,
            slotStatus: slot.slotStatus,
            slotData: slot, // Keep original data for reference
          };
        });

        console.log("Transformed slots for calendar:", transformedSlots);
        setTimeslots(transformedSlots);
      }
    } catch (error) {
      console.error("Error fetching timeslots:", error);
      message.error("Không thể tải danh sách lịch đã tạo");
      setTimeslots([]);
    } finally {
      setLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    fetchTimeslots();
  }, [fetchTimeslots]);

  // Lấy số ngày trong tháng
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Thêm các ngày trống ở đầu
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Thêm các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // Kiểm tra xem ngày có sự kiện không
  const getEventsForDate = (date) => {
    if (!date) return [];

    // Nếu đang xem profile người khác (mentor), chỉ hiển thị timeslots
    if (userType === "mentor" && !isOwner) {
      const slotsForDate = timeslots.filter(
        (slot) =>
          slot.date.getDate() === date.getDate() &&
          slot.date.getMonth() === date.getMonth() &&
          slot.date.getFullYear() === date.getFullYear()
      );
      console.log(`Timeslots for ${date.toDateString()}:`, slotsForDate);
      return slotsForDate;
    }

    // Mentor xem bookings của mình, student xem events của mình
    const eventsToShow = userType === "mentor" ? mentorBookings : events;

    return eventsToShow.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Kiểm tra ngày hôm nay
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Kiểm tra ngày được chọn
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Chuyển tháng
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Về ngày hôm nay
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Xử lý click vào ngày
  const handleDateClick = (date) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);

    // Lấy events của ngày được click
    const dayEvents = getEventsForDate(date);

    // Nếu là ngày cũ (đã qua) và có events, mở modal
    if (clickedDate < today && dayEvents.length > 0) {
      setSelectedDateEvents(dayEvents);
      setIsModalOpen(true);
    }

    // Luôn set selected date để highlight
    setSelectedDate(date);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDateEvents([]);
  };

  // Mở modal tạo timeslot
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Đóng modal tạo timeslot
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewTimeslot({
      slotDate: null,
      startTime: null,
      endTime: null,
      linkUrlRoom: "",
    });
  };

  // Xử lý tạo timeslot mới
  const handleCreateTimeslot = async () => {
    // Validate input
    if (
      !newTimeslot.slotDate ||
      !newTimeslot.startTime ||
      !newTimeslot.endTime
    ) {
      message.error("Vui lòng điền đầy đủ thông tin ngày và thời gian!");
      return;
    }

    try {
      setCreateLoading(true);

      // Format data theo API requirement
      const requestData = {
        slotDate: dayjs(newTimeslot.slotDate).format("YYYY-MM-DD"),
        startTime: dayjs(newTimeslot.startTime).format("HH:mm"),
        endTime: dayjs(newTimeslot.endTime).format("HH:mm"),
        linkUrlRoom: newTimeslot.linkUrlRoom || "", // Để trống nếu không có
      };

      const response = await bookingService.createTimeslot(requestData);

      if (response?.success) {
        message.success("Tạo lịch thành công!");
        handleCloseCreateModal();

        // Refresh timeslots list
        const refreshResponse = await bookingService.getCurrentUserTimeslots({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
        });

        if (refreshResponse?.success && refreshResponse?.data?.content) {
          const slots = refreshResponse.data.content;
          const transformedSlots = slots.map((slot) => {
            const [year, month, day] = slot.slotDate.split("-").map(Number);
            const slotDate = new Date(year, month - 1, day);
            const timeRange = `${slot.startTime.slice(
              0,
              5
            )} - ${slot.endTime.slice(0, 5)}`;

            let color = "green";
            if (slot.slotStatus === "BOOKED") color = "blue";
            if (slot.slotStatus === "CANCELLED") color = "red";

            const tags = [];
            if (slot.slotStatus === "AVAILABLE") tags.push("Có sẵn");
            if (slot.slotStatus === "BOOKED") tags.push("Đã đặt");
            if (slot.slotStatus === "CANCELLED") tags.push("Đã hủy");

            return {
              id: slot.id,
              title: `Timeslot ${slot.startTime.slice(
                0,
                5
              )} - ${slot.endTime.slice(0, 5)}`,
              date: slotDate,
              time: timeRange,
              type: "timeslot",
              tags: tags,
              color: color,
              linkUrlRoom: slot.linkUrlRoom,
              slotStatus: slot.slotStatus,
              slotData: slot,
            };
          });

          setTimeslots(transformedSlots);
        }
      }
    } catch (error) {
      console.error("Error creating timeslot:", error);
      message.error(
        error.response?.data?.message || "Không thể tạo lịch. Vui lòng thử lại!"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // Handler for booking a timeslot
  const handleBookTimeslot = (timeslot) => {
    setSelectedTimeslot(timeslot);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTimeslot) return;

    try {
      setBookingLoading(true);

      // Call API to create booking
      const bookingData = {
        mentorId: userId, // mentor's userId
        timeslotId: selectedTimeslot.slotData.id, // timeslot ID
      };

      console.log("Creating booking with data:", bookingData);
      const response = await bookingService.createBooking(bookingData);
      console.log("Booking response:", response);

      if (response?.success) {
        message.success("Đặt lịch thành công!");
        setIsBookingModalOpen(false);
        setSelectedTimeslot(null);

        // Refresh timeslots to update the calendar
        console.log("Refreshing timeslots after booking...");
        await fetchTimeslots();
        console.log("Timeslots refreshed. New state:", timeslots);
      }
    } catch (error) {
      console.error("Error booking timeslot:", error);
      message.error(
        error.response?.data?.message || "Không thể đặt lịch. Vui lòng thử lại!"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setIsBookingModalOpen(false);
    setSelectedTimeslot(null);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Lấy sự kiện sắp tới (bao gồm cả hôm nay)
  const upcomingEvents = (userType === "student" ? events : mentorBookings)
    .filter((event) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => a.date - b.date)
    .slice(0, 10); // Show more events

  // Lấy tất cả timeslots đã tạo (cho mentor)
  const createdTimeslots = timeslots
    .sort((a, b) => b.date - a.date) // Sort by date descending
    .slice(0, 10);

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg max-w-7xl mx-auto">
      {/* Calendar Section */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Hôm nay
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 mb-3">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              view === "month"
                ? "bg-purple-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tháng
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              view === "week"
                ? "bg-purple-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              view === "day"
                ? "bg-purple-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Ngày
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
              <div
                key={index}
                className={`text-center py-2 text-xs font-semibold ${
                  index === 6 ? "text-purple-900" : "text-gray-700"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const dayEvents = date ? getEventsForDate(date) : [];
              const isCurrentDay = date && isToday(date);
              const isSelectedDay = date && isSelected(date);
              const isSunday = index % 7 === 6;

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    min-h-[70px] p-1.5 border-b border-r border-gray-200
                    ${
                      !date
                        ? "bg-gray-50"
                        : "bg-white hover:bg-gray-50 cursor-pointer"
                    }
                    ${
                      isCurrentDay
                        ? "bg-purple-50 ring-1 ring-purple-300 ring-inset"
                        : ""
                    }
                    ${
                      isSelectedDay
                        ? "bg-purple-100 ring-1 ring-purple-400 ring-inset"
                        : ""
                    }
                    ${index % 7 === 6 ? "border-r-0" : ""}
                    transition-colors
                  `}
                >
                  {date && (
                    <>
                      <div
                        className={`
                          text-xs font-medium mb-0.5
                          ${isSunday ? "text-purple-900" : "text-gray-700"}
                          ${isCurrentDay ? "font-bold text-purple-900" : ""}
                        `}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 1).map((event) => (
                          <div
                            key={event.id}
                            className={`
                              text-[10px] px-1 py-0.5 rounded truncate
                              ${
                                event.color === "red"
                                  ? "bg-red-100 text-red-700"
                                  : event.color === "blue"
                                  ? "bg-blue-100 text-blue-700"
                                  : event.color === "green"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }
                            `}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 1 && (
                          <div className="text-[10px] text-gray-500 px-1">
                            +{dayEvents.length - 1}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Event Button (chỉ cho mentor VÀ chỉ khi là owner) */}
        {userType === "mentor" && isOwner && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors"
            >
              <span className="text-base">+</span>
              Thêm sự kiện
            </button>
          </div>
        )}
      </div>

      {/* Events Sidebar */}
      <div className="w-72 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-800">
              {userType === "student"
                ? "Lịch học sắp tới"
                : !isOwner
                ? "Lịch trống"
                : mentorTab === "upcoming"
                ? "Sự kiện sắp tới"
                : "Lịch đã tạo"}
            </h3>
          </div>
        </div>

        {/* Tab buttons for mentor - CHỈ hiển thị khi đang xem profile của chính mình */}
        {userType === "mentor" && isOwner && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMentorTab("upcoming")}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mentorTab === "upcoming"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sự kiện sắp tới
            </button>
            <button
              onClick={() => setMentorTab("created")}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mentorTab === "created"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Lịch đã tạo
            </button>
          </div>
        )}

        {/* Filter by status for mentor when in upcoming tab - CHỈ khi là owner */}
        {userType === "mentor" && isOwner && mentorTab === "upcoming" && (
          <div className="mb-4">
            <Select
              value={bookingStatus}
              onChange={(value) => setBookingStatus(value)}
              style={{ width: "100%" }}
              size="middle"
              options={[
                {
                  value: "PENDING",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span>Chờ xác nhận</span>
                    </div>
                  ),
                },
                {
                  value: "CONFIRMED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Đã xác nhận</span>
                    </div>
                  ),
                },
                {
                  value: "COMPLETED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Hoàn thành</span>
                    </div>
                  ),
                },
                {
                  value: "CANCELLED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>Đã hủy</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {/* Filter by status for students */}
        {userType === "student" && (
          <div className="mb-4">
            <Select
              value={bookingStatus}
              onChange={(value) => setBookingStatus(value)}
              style={{ width: "100%" }}
              size="middle"
              options={[
                {
                  value: "PENDING",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      <span>Chờ xác nhận</span>
                    </div>
                  ),
                },
                {
                  value: "CONFIRMED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Đã xác nhận</span>
                    </div>
                  ),
                },
                {
                  value: "COMPLETED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Hoàn thành</span>
                    </div>
                  ),
                },
                {
                  value: "CANCELLED",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>Đã hủy</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Đang tải...</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto no-scrollbar">
            {/* Display timeslots when viewing mentor profile as a student/visitor */}
            {!isOwner && userType === "mentor" && timeslots.length > 0 ? (
              (() => {
                const filteredSlots = timeslots.filter((slot) => {
                  // Chỉ hiển thị các slot trong tương lai và có status AVAILABLE
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const slotDate = new Date(slot.date);
                  slotDate.setHours(0, 0, 0, 0);
                  const isValid =
                    slotDate >= today && slot.slotStatus === "AVAILABLE";
                  console.log(
                    `Slot ${slot.id}: status=${slot.slotStatus}, isValid=${isValid}`
                  );
                  return isValid;
                });
                console.log(
                  "Filtered available slots for display:",
                  filteredSlots
                );
                return filteredSlots
                  .sort((a, b) => a.date - b.date)
                  .map((slot) => (
                    <div
                      key={slot.id}
                      className="relative bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    >
                      {/* Color indicator dot */}
                      <div className="absolute top-3 left-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>

                      {/* Content with left padding for dot */}
                      <div className="pl-4">
                        {/* Title */}
                        <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                          {slot.title}
                        </h4>

                        {/* Date */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600">
                            {slot.date.getDate()}/{slot.date.getMonth() + 1}/
                            {slot.date.getFullYear()}
                          </span>
                        </div>

                        {/* Time */}
                        {slot.time && (
                          <div className="flex items-center gap-2 mb-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">
                              {slot.time}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Có sẵn
                          </span>
                        </div>

                        {/* Book button */}
                        <button
                          onClick={() => handleBookTimeslot(slot)}
                          className="w-full mt-2 px-3 py-1.5 bg-purple-900 text-white text-xs font-medium rounded hover:bg-purple-800 transition-colors"
                        >
                          Đặt lịch
                        </button>
                      </div>
                    </div>
                  ));
              })()
            ) : isOwner &&
              (userType === "student" ||
                (userType === "mentor" && mentorTab === "upcoming")) &&
              upcomingEvents.length > 0 ? (
              // Display for student or mentor upcoming events - CHỈ khi là owner
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Color indicator dot */}
                  <div className="absolute top-3 left-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        event.color === "red"
                          ? "bg-red-500"
                          : event.color === "blue"
                          ? "bg-blue-500"
                          : event.color === "orange"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>

                  {/* Content with left padding for dot */}
                  <div className="pl-4">
                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                      {event.title}
                    </h4>

                    {/* Date */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">
                        {event.date.getDate()}/{event.date.getMonth() + 1}/
                        {event.date.getFullYear()}
                      </span>
                    </div>

                    {/* Time */}
                    {event.time && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">
                          {event.time}
                        </span>
                      </div>
                    )}

                    {/* Display mentor name for students, student name for mentors */}
                    {userType === "student" && event.mentor && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">
                          {event.mentor}
                        </span>
                      </div>
                    )}
                    {userType === "mentor" && event.student && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <User className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">
                          {event.student}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`
                            inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full
                            ${
                              tag === "Hoàn thành"
                                ? "bg-green-100 text-green-700"
                                : tag === "Đã xác nhận"
                                ? "bg-blue-100 text-blue-700"
                                : tag === "Đã hủy"
                                ? "bg-red-100 text-red-700"
                                : tag === "Chờ xác nhận"
                                ? "bg-orange-100 text-orange-700"
                                : tag === "Nghỉ lễ"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-200 text-gray-700"
                            }
                          `}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : isOwner &&
              userType === "mentor" &&
              mentorTab === "created" &&
              createdTimeslots.length > 0 ? (
              // Display created timeslots for mentor - CHỈ khi là owner
              createdTimeslots.map((slot) => (
                <div
                  key={slot.id}
                  className="relative bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                >
                  {/* Color indicator dot */}
                  <div className="absolute top-3 left-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        slot.color === "red"
                          ? "bg-red-500"
                          : slot.color === "blue"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>

                  {/* Content with left padding for dot */}
                  <div className="pl-4">
                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-tight">
                      {slot.title}
                    </h4>

                    {/* Date */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">
                        {slot.date.getDate()}/{slot.date.getMonth() + 1}/
                        {slot.date.getFullYear()}
                      </span>
                    </div>

                    {/* Time */}
                    {slot.time && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">
                          {slot.time}
                        </span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {slot.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`
                            inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full
                            ${
                              tag === "Có sẵn"
                                ? "bg-green-100 text-green-700"
                                : tag === "Đã đặt"
                                ? "bg-blue-100 text-blue-700"
                                : tag === "Đã hủy"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-200 text-gray-700"
                            }
                          `}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">
                  {!isOwner && userType === "mentor"
                    ? "Mentor chưa có lịch trống"
                    : !isOwner
                    ? "Xem lịch trống của mentor trên calendar"
                    : userType === "student"
                    ? "Không có lịch học sắp tới"
                    : mentorTab === "upcoming"
                    ? "Không có sự kiện sắp tới"
                    : "Không có lịch đã tạo"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal hiển thị lịch của ngày đã chọn */}
      <Modal
        title={
          selectedDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-900" />
              <span>
                Lịch học ngày {selectedDate.getDate()}/
                {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
              </span>
            </div>
          )
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        <div className="space-y-3 mt-4">
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="relative bg-gray-50 rounded-lg border border-gray-200 p-4"
              >
                {/* Color indicator dot */}
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      event.color === "red"
                        ? "bg-red-500"
                        : event.color === "blue"
                        ? "bg-blue-500"
                        : event.color === "orange"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                </div>

                {/* Content with left padding for dot */}
                <div className="pl-5">
                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 text-base mb-3">
                    {event.title}
                  </h4>

                  {/* Time */}
                  {event.time && (
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {event.time}
                      </span>
                    </div>
                  )}

                  {/* Display mentor name for students, student name for mentors */}
                  {userType === "student" && event.mentor && (
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {event.mentor}
                      </span>
                    </div>
                  )}
                  {userType === "mentor" && event.student && (
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        {event.student}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`
                          inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full
                          ${
                            tag === "Hoàn thành"
                              ? "bg-green-100 text-green-700"
                              : tag === "Đã xác nhận"
                              ? "bg-blue-100 text-blue-700"
                              : tag === "Đã hủy"
                              ? "bg-red-100 text-red-700"
                              : tag === "Chờ xác nhận"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-200 text-gray-700"
                          }
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Không có lịch học trong ngày này</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal tạo timeslot mới (chỉ cho mentor) */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-900" />
            <span>Tạo lịch mới</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        onOk={handleCreateTimeslot}
        okText="Tạo lịch"
        cancelText="Hủy"
        confirmLoading={createLoading}
        width={500}
      >
        <div className="space-y-4 mt-4">
          {/* Chọn ngày */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={newTimeslot.slotDate}
              onChange={(date) =>
                setNewTimeslot({ ...newTimeslot, slotDate: date })
              }
              format="DD/MM/YYYY"
              placeholder="Chọn ngày"
              className="w-full"
              disabledDate={(current) => {
                // Không cho chọn ngày trong quá khứ
                return current && current < dayjs().startOf("day");
              }}
            />
          </div>

          {/* Chọn giờ bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ bắt đầu <span className="text-red-500">*</span>
            </label>
            <TimePicker
              value={newTimeslot.startTime}
              onChange={(time) =>
                setNewTimeslot({ ...newTimeslot, startTime: time })
              }
              format="HH:mm"
              placeholder="Chọn giờ bắt đầu"
              className="w-full"
              minuteStep={15}
            />
          </div>

          {/* Chọn giờ kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giờ kết thúc <span className="text-red-500">*</span>
            </label>
            <TimePicker
              value={newTimeslot.endTime}
              onChange={(time) =>
                setNewTimeslot({ ...newTimeslot, endTime: time })
              }
              format="HH:mm"
              placeholder="Chọn giờ kết thúc"
              className="w-full"
              minuteStep={15}
            />
          </div>

          {/* Link phòng học (tạm thời để trống) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link phòng học (tùy chọn)
            </label>
            <input
              type="text"
              value={newTimeslot.linkUrlRoom}
              onChange={(e) =>
                setNewTimeslot({ ...newTimeslot, linkUrlRoom: e.target.value })
              }
              placeholder="Để trống hoặc nhập link phòng học"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bạn có thể để trống và cập nhật sau
            </p>
          </div>
        </div>
      </Modal>

      {/* Modal xác nhận đặt lịch */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-900" />
            <span>Xác nhận đặt lịch</span>
          </div>
        }
        open={isBookingModalOpen}
        onOk={handleConfirmBooking}
        onCancel={handleCancelBooking}
        okText="Xác nhận đặt lịch"
        cancelText="Hủy"
        confirmLoading={bookingLoading}
        okButtonProps={{
          className: "bg-purple-900 hover:bg-purple-800",
        }}
      >
        {selectedTimeslot && (
          <div className="space-y-4 mt-4">
            <p className="text-gray-700">
              Bạn có chắc chắn muốn đặt lịch học này không?
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {/* Date */}
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ngày học</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTimeslot.date.getDate()}/
                    {selectedTimeslot.date.getMonth() + 1}/
                    {selectedTimeslot.date.getFullYear()}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Thời gian</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedTimeslot.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Lưu ý:</strong> Sau khi đặt lịch, mentor sẽ xác nhận và
                bạn sẽ nhận được thông báo. Vui lòng kiểm tra lịch học của bạn
                thường xuyên.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarSchedule;
