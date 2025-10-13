import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiX,
  FiHome,
  FiRefreshCw,
  FiArrowLeft,
  FiAlertTriangle,
} from "react-icons/fi";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin lỗi từ query params hoặc state
  const searchParams = new URLSearchParams(location.search);
  const errorCode = searchParams.get("error");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Log thông tin hủy thanh toán để debug
    console.log("Payment cancelled:", {
      errorCode,
      errorMessage,
      orderId,
      timestamp: new Date().toISOString(),
    });
  }, [errorCode, errorMessage, orderId]);

  const getErrorMessage = () => {
    switch (errorCode) {
      case "USER_CANCELLED":
        return "Bạn đã hủy giao dịch thanh toán";
      case "PAYMENT_TIMEOUT":
        return "Giao dịch đã hết hạn";
      case "INSUFFICIENT_FUNDS":
        return "Số dư trong tài khoản không đủ";
      case "PAYMENT_FAILED":
        return "Thanh toán thất bại";
      case "NETWORK_ERROR":
        return "Lỗi kết nối mạng";
      default:
        return errorMessage || "Có lỗi xảy ra trong quá trình thanh toán";
    }
  };

  const getErrorIcon = () => {
    switch (errorCode) {
      case "USER_CANCELLED":
        return FiX;
      case "PAYMENT_TIMEOUT":
        return FiRefreshCw;
      default:
        return FiAlertTriangle;
    }
  };

  const retryPayment = () => {
    // Quay lại trang thanh toán với thông tin cũ
    navigate("/payment", {
      state: location.state,
    });
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToHome = () => {
    navigate("/");
  };

  const ErrorIcon = getErrorIcon();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ErrorIcon className="w-12 h-12 text-white" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-red-600 mb-4"
          >
            Thanh toán không thành công
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            {getErrorMessage()}
          </motion.p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Chi tiết lỗi
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{getErrorMessage()}</p>
                  {orderId && (
                    <p className="mt-1">
                      Mã đơn hàng: <span className="font-mono">{orderId}</span>
                    </p>
                  )}
                  <p className="mt-1">
                    Thời gian: {new Date().toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Possible Solutions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Giải pháp khắc phục
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-800">
                    Kiểm tra thông tin thanh toán
                  </p>
                  <p className="text-sm text-blue-600">
                    Đảm bảo số dư tài khoản đủ và thông tin thanh toán chính xác
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    Thử lại thanh toán
                  </p>
                  <p className="text-sm text-green-600">
                    Quay lại trang thanh toán và thử với phương thức khác
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-purple-800">Liên hệ hỗ trợ</p>
                  <p className="text-sm text-purple-600">
                    Nếu vấn đề vẫn tiếp tục, hãy liên hệ đội ngũ hỗ trợ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Cần hỗ trợ?</h4>
            <p className="text-sm text-gray-600 mb-2">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <a
                href="mailto:support@globalskillswap.com"
                className="text-blue-600 hover:underline"
              >
                📧 support@globalskillswap.com
              </a>
              <a
                href="tel:+84901234567"
                className="text-blue-600 hover:underline"
              >
                📞 +84 90 123 4567
              </a>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={retryPayment}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all"
          >
            <FiRefreshCw className="mr-2" />
            Thử lại thanh toán
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToRegister}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại đăng ký
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToHome}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
          >
            <FiHome className="mr-2" />
            Về trang chủ
          </motion.button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>Đừng lo lắng! Bạn có thể thử lại thanh toán bất cứ lúc nào.</p>
          <p className="mt-1">
            Thông tin đăng ký của bạn vẫn được lưu trữ an toàn.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;
