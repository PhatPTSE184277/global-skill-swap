import React, { useState, useCallback } from "react";
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
import { useSelector } from "react-redux";
import apiService from "../../../services/apiService";
import { authSelector } from "../../../reduxs/reducers/AuthReducer";

const CreateRoomModal = ({ visible, onCancel, onRoomCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);

  // Lấy auth data từ Redux store
  const authData = useSelector(authSelector);

  // Lấy thông tin user từ localStorage hoặc Redux store
  const getCurrentUser = useCallback(() => {
    try {
      console.log("🔍 getCurrentUser called");

      // Kiểm tra tất cả keys có thể có trong localStorage
      const possibleKeys = [
        "authData",
        "auth",
        "user",
        "userData",
        "loginData",
      ];

      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`📦 Found data in localStorage key "${key}":`, data);
          try {
            const parsed = JSON.parse(data);
            console.log(`📦 Parsed data from "${key}":`, parsed);

            // Thử lấy user ID từ nhiều trường có thể
            const userId =
              parsed._id ||
              parsed.id ||
              parsed.user_id ||
              parsed.user?.id ||
              parsed.user?._id ||
              parsed.user?.user_id ||
              parsed.data?._id ||
              parsed.data?.id ||
              parsed.data?.user_id;

            if (userId) {
              console.log(`✅ Found userId "${userId}" in key "${key}"`);

              const userInfo = {
                id: userId,
                username:
                  parsed.username ||
                  parsed.user?.username ||
                  parsed.data?.username,
                fullName:
                  parsed.fullName ||
                  parsed.full_name ||
                  parsed.user?.fullName ||
                  parsed.user?.full_name ||
                  parsed.data?.fullName ||
                  parsed.data?.full_name,
                email: parsed.email || parsed.user?.email || parsed.data?.email,
                token:
                  parsed.token ||
                  parsed.access_token ||
                  parsed.accessToken ||
                  parsed.user?.token ||
                  parsed.data?.token,
              };

              console.log(
                `✅ Final userInfo from localStorage "${key}":`,
                userInfo
              );
              return userInfo;
            }
          } catch (parseError) {
            console.warn(`⚠️ Failed to parse data from "${key}":`, parseError);
          }
        }
      }

      // Fallback: lấy từ Redux store
      console.log("🔄 Checking Redux authData:", authData);
      if (authData && (authData._id || authData.id)) {
        const userInfo = {
          id: authData._id || authData.id,
          username: authData.username,
          fullName:
            authData.fullName || authData.full_name || authData.username,
          email: authData.email,
          token: authData.token,
        };

        console.log("✅ Final userInfo from Redux:", userInfo);
        return userInfo;
      }

      console.log("❌ No valid user data found anywhere");
      return null;
    } catch (error) {
      console.error("❌ Error in getCurrentUser:", error);
      return null;
    }
  }, [authData]);

  // Auto-fill form khi modal mở
  React.useEffect(() => {
    if (visible) {
      // Debug: Kiểm tra tất cả auth states
      console.log("=== AUTH DEBUG ===");
      console.log("Redux authData:", authData);
      console.log("localStorage authData:", localStorage.getItem("authData"));
      console.log("localStorage keys:", Object.keys(localStorage));

      const currentUser = getCurrentUser();
      console.log("getCurrentUser result:", currentUser);

      if (currentUser) {
        console.log("✅ User found, setting form defaults");
        // Chỉ set giá trị mặc định cho form, không hiển thị các field ẩn
        form.setFieldsValue({
          roomName: "",
          startTime: null,
          meetingPassword: "",
          notes: "",
        });
      } else {
        console.log("❌ No user found");
        message.warning("Vui lòng đăng nhập để tạo phòng!");
      }
    }
  }, [visible, form, getCurrentUser, authData]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      console.log("Current user for room creation:", currentUser);

      if (!currentUser) {
        message.error("Vui lòng đăng nhập để tạo phòng!");
        return;
      }

      if (!currentUser.id) {
        message.error(
          "Không thể lấy thông tin user ID. Vui lòng đăng nhập lại!"
        );
        console.error("User ID is missing:", currentUser);
        return;
      }

      // Xử lý logic thời gian
      const now = new Date();
      let startTime, endTime, status;

      if (values.startTime) {
        // Nếu có thời gian bắt đầu -> lên lịch
        startTime = new Date(values.startTime);
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour
        status = "scheduled";
      } else {
        // Nếu không có thời gian -> bắt đầu ngay
        startTime = now;
        endTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
        status = "ongoing";
      }

      // Tạo room data với thông tin user từ localStorage
      const roomData = {
        room_name: values.roomName || "Phòng học mới",
        mentor_id: parseInt(currentUser.id), // Đảm bảo là số
        user_id: parseInt(currentUser.id), // Đảm bảo là số
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: status,
        details: {
          meeting_link: null, // Sẽ được tạo sau
          meeting_password: values.meetingPassword || null,
          notes: values.notes || null,
          recorded_url: null,
        },
        participants: [],
        creator_name: currentUser.fullName || currentUser.username,
      };

      console.log("Creating room with data:", roomData);

      const response = await apiService.createMeetingRoom(roomData);
      console.log("Room created response:", response);

      // Extract room data from response
      const roomResult = response.data?.room || response.data || response;

      setCreatedRoom(roomResult);

      // Thông báo dựa trên trạng thái
      if (roomResult.status === "scheduled") {
        message.success(
          `✅ Tạo phòng thành công! Phòng đã được lên lịch vào lúc ${new Date(
            roomResult.start_time
          ).toLocaleString("vi-VN")}`
        );
      } else {
        message.success(
          "✅ Tạo phòng thành công! Phòng đang sẵn sàng cho cuộc học."
        );
      }

      // Tạo meeting link để redirect
      const userForRedirect = getCurrentUser();
      const redirectLink = `${window.location.origin}/meeting/${
        roomResult.id
      }?userName=${encodeURIComponent(
        userForRedirect?.fullName || userForRedirect?.username || "Anonymous"
      )}`;

      if (onRoomCreated) {
        onRoomCreated({
          ...roomResult,
          meetingLink: redirectLink,
          userName:
            userForRedirect?.fullName ||
            userForRedirect?.username ||
            "Anonymous",
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
      const userForCopy = getCurrentUser();
      const userName =
        userForCopy?.fullName || userForCopy?.username || "Anonymous";
      const copyLink = `${window.location.origin}/meeting/${
        createdRoom.id
      }?userName=${encodeURIComponent(userName)}`;
      navigator.clipboard.writeText(copyLink);
      message.success("Đã copy link phòng học!");
    }
  };

  return (
    <Modal
      title="� Tạo Phòng Học Mới"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="roomName"
          label="Tên phòng học"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input
            prefix={<Users size={16} />}
            placeholder="Nhập tên phòng học"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Thời gian bắt đầu (Bỏ trống để bắt đầu ngay)"
        >
          <DatePicker
            showTime
            placeholder="Chọn thời gian bắt đầu"
            size="large"
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
            disabledDate={(current) =>
              current && current < new Date().setHours(0, 0, 0, 0)
            }
          />
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
            placeholder="Thêm ghi chú về cuộc học..."
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

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "0 40px",
              height: "45px",
            }}
          >
            {loading ? "Đang tạo phòng..." : "🚀 Tạo Phòng Học"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
