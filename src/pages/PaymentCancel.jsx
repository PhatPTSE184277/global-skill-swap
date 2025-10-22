import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();

  // Lấy thông tin lỗi từ query params hoặc state
  const errorCode = searchParams.get("error");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  // Lấy thông tin VNPay từ URL parameters
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const vnpTxnRef = searchParams.get("vnp_TxnRef");
  const vnpAmount = searchParams.get("vnp_Amount");
  const vnpBankCode = searchParams.get("vnp_BankCode");
  const vnpOrderInfo = searchParams.get("vnp_OrderInfo");

  // Lấy thông tin về loại thanh toán từ state
  const {
    paymentType,
    registrationData,
    bookingData,
    paymentStatus,
    transactionId,
    errorCode: stateErrorCode,
    urlParams,
  } = location.state || {};

  // Xác định final values
  const finalErrorCode = stateErrorCode || vnpResponseCode || errorCode;
  const finalTransactionId = transactionId || vnpTxnRef || orderId;

  useEffect(() => {
    // Log thông tin hủy thanh toán để debug
    console.log("Payment cancelled:", {
      errorCode,
      errorMessage,
      orderId,
      paymentType,
      timestamp: new Date().toISOString(),
    });
  }, [errorCode, errorMessage, orderId, paymentType]);

  const getErrorMessage = () => {
    // Kiểm tra VNPay response codes trước
    switch (finalErrorCode) {
      // VNPay response codes
      case "24":
        return "Giao dịch bị hủy bởi người dùng";
      case "51":
        return "Số dư tài khoản không đủ để thực hiện giao dịch";
      case "65":
        return "Tài khoản của quý khách đã vượt quá hạn mức giao dịch trong ngày";
      case "75":
        return "Ngân hàng thanh toán đang bảo trì";
      case "79":
        return "KH nhập sai mật khẩu thanh toán quá số lần quy định";
      case "99":
        return "Lỗi không xác định";
      // Custom error codes
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
        return errorMessage || finalErrorCode
          ? `Thanh toán thất bại với mã lỗi: ${finalErrorCode}`
          : "Có lỗi xảy ra trong quá trình thanh toán";
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
      state: {
        registrationData:
          paymentType === "mentor_registration" ? registrationData : undefined,
        bookingData: paymentType === "lesson_booking" ? bookingData : undefined,
      },
    });
  };

  const goToSource = () => {
    // Chuyển về trang gốc tương ứng với loại thanh toán
    if (paymentType === "mentor_registration") {
      navigate("/mentor/register");
    } else if (paymentType === "lesson_booking") {
      navigate("/user/finding-mentor");
    } else {
      navigate("/");
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  const getPageTitle = () => {
    switch (paymentType) {
      case "mentor_registration":
        return "Đăng ký Mentor không thành công";
      case "lesson_booking":
        return "Đăng ký buổi học không thành công";
      default:
        return "Thanh toán không thành công";
    }
  };

  const getBackButtonText = () => {
    switch (paymentType) {
      case "mentor_registration":
        return "Quay lại đăng ký mentor";
      case "lesson_booking":
        return "Quay lại đăng ký buổi học";
      default:
        return "Quay lại";
    }
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
            {getPageTitle()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            {getErrorMessage()}
          </motion.p>

          {/* Hiển thị thông tin giao dịch VNPay nếu có */}
          {vnpTxnRef && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-gray-100 rounded-lg p-4"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Thông tin giao dịch
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>
                  Mã giao dịch: <span className="font-mono">{vnpTxnRef}</span>
                </div>
                {finalErrorCode && (
                  <div>
                    Mã lỗi:{" "}
                    <span className="font-mono text-red-600">
                      {finalErrorCode}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
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
                  {finalTransactionId && (
                    <p className="mt-1">
                      Mã giao dịch:{" "}
                      <span className="font-mono">{finalTransactionId}</span>
                    </p>
                  )}
                  {finalErrorCode && finalErrorCode !== "24" && (
                    <p className="mt-1">
                      Mã lỗi:{" "}
                      <span className="font-mono text-red-600">
                        {finalErrorCode}
                      </span>
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
            onClick={goToSource}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
          >
            <FiArrowLeft className="mr-2" />
            {getBackButtonText()}
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
            {paymentType === "mentor_registration" &&
              "Thông tin đăng ký mentor của bạn vẫn được lưu trữ an toàn."}
            {paymentType === "lesson_booking" &&
              "Thông tin đăng ký buổi học của bạn vẫn được lưu trữ an toàn."}
            {(!paymentType || paymentType === "unknown") &&
              "Dữ liệu của bạn vẫn được bảo mật an toàn."}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;
