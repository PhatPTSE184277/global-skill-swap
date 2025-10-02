import React, { useState } from "react";
import { Button, Input, Form, Card, message, Modal } from "antd";
import { User, Users, Calendar, Link } from "lucide-react";
import apiService from "../../../services/apiService";

const CreateRoomModal = ({ visible, onCancel, onRoomCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const roomData = {
        room_name: values.roomName,
        mentor_id: values.mentorId || 1, // Default mentor ID
        user_id: values.userId || 2, // Default user ID
        start_time: new Date().toISOString(),
        status: "scheduled",
      };

      const response = await apiService.createMeetingRoom(roomData);

      message.success("Tạo phòng thành công!");
      setCreatedRoom(response);

      // Generate meeting link
      const meetingLink = `${window.location.origin}/meeting/${
        response.id
      }?userName=${encodeURIComponent(values.userName)}`;

      if (onRoomCreated) {
        onRoomCreated({
          ...response,
          meetingLink,
          userName: values.userName,
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
      const meetingLink = `${window.location.origin}/meeting/${
        createdRoom.id
      }?userName=${encodeURIComponent(userName)}`;
      navigator.clipboard.writeText(meetingLink);
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
        }}
      >
        <Form.Item
          name="userName"
          label="Tên người dùng"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input
            prefix={<User size={16} />}
            placeholder="Nhập tên của bạn"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="roomName"
          label="Tên phòng meeting"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
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
            <p>
              <strong>Tên phòng:</strong> {createdRoom.room_name}
            </p>
            <p>
              <strong>Room ID:</strong> {createdRoom.id}
            </p>
            <p>
              <strong>Status:</strong> {createdRoom.status}
            </p>

            <div style={{ marginTop: 12 }}>
              <Button
                type="primary"
                icon={<Link size={16} />}
                onClick={copyMeetingLink}
                block
              >
                Copy Link Meeting
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
