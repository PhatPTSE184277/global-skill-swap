import React, { useState, useEffect, useCallback, useRef } from "react"; // 1. Import thêm useRef
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import apiService from "../../services/apiService";
import userRoomService from "../../services/userRoomService";
import { message, Modal, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

const CalendarSchedule = ({
  userId,
  userType = "student",
  isOwner = false,
}) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus] = useState("CONFIRMED"); // Cố định là CONFIRMED, không cho thay đổi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [mentorTab, setMentorTab] = useState("upcoming");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newTimeslot, setNewTimeslot] = useState({
    slotDate: null,
    startTime: null,
    endTime: null,
    linkUrlRoom: "",
    language: "ENGLISH", // Mặc định là tiếng Anh
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Modal chi tiết lịch học cho mentor
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSlotDetail, setSelectedSlotDetail] = useState(null);
  const [startMeetingLoading, setStartMeetingLoading] = useState(false);

  // 2. GIẢI PHÁP CHUNG: Dùng useRef để theo dõi component "còn sống" hay không
  // Nó sẽ là "công tắc an toàn" cho MỌI HÀM ASYNC
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true; // Component "sống"
    return () => {
      isMounted.current = false; // Component "chết" (unmount)
    };
  }, []); // Chạy 1 lần duy nhất

  // Handle tab change with event prevention
  const handleTabChange = useCallback(
    (tab, event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (isTabSwitching) return;

      setIsTabSwitching(true);
      setMentorTab(tab);

      setTimeout(() => {
        // 3. FIX CHO NGUỒN KẸT SỐ 1 (setTimeout)
        if (isMounted.current) {
          setIsTabSwitching(false);
        }
      }, 300);
    },
    [isTabSwitching] // isMounted không cần là dependency
  );

  // Fetch bookings from API for User
  useEffect(() => {
    const fetchBookings = async () => {
      if (userType !== "student") {
        return;
      }
      try {
        // 4. FIX CHO NGUỒN KẸT SỐ 2 (fetch data)
        if (isMounted.current) setLoading(true);

        const response = await bookingService.getCurrentUserBookings({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
          bookingStatus: bookingStatus,
        });

        if (response?.success && response?.data?.content) {
          const bookings = response.data.content;
          const transformedEvents = bookings.map((booking) => {
            // ... (giữ nguyên logic map)
            const timeslot = booking.timeslotResponse;
            const [year, month, day] = timeslot.slotDate.split("-").map(Number);
            const bookingDate = new Date(year, month - 1, day);
            const timeRange = `${timeslot.startTime.slice(
              0,
              5
            )} - ${timeslot.endTime.slice(0, 5)}`;
            let color = "orange";
            if (booking.bookingStatus === "CONFIRMED") color = "blue";
            if (booking.bookingStatus === "CANCELLED") color = "red";
            if (booking.bookingStatus === "COMPLETED") color = "green";
            const tags = [];
            if (booking.bookingStatus === "PENDING") tags.push("Chờ xác nhận");
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
              bookingData: booking,
              language: timeslot.language,
            };
          });

          if (isMounted.current) {
            // <--- KIỂM TRA TRƯỚC KHI SET
            setEvents(transformedEvents);
          }
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("Không thể tải danh sách lịch học");
        if (isMounted.current) setEvents([]); // <--- KIỂM TRA
      } finally {
        if (isMounted.current) {
          // <--- KIỂM TRA
          setLoading(false);
        }
      }
    };

    fetchBookings();

    // Không cần hàm cleanup isMounted = false ở đây nữa, vì đã dùng chung 1 cái
  }, [userId, userType, bookingStatus, isOwner]);

  // Fetch timeslots from API for Mentor
  // ĐÃ GỘP 2 USEEFFECT LẠI LÀM 1 (đây là cách làm đúng)
  useEffect(() => {
    const fetchTimeslots = async () => {
      console.log("fetchTimeslots called with:", { userId, userType });
      if (userType !== "mentor") {
        console.log("Not mentor type, skipping fetch");
        return;
      }
      try {
        // 4. FIX CHO NGUỒN KẸT SỐ 2 (fetch data)
        if (isMounted.current) setLoading(true);

        let response;
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

          // Transform slots và fetch student info cho các slot BOOKED
          const transformedSlots = await Promise.all(
            allSlots.map(async (slot) => {
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

              // Fetch student info nếu slot đã được book và là owner
              let studentInfo = null;
              if (slot.slotStatus === "BOOKED" && isOwner) {
                try {
                  const bookingResponse =
                    await bookingService.getStudentBookedTimeslot(
                      slot.id,
                      "CONFIRMED"
                    );
                  if (bookingResponse?.success && bookingResponse?.data) {
                    const booking = bookingResponse.data;
                    studentInfo = {
                      username: booking.userId?.username || "Student",
                      fullName:
                        booking.userId?.fullName ||
                        booking.userId?.username ||
                        "Student",
                      avatarUrl: booking.userId?.avatarUrl,
                    };
                  }
                } catch (error) {
                  console.error(
                    `Error fetching student for slot ${slot.id}:`,
                    error
                  );
                }
              }

              return {
                id: slot.id,
                title: studentInfo
                  ? `Buổi học với ${studentInfo.fullName}`
                  : `Timeslot ${slot.startTime.slice(
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
                student: studentInfo?.fullName,
                studentUsername: studentInfo?.username,
                studentAvatar: studentInfo?.avatarUrl,
                language: slot.language, // Thêm language từ API
              };
            })
          );

          console.log("Transformed slots for calendar:", transformedSlots);
          if (isMounted.current) {
            // <--- KIỂM TRA
            setTimeslots(transformedSlots);
          }
        }
      } catch (error) {
        console.error("Error fetching timeslots:", error);
        message.error("Không thể tải danh sách lịch đã tạo");
        if (isMounted.current) setTimeslots([]); // <--- KIỂM TRA
      } finally {
        if (isMounted.current) {
          // <--- KIỂM TRA
          setLoading(false);
        }
      }
    };

    fetchTimeslots();
  }, [userId, userType, isOwner]); // Thêm isOwner vào dependencies

  // Xử lý tạo timeslot mới (KHÔNG tạo meeting room)
  const handleCreateTimeslot = async () => {
    // Validate input
    if (!newTimeslot.slotDate || !newTimeslot.startTime) {
      message.error("Vui lòng điền đầy đủ thông tin ngày và thời gian!");
      return;
    }

    try {
      if (isMounted.current) setCreateLoading(true);

      // Tự động tính endTime = startTime + 1 giờ
      const endTime = dayjs(newTimeslot.startTime).add(1, "hour");

      const timeslotData = {
        slotDate: dayjs(newTimeslot.slotDate).format("YYYY-MM-DD"),
        startTime: dayjs(newTimeslot.startTime).format("HH:mm"),
        endTime: endTime.format("HH:mm"), // Tự động + 1 giờ
        linkUrlRoom: "", // Để trống, sẽ tạo khi bắt đầu học
        language: newTimeslot.language, // Thêm language vào data
      };

      // Chỉ tạo timeslot, không tạo meeting room
      const timeslotResponse = await bookingService.createTimeslot(
        timeslotData
      );

      if (!isMounted.current) return;

      if (timeslotResponse?.success) {
        if (isMounted.current) {
          message.success("Tạo lịch thành công!");
          handleCloseCreateModal();
        }

        // Refresh timeslots list
        const refreshResponse = await bookingService.getCurrentUserTimeslots({
          page: 0,
          size: 100,
          sortBy: "id",
          sortDir: "desc",
        });

        if (!isMounted.current) return;

        if (refreshResponse?.success && refreshResponse?.data?.content) {
          const calendars = refreshResponse.data.content;
          const allSlots = [];
          calendars.forEach((calendar) => {
            calendar.weekSlotResponses?.forEach((weekSlot) => {
              weekSlot.timeslotResponses?.forEach((slot) => {
                allSlots.push(slot);
              });
            });
          });

          const transformedSlots = allSlots.map((slot) => {
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

          if (isMounted.current) {
            setTimeslots(transformedSlots);
          }
        }
      }
    } catch (error) {
      console.error("Error creating timeslot:", error);
      if (isMounted.current) {
        message.error(
          error.response?.data?.message ||
            "Không thể tạo lịch. Vui lòng thử lại!"
        );
      }
    } finally {
      if (isMounted.current) {
        setCreateLoading(false);
      }
    }
  };

  //
  //
  // ===>>> CÁC HÀM KHÁC (getDaysInMonth, getEventsForDate, isToday,...) GIỮ NGUYÊN <<<===
  //
  //

  // (Tôi sẽ thu gọn các hàm không thay đổi ở đây để bạn dễ copy)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };
  const getEventsForDate = (date) => {
    if (!date) return [];
    if (userType === "mentor" && !isOwner) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      const slotsForDate = timeslots.filter(
        (slot) =>
          slot.date.getDate() === date.getDate() &&
          slot.date.getMonth() === date.getMonth() &&
          slot.date.getFullYear() === date.getFullYear() &&
          slot.slotStatus === "AVAILABLE" &&
          checkDate >= today
      );
      console.log(
        `Available timeslots for ${date.toDateString()}:`,
        slotsForDate
      );
      return slotsForDate;
    }

    // Nếu là mentor và owner, dùng timeslots thay vì mentorBookings
    const eventsToShow =
      userType === "mentor"
        ? timeslots.filter((slot) => slot.slotStatus === "BOOKED") // Chỉ lấy slot đã được book
        : events;

    return eventsToShow.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  const handleDateClick = (date) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(date);
    clickedDate.setHours(0, 0, 0, 0);
    const dayEvents = getEventsForDate(date);
    if (clickedDate < today && dayEvents.length > 0) {
      setSelectedDateEvents(dayEvents);
      setIsModalOpen(true);
    }
    setSelectedDate(date);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDateEvents([]);
  };
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewTimeslot({
      slotDate: null,
      startTime: null,
      endTime: null,
      linkUrlRoom: "",
      language: "ENGLISH", // Reset về mặc định
    });
  };
  const handleBookTimeslot = (timeslot, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedTimeslot(timeslot);
    setIsBookingModalOpen(true);
  };

  // handleConfirmBooking - Gọi API tạo booking trước, sau đó chuyển trang payment
  const handleConfirmBooking = async () => {
    if (!selectedTimeslot) return;

    try {
      if (isMounted.current) setBookingLoading(true);

      const bookingData = {
        mentorId: userId,
        timeslotId: selectedTimeslot.slotData.id,
        timeslot: selectedTimeslot.slotData,
        mentor: { id: userId },
        amount: 150000,
      };

      console.log("=== BOOKING DEBUG ===");
      console.log("Creating booking with data:", bookingData);

      // Bước 1: Gọi API tạo booking với đúng format
      const bookingResponse = await bookingService.createBooking({
        mentorId: userId, // ✅ Thêm mentorId
        timeslotId: selectedTimeslot.slotData.id,
      });

      console.log("Booking created successfully:", bookingResponse);

      if (!bookingResponse?.success || !bookingResponse?.data?.id) {
        throw new Error("Không thể tạo booking");
      }

      const bookingId = bookingResponse.data.id;

      // Close modal first
      if (isMounted.current) {
        setIsBookingModalOpen(false);
        setSelectedTimeslot(null);
        setBookingLoading(false);
      }

      // Bước 2: Chuyển sang trang thanh toán với bookingId
      console.log("Navigating to payment with bookingId:", bookingId);
      navigate("/payment", {
        state: {
          bookingData: {
            ...bookingData,
            bookingId: bookingId, // Thêm bookingId vào bookingData
          },
          productId: 2,
        },
      });

      message.success(
        "Đã tạo booking thành công! Vui lòng thanh toán để hoàn tất."
      );
    } catch (error) {
      console.error("Error creating booking:", error);
      if (isMounted.current) {
        message.error(
          error.response?.data?.message ||
            error.message ||
            "Không thể tạo booking. Vui lòng thử lại!"
        );
        setBookingLoading(false);
      }
    }
  };

  const handleCancelBooking = () => {
    setIsBookingModalOpen(false);
    setSelectedTimeslot(null);
  };

  // Xử lý click vào card lịch học trong tab "Lịch đã tạo"
  const handleSlotClick = (slot, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedSlotDetail(slot);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSlotDetail(null);
  };

  // Kiểm tra xem có thể bắt đầu học không (trước 15 phút)
  const canStartMeeting = (slot) => {
    if (!slot || !slot.slotData) return false;

    const now = new Date();
    const [year, month, day] = slot.slotData.slotDate.split("-").map(Number);
    const [hours, minutes] = slot.slotData.startTime.split(":").map(Number);
    const slotDateTime = new Date(year, month - 1, day, hours, minutes);

    // Tính khoảng cách thời gian (phút)
    const diffMinutes = (slotDateTime - now) / (1000 * 60);

    // Có thể bắt đầu nếu còn <= 15 phút và chưa quá giờ bắt đầu quá 1 tiếng
    return diffMinutes <= 15 && diffMinutes >= -60;
  };

  // Xử lý bắt đầu học - tạo meeting room và vào phòng
  const handleStartMeeting = async () => {
    if (!selectedSlotDetail) return;

    try {
      if (isMounted.current) setStartMeetingLoading(true);

      // Lấy thông tin user từ Gateway Service
      const userResponse = await userRoomService.getCurrentUser();
      const currentUser = userResponse?.data;

      if (!currentUser || !currentUser.id) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      const now = new Date();

      // Tạo meeting room với format đúng theo CreateRoomModal
      const roomData = {
        room_name: `Phòng học - ${selectedSlotDetail.slotData.slotDate}`,
        mentor_id: currentUser.id,
        user_id: currentUser.id,
        start_time: now.toISOString(),
        status: "ongoing", // Đang diễn ra ngay
        is_private: true, // Mặc định là private
        details: {
          meeting_link: null,
          meeting_password: null,
          notes: `Phòng học cho lịch ${selectedSlotDetail.slotData.slotDate} - ${selectedSlotDetail.time}`,
          recorded_url: null,
        },
        participants: [],
        creator_name: currentUser.fullName || currentUser.username || "Mentor",
      };

      const meetingRoomResponse = await apiService.createMeetingRoom(roomData);

      if (!isMounted.current) return;

      if (meetingRoomResponse?.success && meetingRoomResponse?.data?.room) {
        const room = meetingRoomResponse.data.room;
        const meetingLink =
          room.meetingroomdetails?.[0]?.meeting_link ||
          room.meetingroomdetails?.meeting_link;

        console.log("Meeting Link from backend:", meetingLink);
        console.log("Room data:", room);

        if (meetingLink && selectedSlotDetail.slotData?.id) {
          // Lưu chỉ mã phòng (bỏ /meeting/ nếu có)
          const roomCode = meetingLink
            .replace(/^\/meeting\//, "")
            .replace(/^meeting\//, "");

          console.log("Room code to save:", roomCode);
          console.log("Full redirect URL:", `/meeting/${roomCode}`);

          // Cập nhật timeslot với mã phòng
          const updateData = {
            slotDate: selectedSlotDetail.slotData.slotDate,
            startTime: selectedSlotDetail.slotData.startTime,
            endTime: selectedSlotDetail.slotData.endTime,
            linkUrlRoom: roomCode, // Chỉ lưu mã phòng
          };

          await bookingService.updateTimeslot(
            selectedSlotDetail.slotData.id,
            updateData
          );

          if (!isMounted.current) return;

          if (isMounted.current) {
            message.success("Đã tạo phòng học thành công!");
            handleCloseDetailModal();
          }

          // Redirect to meeting room với link đầy đủ
          window.location.href = `/meeting/${roomCode}`;
        }
      } else {
        throw new Error("Không thể tạo phòng học");
      }
    } catch (error) {
      console.error("Error starting meeting:", error);
      if (isMounted.current) {
        message.error("Không thể tạo phòng học. Vui lòng thử lại!");
      }
    } finally {
      if (isMounted.current) {
        setStartMeetingLoading(false);
      }
    }
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

  // Lấy sự kiện sắp tới - Nếu là mentor thì lấy từ timeslots với slotStatus = "BOOKED"
  const upcomingEvents = (
    userType === "student"
      ? events
      : timeslots.filter((slot) => slot.slotStatus === "BOOKED")
  )
    .filter((event) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      // Nếu có ngày được chọn (cho mentor), chỉ hiển thị event của ngày đó
      if (selectedDate && userType === "mentor") {
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);
        return eventDate.getTime() === selectedDateObj.getTime();
      }

      // Nếu không có ngày được chọn, hiển thị events từ hôm nay trở đi
      return eventDate >= today;
    })
    .sort((a, b) => a.date - b.date)
    .slice(0, 10);

  const createdTimeslots = timeslots
    .filter((slot) => {
      if (selectedDate) {
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);
        const slotDate = new Date(slot.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === selectedDateObj.getTime();
      }
      return true;
    })
    .sort((a, b) => b.date - a.date)
    .slice(0, 10);

  //
  //
  // ===>>> PHẦN RETURN (HTML/JSX) GIỮ NGUYÊN KHÔNG THAY ĐỔI <<<===
  // (Bạn chỉ cần copy phần JS ở trên)
  //
  //

  return (
    <div className="flex gap-4 bg-white rounded-lg max-w-7xl mx-auto h-[calc(100vh-200px)]">
      {/* Calendar Section */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
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
      </div>

      {/* Events Sidebar */}
      <div className="w-72 bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
          {/* Add Event Button (cho mentor khi là owner ở cả 2 tab) */}
          {userType === "mentor" && isOwner && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Tab buttons for mentor - CHỈ hiển thị khi đang xem profile của chính mình */}
        {userType === "mentor" && isOwner && (
          <div className="flex gap-2 mb-4 flex-shrink-0">
            <button
              onClick={(e) => handleTabChange("upcoming", e)}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mentorTab === "upcoming"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sự kiện sắp tới
            </button>
            <button
              onClick={(e) => handleTabChange("created", e)}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mentorTab === "created"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Lịch đã tạo
            </button>
          </div>
        )}

        {/* Hiển thị thông báo khi đã chọn ngày - CHO CẢ 2 TAB */}
        {userType === "mentor" && isOwner && selectedDate && (
          <div className="mb-4 flex-shrink-0 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-purple-900 font-medium">
                  Hiển thị lịch ngày {selectedDate.getDate()}/
                  {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-purple-900 hover:text-purple-700 font-medium underline ml-2"
              >
                Xem tất cả
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-2">Đang tải...</p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar pr-1">
            {/* Display timeslots when viewing mentor profile as a student/visitor */}
            {!isOwner && userType === "mentor" ? (
              (() => {
                console.log("=== SIDEBAR DEBUG ===");
                console.log("Total timeslots:", timeslots.length);
                console.log("Selected date:", selectedDate);

                let filteredSlots = timeslots.filter((slot) => {
                  // Chỉ hiển thị các slot trong tương lai và có status AVAILABLE
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const slotDate = new Date(slot.date);
                  slotDate.setHours(0, 0, 0, 0);

                  // Kiểm tra điều kiện cơ bản
                  const isAvailable = slot.slotStatus === "AVAILABLE";
                  const isFutureOrToday = slotDate >= today;

                  // Nếu có ngày được chọn, chỉ hiển thị slot của ngày đó
                  let isSelectedDate = true;
                  if (selectedDate) {
                    const selectedDateOnly = new Date(selectedDate);
                    selectedDateOnly.setHours(0, 0, 0, 0);
                    isSelectedDate =
                      slotDate.getDate() === selectedDateOnly.getDate() &&
                      slotDate.getMonth() === selectedDateOnly.getMonth() &&
                      slotDate.getFullYear() === selectedDateOnly.getFullYear();
                  }

                  const isValid =
                    isAvailable && isFutureOrToday && isSelectedDate;

                  console.log(
                    `Slot ${
                      slot.id
                    }: date=${slot.date.toDateString()}, status=${
                      slot.slotStatus
                    }, isValid=${isValid}`
                  );
                  return isValid;
                });

                console.log(
                  "Filtered available slots for display:",
                  filteredSlots
                );

                if (filteredSlots.length === 0) {
                  return (
                    <div className="text-center py-6 text-gray-500">
                      <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs">
                        {selectedDate
                          ? `Không có lịch trống ngày ${selectedDate.getDate()}/${
                              selectedDate.getMonth() + 1
                            }`
                          : "Mentor chưa có lịch trống"}
                      </p>
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                        >
                          Xem tất cả lịch trống
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <>
                    {selectedDate && (
                      <div className="mb-3 flex items-center justify-between bg-purple-50 p-2 rounded">
                        <span className="text-xs text-purple-900 font-medium">
                          Ngày {selectedDate.getDate()}/
                          {selectedDate.getMonth() + 1}/
                          {selectedDate.getFullYear()}
                        </span>
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="text-xs text-purple-600 hover:text-purple-800 underline"
                        >
                          Xem tất cả
                        </button>
                      </div>
                    )}
                    {filteredSlots
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
                                {slot.date.getDate()}/{slot.date.getMonth() + 1}
                                /{slot.date.getFullYear()}
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
                              onClick={(e) => handleBookTimeslot(slot, e)}
                              className="w-full mt-2 px-3 py-1.5 bg-purple-900 text-white text-xs font-medium rounded hover:bg-purple-800 transition-colors"
                            >
                              Đặt lịch
                            </button>
                          </div>
                        </div>
                      ))}
                  </>
                );
              })()
            ) : isOwner &&
              (userType === "student" ||
                (userType === "mentor" && mentorTab === "upcoming")) &&
              upcomingEvents.length > 0 ? (
              // Display for student or mentor upcoming events - CHỈ khi là owner
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={(e) =>
                    userType === "mentor"
                      ? handleSlotClick(event, e)
                      : undefined
                  }
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

                    {/* Language */}
                    {event.language && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-600">
                          {event.language === "ENGLISH"
                            ? "Tiếng Anh"
                            : "Tiếng Trung"}
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

                    {/* Link URL Room */}
                    {event.linkUrlRoom && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <a
                          href={`/meeting/${event.linkUrlRoom}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Vào phòng học
                        </a>
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
                  onClick={(e) => handleSlotClick(slot, e)}
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

                    {/* Language */}
                    {slot.language && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-600">
                          {slot.language === "ENGLISH"
                            ? "Tiếng Anh"
                            : "Tiếng Trung"}
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
                    : selectedDate
                    ? `Không có lịch đã tạo cho ngày ${selectedDate.getDate()}/${
                        selectedDate.getMonth() + 1
                      }/${selectedDate.getFullYear()}`
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
          {/* Chọn ngôn ngữ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngôn ngữ <span className="text-red-500">*</span>
            </label>
            <Select
              value={newTimeslot.language}
              onChange={(value) =>
                setNewTimeslot({ ...newTimeslot, language: value })
              }
              placeholder="Chọn ngôn ngữ"
              className="w-full"
              options={[
                {
                  value: "ENGLISH",
                  label: (
                    <div className="flex items-center gap-2">
                      <span>Tiếng Anh</span>
                    </div>
                  ),
                },
                {
                  value: "CHINESE",
                  label: (
                    <div className="flex items-center gap-2">
                      <span>Tiếng Trung</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>

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
            <p className="text-xs text-gray-500 mt-1">
              Thời gian học: 1 giờ (kết thúc tự động sau 1 giờ)
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
        destroyOnClose={true}
        maskClosable={false}
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
          </div>
        )}
      </Modal>

      {/* Modal chi tiết lịch học cho mentor */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-900" />
            <span>Chi tiết lịch học</span>
          </div>
        }
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={500}
      >
        {selectedSlotDetail && (
          <div className="space-y-4 mt-4">
            {/* Thông tin lịch học */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {/* Tiêu đề */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Tiêu đề</p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedSlotDetail.title}
                </p>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ngày học</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedSlotDetail.date.getDate()}/
                    {selectedSlotDetail.date.getMonth() + 1}/
                    {selectedSlotDetail.date.getFullYear()}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Thời gian</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedSlotDetail.time}
                  </p>
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSlotDetail.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`
                        inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full
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

              {/* Link phòng học (nếu có) */}
              {selectedSlotDetail.linkUrlRoom && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Link phòng học</p>
                  <a
                    href={`/meeting/${selectedSlotDetail.linkUrlRoom}`}
                    className="text-sm text-purple-600 hover:text-purple-800 underline break-all"
                  >
                    {selectedSlotDetail.linkUrlRoom}
                  </a>
                </div>
              )}
            </div>

            {/* Nút bắt đầu học - chỉ hiện khi chưa có link và đến giờ học */}
            {!selectedSlotDetail.linkUrlRoom &&
              canStartMeeting(selectedSlotDetail) && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900 mb-3">
                    Đã đến giờ học! Bạn có thể bắt đầu buổi học bằng cách tạo
                    phòng học.
                  </p>
                  <button
                    onClick={handleStartMeeting}
                    disabled={startMeetingLoading}
                    className="w-full px-4 py-2.5 bg-purple-900 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {startMeetingLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang tạo phòng học...
                      </span>
                    ) : (
                      "Bắt đầu học"
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Phòng học sẽ tự động kết thúc sau 1 tiếng
                  </p>
                </div>
              )}

            {/* Thông báo nếu chưa đến giờ */}
            {!selectedSlotDetail.linkUrlRoom &&
              !canStartMeeting(selectedSlotDetail) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 text-center">
                    Bạn chỉ có thể bắt đầu học trước 15 phút và trong vòng 1
                    tiếng sau giờ bắt đầu
                  </p>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarSchedule;
