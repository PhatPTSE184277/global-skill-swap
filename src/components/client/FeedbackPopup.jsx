import React, { useState, useEffect } from "react";
import { Modal, Rate, Input, Select, Button, message, Result } from "antd";
import {
  MessageSquare,
  Send,
  Video,
  UserCheck,
  BookOpen,
  Bot,
  Settings,
  Lightbulb,
} from "lucide-react";
import feedbackService from "../../services/feedbackService";
import userService from "../../services/userService";

const { TextArea } = Input;

const FeedbackPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    moduleType: "system",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const services = [
    {
      value: "meeting_room",
      label: (
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          <span>Phòng Họp</span>
        </div>
      ),
    },
    {
      value: "mentor",
      label: (
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span>Mentor</span>
        </div>
      ),
    },
    {
      value: "course",
      label: (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Khóa Học</span>
        </div>
      ),
    },
    {
      value: "chatbot",
      label: (
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          <span>Chatbot AI</span>
        </div>
      ),
    },
    {
      value: "system",
      label: (
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Hệ Thống</span>
        </div>
      ),
    },
    {
      value: "other",
      label: (
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <span>Khác</span>
        </div>
      ),
    },
  ];

  // Fetch user ID from /user/me API
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await userService.getCurrentUser();
        console.log("User data from API:", userData);

        // Try multiple possible response structures
        const userId = userData?.id || userData?.data?.id;

        if (userId) {
          setCurrentUserId(userId);
        } else {
          // Fallback to localStorage
          const authData = localStorage.getItem("authData");
          if (authData) {
            const parsedAuth = JSON.parse(authData);
            const fallbackUserId = parsedAuth?.user?.id || parsedAuth?.id;
            if (fallbackUserId) {
              setCurrentUserId(fallbackUserId);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
        // Try to get from localStorage as fallback
        const authData = localStorage.getItem("authData");
        if (authData) {
          try {
            const parsedAuth = JSON.parse(authData);
            const fallbackUserId = parsedAuth?.user?.id || parsedAuth?.id;
            if (fallbackUserId) {
              setCurrentUserId(fallbackUserId);
            }
          } catch (e) {
            console.error("Failed to parse authData:", e);
          }
        }
      }
    };

    if (isOpen) {
      fetchUserId();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!formData.moduleType || formData.rating === 0) {
      message.warning("Vui lòng chọn dịch vụ và đánh giá!");
      return;
    }

    if (!currentUserId) {
      message.error("Không thể xác định người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        module_type: formData.moduleType,
        module_id: null, // null cho feedback chung, hoặc có thể là số nếu có specific module
        user_id: currentUserId,
        rating: formData.rating,
        comment: formData.comment.trim(),
      };

      console.log("Sending feedback data:", feedbackData);

      const response = await feedbackService.createFeedback(feedbackData);

      if (response.success) {
        setSuccess(true);
        message.success("Đánh giá của bạn đã được gửi thành công!");
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Feedback error:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ moduleType: "system", rating: 0, comment: "" });
    setSuccess(false);
    onClose();
  };

  const ratingDescriptions = {
    1: "😞 Rất tệ",
    2: "😐 Tệ",
    3: "😊 Bình thường",
    4: "😄 Tốt",
    5: "🤩 Xuất sắc",
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-purple-900">
            Đánh Giá Dịch Vụ
          </span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={600}
      centered
      destroyOnClose
    >
      {success ? (
        <Result
          status="success"
          title="Cảm ơn bạn!"
          subTitle="Đánh giá của bạn đã được gửi thành công"
        />
      ) : (
        <div className="space-y-5 pt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn dịch vụ bạn muốn đánh giá{" "}
              <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.moduleType}
              onChange={(value) =>
                setFormData({ ...formData, moduleType: value })
              }
              options={services}
              size="large"
              className="w-full"
              placeholder="Chọn dịch vụ"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bạn đánh giá như thế nào? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg">
              <Rate
                value={formData.rating}
                onChange={(value) =>
                  setFormData({ ...formData, rating: value })
                }
                style={{ fontSize: "36px" }}
                className="text-yellow-400"
              />
              {formData.rating > 0 && (
                <span className="text-sm font-medium text-purple-900">
                  {ratingDescriptions[formData.rating]}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhận xét của bạn (Tùy chọn)
            </label>
            <TextArea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
              rows={4}
              maxLength={500}
              showCount
              size="large"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleClose} size="large" className="flex-1">
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={formData.rating === 0}
              size="large"
              icon={<Send className="w-4 h-4" />}
              className="flex-1 bg-purple-900 hover:bg-purple-800"
              style={{ backgroundColor: "#581c87" }}
            >
              Gửi Đánh Giá
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FeedbackPopup;
