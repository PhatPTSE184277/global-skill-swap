import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiHome } from "react-icons/fi";

const CVSubmitSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registrationData } = location.state || {};

  useEffect(() => {
    // Nếu không có data, chuyển về trang chủ
    if (!registrationData) {
      navigate("/");
    }
  }, [registrationData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center mb-4"
          >
            <div className="bg-green-100 rounded-full p-3">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            Gửi CV thành công!
          </h1>
          <p className="text-sm text-center text-gray-600 mb-4">
            Cảm ơn bạn đã quan tâm trở thành Mentor
          </p>

          {/* Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-800 leading-relaxed">
              CV của bạn đã được gửi thành công. Chúng tôi sẽ xem xét hồ sơ và
              phản hồi qua email <strong>{registrationData?.email}</strong>{" "}
              trong vòng 24-48 giờ.
            </p>
          </div>

          {/* Next steps */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-gray-900 mb-2">
              Các bước tiếp theo:
            </p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-1.5">✓</span>
                <span>Đội ngũ sẽ xem xét CV và thông tin của bạn</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-1.5">✓</span>
                <span>Nhận email thông báo kết quả</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-1.5">✓</span>
                <span>
                  Nếu được chấp nhận, bạn có thể bắt đầu chia sẻ kiến thức
                </span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FiHome className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium border border-gray-300 transition-colors"
            >
              Xem hồ sơ
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Có thắc mắc? Liên hệ{" "}
            <a
              href="mailto:support@globalskillswap.com"
              className="text-green-600 hover:underline"
            >
              support@globalskillswap.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CVSubmitSuccess;
