import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  Card,
  message,
  Modal,
  DatePicker,
  Select,
} from "antd";
import { User, Users, Calendar, Link, Clock, FileText } from "lucide-react";
import apiService from "../../../services/apiService";

const CreateRoomModal = ({ visible, onCancel, onRoomCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Xử lý logic thời gian
      const now = new Date();
      const startTime = values.startTime ? new Date(values.startTime) : now;

      // Nếu không có endTime, tự động +1 giờ từ startTime
      let endTime = null;
      if (values.endTime) {
        endTime = new Date(values.endTime);
      } else if (values.startTime) {
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour
      }

      // Tạo room data KHÔNG có meeting_link ban đầu
      const roomData = {
        room_name: values.roomName || "Meeting Room",
        mentor_id: parseInt(values.mentorId) || 1,
        user_id: parseInt(values.userId) || 2,
        start_time: startTime.toISOString(),
        end_time: endTime ? endTime.toISOString() : null,
        status: values.status || "scheduled",
        details: {
          meeting_link: null, // Sẽ được tạo sau
          meeting_password: values.meetingPassword || null,
          notes: values.notes || null,
          recorded_url: null,
        },
        participants: [],
      };

      console.log("Creating room with data:", roomData);

      const response = await apiService.createMeetingRoom(roomData);
      console.log("Room created response:", response);

      // Extract room data from response
      const roomResult = response.data?.room || response.data || response;

      setCreatedRoom(roomResult);
      message.success(
        "✅ Tạo phòng thành công! Meeting link đã được tự động tạo."
      );

      // Tạo meeting link để redirect (backend đã tự tạo link rồi)
      const redirectLink = `${window.location.origin}/meeting/${
        roomResult.id
      }?userName=${encodeURIComponent(values.userName || "Anonymous")}`;

      if (onRoomCreated) {
        onRoomCreated({
          ...roomResult,
          meetingLink: redirectLink,
          userName: values.userName || "Anonymous",
        });
      }

      form.resetFields();
    } catch (error) {
      console.error("Error creating room:", error);
      message.error(`Lỗi tạo phòng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = () => {
    if (createdRoom) {
      const userName = form.getFieldValue("userName");
      const copyLink = `${window.location.origin}/meeting/${
        createdRoom.id
      }?userName=${encodeURIComponent(userName)}`;
      navigator.clipboard.writeText(copyLink);
      message.success("Đã copy link meeting!");
    }
  };

  return (
    <Modal
      title="🎥 Tạo Phòng Meeting"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          mentorId: 1,
          userId: 2,
          status: "scheduled",
        }}
      >
        <Form.Item name="userName" label="Tên người dùng">
          <Input
            prefix={<User size={16} />}
            placeholder="Nhập tên của bạn"
            size="large"
          />
        </Form.Item>

        <Form.Item name="roomName" label="Tên phòng meeting">
          <Input
            prefix={<Users size={16} />}
            placeholder="Nhập tên phòng meeting"
            size="large"
          />
        </Form.Item>

        <Form.Item name="mentorId" label="Mentor ID">
          <Input type="number" placeholder="ID của mentor" size="large" />
        </Form.Item>

        <Form.Item name="userId" label="User ID">
          <Input type="number" placeholder="ID của user" size="large" />
        </Form.Item>

        <Form.Item name="startTime" label="Thời gian bắt đầu">
          <DatePicker
            showTime
            placeholder="Chọn thời gian bắt đầu"
            size="large"
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
          />
        </Form.Item>

        <Form.Item
          name="endTime"
          label="Thời gian kết thúc (tự động +1h nếu bỏ trống)"
        >
          <DatePicker
            showTime
            placeholder="Chọn thời gian kết thúc"
            size="large"
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
          />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select size="large" placeholder="Chọn trạng thái">
            <Select.Option value="scheduled">Đã lên lịch</Select.Option>
            <Select.Option value="ongoing">Đang diễn ra</Select.Option>
            <Select.Option value="completed">Đã kết thúc</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="meetingPassword" label="Mật khẩu phòng (tùy chọn)">
          <Input.Password
            placeholder="Nhập mật khẩu bảo vệ phòng"
            size="large"
          />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú (tùy chọn)">
          <Input.TextArea
            rows={3}
            placeholder="Thêm ghi chú về cuộc họp..."
            size="large"
          />
        </Form.Item>

        {createdRoom && (
          <Card
            size="small"
            title="✅ Phòng đã được tạo thành công!"
            style={{
              marginBottom: 16,
              backgroundColor: "#f6ffed",
              borderColor: "#b7eb8f",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <p>
                <strong>📝 Tên phòng:</strong> {createdRoom.room_name}
              </p>
              <p>
                <strong>🆔 Room ID:</strong> {createdRoom.id}
              </p>
              <p>
                <strong>📊 Trạng thái:</strong> {createdRoom.status}
              </p>
              {createdRoom.start_time && (
                <p>
                  <strong>⏰ Bắt đầu:</strong>{" "}
                  {new Date(createdRoom.start_time).toLocaleString("vi-VN")}
                </p>
              )}
              {createdRoom.end_time && (
                <p>
                  <strong>⏰ Kết thúc:</strong>{" "}
                  {new Date(createdRoom.end_time).toLocaleString("vi-VN")}
                </p>
              )}
              {createdRoom.meetingroomdetails?.[0]?.meeting_password && (
                <p>
                  <strong>🔒 Mật khẩu:</strong>{" "}
                  {createdRoom.meetingroomdetails[0].meeting_password}
                </p>
              )}
              {createdRoom.meetingroomdetails?.[0]?.notes && (
                <div>
                  <strong>📄 Ghi chú:</strong>
                  <div
                    style={{
                      marginTop: "4px",
                      padding: "8px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "4px",
                    }}
                  >
                    {createdRoom.meetingroomdetails[0].notes}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                icon={<Link size={16} />}
                onClick={copyMeetingLink}
                block
              >
                📋 Copy Link Meeting
              </Button>
            </div>
          </Card>
        )}

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Calendar size={16} />}
            >
              Tạo Phòng
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
