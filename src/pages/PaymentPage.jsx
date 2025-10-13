import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiShield,
  FiArrowLeft,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import paymentService from "../services/paymentService";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ trang trước (có thể là mentor registration hoặc lesson booking)
  const registrationData = useMemo(
    () => location.state?.registrationData || {},
    [location.state?.registrationData]
  );

  const bookingData = useMemo(
    () => location.state?.bookingData || {},
    [location.state?.bookingData]
  );

  // Xác định loại thanh toán
  const paymentType = useMemo(() => {
    if (registrationData.fullName && registrationData.expertise) {
      return "mentor_registration";
    } else if (bookingData.mentor || bookingData.course) {
      return "lesson_booking";
    }
    return "unknown";
  }, [registrationData, bookingData]);

  // Cấu hình gói thanh toán dựa trên loại
  const getPaymentConfig = () => {
    switch (paymentType) {
      case "mentor_registration":
        return {
          title: "Thanh toán đăng ký Mentor",
          subtitle: "Hoàn thành thanh toán để trở thành mentor",
          packageName: "Gói Mentor",
          amount: 100000,
          originalAmount: 399000,
          features: [
            "• Đăng ký làm mentor chuyên nghiệp",
            "• Hỗ trợ từ đội ngũ chăm sóc khách hàng",
            "• Công cụ quản lý lịch học tiên tiến",
            "• Hoa hồng ưu đãi cho mentor mới",
          ],
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
      case "lesson_booking":
        return {
          title: "Thanh toán đăng ký buổi học",
          subtitle: "Xác nhận và thanh toán để đăng ký buổi học",
          packageName: bookingData.course?.title || "Buổi học",
          amount: bookingData.amount || 200000,
          originalAmount: null,
          features: [
            `• Buổi học 1:1 với ${bookingData.mentor?.name || "mentor"}`,
            `• Thời gian: ${bookingData.schedule?.time || "Theo lịch đã chọn"}`,
            "• Hỗ trợ trực tiếp từ mentor",
            "• Tài liệu học tập đầy đủ",
          ],
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
      default:
        return {
          title: "Thanh toán",
          subtitle: "Hoàn thành thanh toán",
          packageName: "Gói dịch vụ",
          amount: 100000,
          originalAmount: null,
          features: ["• Dịch vụ chất lượng cao"],
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
    }
  };

  const config = getPaymentConfig();

  const [paymentData, setPaymentData] = useState({
    paymentMethod: "zalopay",
    amount: config.amount,
    orderId: `ORDER_${Date.now()}`,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có dữ liệu hợp lệ không
    if (paymentType === "unknown") {
      console.warn("No valid payment data found");
    }

    // Cập nhật amount khi config thay đổi
    setPaymentData((prev) => ({
      ...prev,
      amount: config.amount,
    }));
  }, [paymentType, config.amount]);

  const handlePaymentMethodChange = (method) => {
    setPaymentData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      const fullPaymentData = {
        ...paymentData,
        paymentType,
        registrationData:
          paymentType === "mentor_registration" ? registrationData : null,
        bookingData: paymentType === "lesson_booking" ? bookingData : null,
      };

      // Gọi API thanh toán dựa trên phương thức được chọn
      if (paymentData.paymentMethod === "zalopay") {
        await paymentService.processZaloPayPayment(fullPaymentData);
      } else if (paymentData.paymentMethod === "vnpay") {
        await paymentService.processVNPayPayment(fullPaymentData);
      }

      // Nếu không chuyển hướng, có thể là thanh toán local hoặc mock
      // Chuyển đến trang thanh toán thành công
      navigate(config.successRoute, {
        state: {
          paymentData,
          paymentType,
          registrationData:
            paymentType === "mentor_registration" ? registrationData : null,
          bookingData: paymentType === "lesson_booking" ? bookingData : null,
          transactionId: `TXN_${Date.now()}`,
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);

      // Chuyển đến trang thanh toán thất bại
      navigate(config.cancelRoute, {
        search: `?error=PAYMENT_FAILED&message=${encodeURIComponent(
          error.message || "Thanh toán thất bại"
        )}&orderId=${paymentData.orderId}`,
        state: {
          registrationData:
            paymentType === "mentor_registration" ? registrationData : null,
          bookingData: paymentType === "lesson_booking" ? bookingData : null,
          paymentType,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-purple-900 mb-4">
            {config.title}
          </h1>
          <p className="text-gray-600 text-lg">{config.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FiCreditCard className="mr-3 text-purple-700" />
                Thông tin thanh toán
              </h2>

              {/* Package Info */}
              <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 mb-6 border border-purple-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">
                      {config.packageName}
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {config.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">
                      {paymentType === "mentor_registration"
                        ? "Một lần duy nhất"
                        : "Thanh toán một lần"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">
                      {paymentData.amount.toLocaleString("vi-VN")} VNĐ
                    </p>
                    {config.originalAmount && (
                      <p className="text-sm line-through text-gray-500">
                        {config.originalAmount.toLocaleString("vi-VN")} VNĐ
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn phương thức thanh toán
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "zalopay",
                        name: "ZaloPay",
                        icon: FiCreditCard,
                        color: "#0068FF",
                        description: "Nhanh chóng, an toàn",
                      },
                      {
                        id: "vnpay",
                        name: "VNPay",
                        icon: FiShield,
                        color: "#1E40AF",
                        description: "Hỗ trợ tất cả ngân hàng",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          paymentData.paymentMethod === method.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handlePaymentMethodChange(method.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon
                            className="w-6 h-6"
                            style={{ color: method.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {method.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        {paymentData.paymentMethod === method.id && (
                          <div className="mt-2">
                            <FiCheck className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details for Selected Method */}
                {paymentData.paymentMethod === "zalopay" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Z</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800">
                          Thanh toán qua ZaloPay
                        </h4>
                        <p className="text-sm text-blue-600">
                          Bạn sẽ được chuyển đến ứng dụng ZaloPay
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-700 mb-2">
                        • Quét mã QR hoặc mở ứng dụng ZaloPay
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        • Số tiền:{" "}
                        <strong>
                          {paymentData.amount.toLocaleString("vi-VN")} VNĐ
                        </strong>
                      </p>
                      <p className="text-sm text-gray-700">
                        • Xác nhận thanh toán trong ứng dụng
                      </p>
                    </div>
                  </motion.div>
                )}

                {paymentData.paymentMethod === "vnpay" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-indigo-50 border border-indigo-200 rounded-lg p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">VN</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-800">
                          Thanh toán qua VNPay
                        </h4>
                        <p className="text-sm text-indigo-600">
                          Bảo mật cao với công nghệ 3D Secure
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <p className="text-sm text-gray-700 mb-2">
                        • Hỗ trợ thẻ ATM, Internet Banking
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        • Số tiền:{" "}
                        <strong>
                          {paymentData.amount.toLocaleString("vi-VN")} VNĐ
                        </strong>
                      </p>
                      <p className="text-sm text-gray-700">
                        • Bảo mật cao, xử lý nhanh chóng
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tóm tắt đơn hàng
              </h3>

              {/* Thông tin người đăng ký/đặt lịch */}
              {paymentType === "mentor_registration" &&
                registrationData.fullName && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Người đăng ký:</p>
                    <p className="font-medium">{registrationData.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {registrationData.email}
                    </p>
                  </div>
                )}

              {paymentType === "lesson_booking" && bookingData.user && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Học viên:</p>
                  <p className="font-medium">{bookingData.user.name}</p>
                  <p className="text-sm text-gray-600">
                    {bookingData.user.email}
                  </p>
                  {bookingData.mentor && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Mentor:{" "}
                        <span className="font-medium">
                          {bookingData.mentor.name}
                        </span>
                      </p>
                      {bookingData.schedule && (
                        <p className="text-sm text-gray-600">
                          Lịch học: {bookingData.schedule.date} lúc{" "}
                          {bookingData.schedule.time}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{config.packageName}</span>
                  <span className="font-medium">1</span>
                </div>

                {config.originalAmount && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá gốc</span>
                      <span className="line-through text-gray-400">
                        {config.originalAmount.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>
                        Giảm giá (
                        {Math.round(
                          (1 - paymentData.amount / config.originalAmount) * 100
                        )}
                        %)
                      </span>
                      <span>
                        -
                        {(
                          config.originalAmount - paymentData.amount
                        ).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </span>
                    </div>
                  </>
                )}

                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-orange-600">
                    {paymentData.amount.toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Mã đơn hàng: {paymentData.orderId}
              </div>

              {/* Security Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <FiShield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-800 font-medium">
                    Thanh toán được bảo mật 100%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t max-w-4xl mx-auto">
          <button
            onClick={goBack}
            className="flex items-center px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={processPayment}
            disabled={isProcessing}
            className="flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <FiDollarSign className="mr-2" />
                Thanh toán {paymentData.amount.toLocaleString("vi-VN")} VNĐ
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
