import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  InputNumber,
  Button,
} from "antd";
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  User,
  Calendar,
  Settings,
  Eye,
  DollarSign,
  Mail,
  CheckCircle,
  XCircle,
  Circle
} from "lucide-react";

const MentorSchedule = ({ userId, isOwner = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  // Debug log
  console.log("Debug MentorSchedule:", { userId, isOwner });

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

  // Fake data: khung giờ theo ngày với thông tin booking (demo)
  const timeSlotsByDate = {
    "2025-07-05": [
      {
        id: 1,
        label: "Khung giờ 1",
        time: "9:00 AM - 10:00 AM",
        status: "available", // available, booked, completed
        bookedBy: null,
        price: 100000,
      },
      {
        id: 2,
        label: "Khung giờ 2",
        time: "10:00 AM - 11:00 AM",
        status: "booked",
        bookedBy: {
          id: 123,
          name: "Nguyễn Văn A",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          email: "nguyenvana@email.com",
        },
        price: 100000,
      },
    ],
    "2025-07-06": [
      {
        id: 3,
        label: "Khung giờ 3",
        time: "11:00 AM - 12:00 PM",
        status: "completed",
        bookedBy: {
          id: 124,
          name: "Trần Thị B",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          email: "tranthib@email.com",
        },
        price: 100000,
      },
      {
        id: 4,
        label: "Khung giờ 4",
        time: "1:00 PM - 2:00 PM",
        status: "available",
        bookedBy: null,
        price: 100000,
      },
      {
        id: 5,
        label: "Khung giờ 5",
        time: "2:00 PM - 3:00 PM",
        status: "available",
        bookedBy: null,
        price: 100000,
      },
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Các khung giờ học</h2>
          {isOwner && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-800 transition"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
              Tạo khung giờ
            </button>
          )}
        </div>
        <div className="space-y-3">
          {getSlotsForDate(selectedDate).length > 0 ? (
            getSlotsForDate(selectedDate).map((slot) => (
              <div
                key={slot.id}
                className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{slot.label}</h4>
                    {slot.status === "booked" && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        Đã có người đặt
                      </span>
                    )}
                    {slot.status === "completed" && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        Hoàn thành
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{slot.time}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isOwner ? (
                    <>
                      <button
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setShowDetailModal(true);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    slot.status === "available" ? (
                      <button
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                        onClick={() => navigate("/paymentconfirmation")}
                      >
                        Đặt
                      </button>
                    ) : (
                      <span className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg font-medium">
                        {slot.status === "booked" ? "Đã đặt" : "Hết hạn"}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có khung giờ cho ngày này</p>
              {isOwner && (
                <button
                  className="mt-2 text-purple-600 hover:text-purple-800"
                  onClick={() => setShowCreateModal(true)}
                >
                  Tạo khung giờ đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal tạo khung giờ mới - Custom Design */}
      <Modal
        title={null}
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width={600}
        centered
        closable={false}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, borderRadius: "12px" },
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Plus className="text-purple-600" size={24} />
              Tạo khung giờ mới
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          <Form
            form={createForm}
            onFinish={(values) => {
              console.log("Form values:", values);
              // TODO: Handle form submission
              setShowCreateModal(false);
              createForm.resetFields();
            }}
            initialValues={{
              price: 100000,
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Calendar size={16} className="text-purple-600" />
                Ngày
              </label>
              <Form.Item
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
                className="mb-0"
              >
                <DatePicker
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 hover:border-purple-400 transition-colors"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  size="large"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Clock size={16} className="text-purple-600" />
                  Giờ bắt đầu
                </label>
                <Form.Item
                  name="startTime"
                  rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                  className="mb-0"
                >
                  <TimePicker
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 hover:border-purple-400 transition-colors"
                    format="HH:mm"
                    placeholder="Chọn giờ"
                    size="large"
                  />
                </Form.Item>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Clock size={16} className="text-purple-600" />
                  Giờ kết thúc
                </label>
                <Form.Item
                  name="endTime"
                  rules={[{ required: true, message: "Vui lòng chọn giờ!" }]}
                  className="mb-0"
                >
                  <TimePicker
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 hover:border-purple-400 transition-colors"
                    format="HH:mm"
                    placeholder="Chọn giờ"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Edit3 size={16} className="text-purple-600" />
                Mô tả (tùy chọn)
              </label>
              <Form.Item name="description" className="mb-0">
                <Input.TextArea
                  className="border-2 border-gray-200 rounded-lg focus:border-purple-500 hover:border-purple-400 transition-colors resize-none"
                  rows={4}
                  placeholder="Mô tả về buổi học, nội dung, yêu cầu..."
                  style={{ padding: "12px 16px" }}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200 flex items-center gap-2"
                onClick={() => setShowCreateModal(false)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-purple-950 hover:bg-purple-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition duration-200 transform hover:scale-105 flex items-center gap-2"
                onClick={() => createForm.submit()}
              >
                <Plus size={16} />
                Tạo khung giờ
              </button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal chi tiết booking - Custom Design */}
      <Modal
        title={null}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={550}
        centered
        closable={false}
        styles={{
          body: { padding: 0 },
          content: { padding: 0, borderRadius: "12px" },
        }}
      >
        {selectedSlot && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Eye className="text-purple-600" size={24} />
                Chi tiết khung giờ
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={24} className="text-purple-600" />
                  <span className="font-bold text-xl text-gray-800">
                    {selectedSlot.time}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={20} className="text-gray-500" />
                  <span className="text-gray-600 font-medium">Trạng thái:</span>
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-1 ${
                      selectedSlot.status === "available"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : selectedSlot.status === "booked"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {selectedSlot.status === "available" && (
                      <Circle size={14} className="text-green-600" />
                    )}
                    {selectedSlot.status === "booked" && <Clock size={14} className="text-blue-600" />}
                    {selectedSlot.status === "completed" && (
                      <CheckCircle size={14} className="text-gray-600" />
                    )}
                    {selectedSlot.status === "available"
                      ? "Có thể đặt"
                      : selectedSlot.status === "booked"
                      ? "Đã đặt"
                      : "Hoàn thành"}
                  </span>
                </div>

                
              </div>

              {selectedSlot.bookedBy && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-bold mb-4 text-blue-800 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Thông tin người đặt
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={selectedSlot.bookedBy.avatar}
                        alt={selectedSlot.bookedBy.name}
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-800 mb-1">
                        {selectedSlot.bookedBy.name}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        {selectedSlot.bookedBy.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200 flex items-center gap-2"
                onClick={() => setShowDetailModal(false)}
              >
                <XCircle size={16} />
                Đóng
              </button>
             
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MentorSchedule;
