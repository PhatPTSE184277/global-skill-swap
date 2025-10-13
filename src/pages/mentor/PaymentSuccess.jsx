import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiDownload,
  FiHome,
  FiMail,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ trang thanh toán
  const { paymentData, registrationData, transactionId } = location.state || {};

  useEffect(() => {
    // Nếu không có dữ liệu thanh toán, chuyển về trang chủ
    if (!transactionId) {
      navigate("/");
    }
  }, [transactionId, navigate]);

  const handleDownloadReceipt = () => {
    // Xử lý tải xuống hóa đơn
    const receiptData = {
      transactionId,
      paymentData,
      registrationData,
      date: new Date().toLocaleDateString("vi-VN"),
      time: new Date().toLocaleTimeString("vi-VN"),
    };

    console.log("Downloading receipt:", receiptData);
    alert("Tính năng tải xuống hóa đơn sẽ được cập nhật sớm!");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToDashboard = () => {
    // Chuyển đến dashboard mentor (sẽ cập nhật sau)
    navigate("/mentor/dashboard");
  };

  if (!transactionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-12 h-12 text-white" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-green-600 mb-4"
          >
            Thanh toán thành công!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            Chúc mừng! Bạn đã đăng ký thành công làm mentor.
          </motion.p>
        </motion.div>

        {/* Success Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          {/* Transaction Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin giao dịch
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-sm font-medium">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium capitalize">
                    {paymentData?.paymentMethod === "zalopay"
                      ? "ZaloPay"
                      : "VNPay"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-green-600">
                    {paymentData?.amount?.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiCheck className="w-3 h-3 mr-1" />
                    Thành công
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-purple-600" />
              Thông tin đăng ký
            </h3>
            {registrationData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">
                        {registrationData.fullName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {registrationData.email || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chuyên môn:</span>
                      <span className="font-medium">
                        {registrationData.expertise || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kinh nghiệm:</span>
                      <span className="font-medium">
                        {registrationData.experience || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiCalendar className="mr-2 text-orange-600" />
              Các bước tiếp theo
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-800">Xem xét hồ sơ</p>
                  <p className="text-sm text-blue-600">
                    Chúng tôi sẽ xem xét hồ sơ của bạn trong vòng 24-48 giờ
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    Thông báo kết quả
                  </p>
                  <p className="text-sm text-green-600">
                    Bạn sẽ nhận được email thông báo về kết quả xét duyệt
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-purple-800">Bắt đầu dạy học</p>
                  <p className="text-sm text-purple-600">
                    Sau khi được duyệt, bạn có thể bắt đầu nhận học viên và dạy
                    học
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <FiMail className="mr-2 text-blue-600" />
              Liên hệ hỗ trợ
            </h4>
            <p className="text-sm text-gray-600">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua
              email:
              <a
                href="mailto:support@globalskillswap.com"
                className="text-blue-600 hover:underline ml-1"
              >
                support@globalskillswap.com
              </a>
            </p>
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
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
          >
            <FiDownload className="mr-2" />
            Tải xuống hóa đơn
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToDashboard}
            className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
          >
            <FiUser className="mr-2" />
            Đi đến Dashboard
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToHome}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all"
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
          <p>Cảm ơn bạn đã tham gia vào cộng đồng Global Skill Swap!</p>
          <p className="mt-1">
            Hãy chuẩn bị để chia sẻ kiến thức và kinh nghiệm của bạn với mọi
            người.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
