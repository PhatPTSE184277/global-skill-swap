import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";

export default function Schedule() {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Meeting",
      start: "2025-09-08T12:30",
      description: "Họp nhóm",
      taskType: "Công việc",
    },
    {
      id: "2",
      title: "Deadline",
      start: "2025-09-12T09:00",
      description: "Nộp báo cáo",
      taskType: "Học tập",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // state khi tạo mới
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("Việc cần làm của tôi");
  const [time, setTime] = useState(dayjs("12:30", "HH:mm"));

  // state khi xem/sửa
  const [currentEvent, setCurrentEvent] = useState(null);

  // Khi click vào ngày -> mở modal tạo mới
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setIsCreateOpen(true);
  };

  // Lưu sự kiện mới
  const handleSave = () => {
    if (!title || !selectedDate) return;

    const newEvent = {
      id: String(events.length + 1),
      title,
      start: `${selectedDate}T${time.format("HH:mm")}`,
      description,
      taskType,
    };

    setEvents([...events, newEvent]);

    // reset form
    setIsCreateOpen(false);
    setTitle("");
    setDescription("");
    setTaskType("Việc cần làm của tôi");
    setTime(dayjs("12:30", "HH:mm"));
  };

  // Khi click vào event -> mở modal chi tiết
  const handleEventClick = (info) => {
    const ev = events.find((e) => e.id === info.event.id);
    setCurrentEvent(ev);
    setIsDetailOpen(true);
  };

  // Cập nhật sự kiện
  const handleUpdate = () => {
    setEvents(events.map((e) => (e.id === currentEvent.id ? currentEvent : e)));
    setIsDetailOpen(false);
  };

  // Xóa sự kiện
  const handleDelete = () => {
    setEvents(events.filter((e) => e.id !== currentEvent.id));
    setIsDetailOpen(false);
  };

  return (
    <div className="pt-6 bg-white rounded-2xl shadow-lg">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="80vh"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek", // đã bỏ tab Day
        }}
      />

      {/* Modal tạo sự kiện */}
      <Modal
        title="Tạo lịch mới"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        footer={null}
      >
        <div className="space-y-4">
          <Input
            placeholder="Nhập tiêu đề sự kiện"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            placeholder="Thêm nội dung mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            value={taskType}
            onChange={setTaskType}
            className="w-full"
            options={[
              { value: "Việc cần làm của tôi", label: "Việc cần làm của tôi" },
              { value: "Công việc", label: "Công việc" },
              { value: "Học tập", label: "Học tập" },
            ]}
          />
          <div className="flex gap-2">
            <DatePicker
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) => setSelectedDate(date.format("YYYY-MM-DD"))}
              className="w-1/2"
            />
            <TimePicker
              value={time}
              onChange={setTime}
              format="HH:mm"
              className="w-1/2"
            />
          </div>
          <Button type="primary" onClick={handleSave} className="w-full">
            Lưu
          </Button>
        </div>
      </Modal>

      {/* Modal chi tiết sự kiện */}
      <Modal
        title="Chi tiết sự kiện"
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
      >
        {currentEvent && (
          <div className="space-y-4">
            <Input
              value={currentEvent.title}
              onChange={(e) =>
                setCurrentEvent({ ...currentEvent, title: e.target.value })
              }
            />
            <Input.TextArea
              value={currentEvent.description}
              onChange={(e) =>
                setCurrentEvent({
                  ...currentEvent,
                  description: e.target.value,
                })
              }
            />
            <Select
              value={currentEvent.taskType}
              onChange={(val) =>
                setCurrentEvent({ ...currentEvent, taskType: val })
              }
              className="w-full"
              options={[
                {
                  value: "Việc cần làm của tôi",
                  label: "Việc cần làm của tôi",
                },
                { value: "Công việc", label: "Công việc" },
                { value: "Học tập", label: "Học tập" },
              ]}
            />
            <div className="flex gap-2">
              <DatePicker
                value={dayjs(currentEvent.start)}
                onChange={(date) =>
                  setCurrentEvent({
                    ...currentEvent,
                    start: `${date.format("YYYY-MM-DD")}T${dayjs(
                      currentEvent.start
                    ).format("HH:mm")}`,
                  })
                }
                className="w-1/2"
              />
              <TimePicker
                value={dayjs(currentEvent.start)}
                onChange={(t) =>
                  setCurrentEvent({
                    ...currentEvent,
                    start: `${dayjs(currentEvent.start).format(
                      "YYYY-MM-DD"
                    )}T${t.format("HH:mm")}`,
                  })
                }
                format="HH:mm"
                className="w-1/2"
              />
            </div>
            <div className="flex gap-2">
              <Button type="primary" onClick={handleUpdate} className="flex-1">
                Cập nhật
              </Button>
              <Button danger onClick={handleDelete} className="flex-1">
                Xóa
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
  