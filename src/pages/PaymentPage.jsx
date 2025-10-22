import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiArrowLeft,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { message } from "antd";
import paymentService from "../services/paymentService";
import userService from "../services/userService";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registrationData = useMemo(
    () => location.state?.registrationData || {},
    [location.state?.registrationData]
  );

  const bookingData = useMemo(
    () => location.state?.bookingData || {},
    [location.state?.bookingData]
  );

  const paymentType = useMemo(() => {
    if (registrationData.fullName && registrationData.expertise) {
      return "mentor_registration";
    } else if (bookingData.mentor || bookingData.course) {
      return "lesson_booking";
    }
    return "unknown";
  }, [registrationData, bookingData]);

  const getPaymentConfig = () => {
    switch (paymentType) {
      case "mentor_registration":
        return {
          title: "Thanh toán đăng ký Mentor",
          packageName: "Gói Mentor",
          amount: 100000,
          originalAmount: 399000,
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
      case "lesson_booking":
        return {
          title: "Thanh toán đăng ký buổi học",
          packageName: bookingData.course?.title || "Buổi học",
          amount: bookingData.amount || 200000,
          originalAmount: null,
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
      default:
        return {
          title: "Thanh toán",
          packageName: "Gói dịch vụ",
          amount: 100000,
          originalAmount: null,
          successRoute: "/payment-success",
          cancelRoute: "/payment-cancel",
        };
    }
  };

  const config = getPaymentConfig();

  const [paymentData, setPaymentData] = useState({
    amount: config.amount,
    orderId: `ORDER_${Date.now()}`,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (paymentType === "unknown") {
      console.warn("No valid payment data found");
    }

    setPaymentData((prev) => ({
      ...prev,
      amount: config.amount,
    }));

    const initPayment = async () => {
      try {
        setIsProcessing(true);
        const response = await paymentService.createPayment();

        if (response.success && response.data) {
          setInvoiceData(response.data);

          if (
            response.data.sePayResponse &&
            response.data.sePayResponse.qrUrl
          ) {
            setQrUrl(response.data.sePayResponse.qrUrl);
            message.success("Vui lòng quét mã QR để thanh toán");
          } else {
            throw new Error("Không nhận được mã QR từ server");
          }
        } else {
          throw new Error(response.message || "Không thể tạo hóa đơn");
        }
      } catch (error) {
        console.error("Failed to create payment:", error);
        message.error("Có lỗi xảy ra khi tạo thanh toán");
      } finally {
        setIsProcessing(false);
      }
    };

    initPayment();
  }, [paymentType, config.amount]);

  // Fetch current user (buyer) to include in payment state
  useEffect(() => {
    let mounted = true;
    const loadBuyer = async () => {
      try {
        const res = await userService.getCurrentUser();
        const user = res?.data || res;
        if (mounted && user) {
          setPaymentData((prev) => ({
            ...prev,
            buyer: {
              fullName: user.fullName || user.name || "",
              email: user.email || "",
              phone: user.phone || "",
            },
          }));
        }
      } catch (err) {
        console.warn("Could not load current user for payment summary", err);
      }
    };

    loadBuyer();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!invoiceData || !invoiceData.sePayResponse) return;

    const calculateTimeRemaining = () => {
      const timeLimit = invoiceData.sePayResponse.timeLimit;
      if (!timeLimit) return null;

      const [hours, minutes, seconds] = timeLimit.split(":").map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return totalSeconds;
    };

    let remaining = calculateTimeRemaining();
    if (!remaining) return;

    setTimeRemaining(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        message.warning("Mã QR đã hết hạn. Vui lòng tạo lại đơn hàng.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [invoiceData]);

  useEffect(() => {
    if (!invoiceData) return;

    const checkInterval = setInterval(async () => {
      try {
        const status = await paymentService.getInvoiceStatus(invoiceData.id);

        // Check for PAID status instead of COMPLETED
        if (status.data?.invoiceStatus === "PAID") {
          clearInterval(checkInterval);
          message.success("Thanh toán thành công!");

          navigate(config.successRoute, {
            state: {
              paymentData,
              paymentType,
              registrationData:
                paymentType === "mentor_registration" ? registrationData : null,
              bookingData:
                paymentType === "lesson_booking" ? bookingData : null,
              transactionId: invoiceData.transactionNumber,
              invoiceId: invoiceData.id,
            },
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [
    invoiceData,
    config.successRoute,
    navigate,
    paymentData,
    paymentType,
    registrationData,
    bookingData,
  ]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    message.warning("Bạn đã hủy thanh toán");
    navigate(config.cancelRoute, {
      state: {
        reason: "user_cancelled",
        paymentType,
        registrationData:
          paymentType === "mentor_registration" ? registrationData : null,
        bookingData: paymentType === "lesson_booking" ? bookingData : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            {config.title}
          </h1>
          <p className="text-gray-600">Quét mã QR để hoàn tất thanh toán</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Code Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 overflow-hidden"
            >
              {isProcessing && !qrUrl ? (
                /* Loading */
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-indigo-600"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Đang tạo mã QR...
                  </h3>
                  <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                </div>
              ) : qrUrl ? (
                /* QR Code Display */
                <div className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Quét mã QR để thanh toán
                    </h2>
                    <p className="text-gray-600">
                      Mở app ngân hàng và quét mã QR bên dưới
                    </p>
                  </div>

                  {/* QR Code Image */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-6 mx-auto max-w-md">
                    <div className="bg-white rounded-xl p-6 shadow-inner">
                      <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Time Remaining */}
                  {timeRemaining !== null && timeRemaining > 0 && (
                    <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                      <FiClock className="w-6 h-6 text-yellow-600" />
                      <span className="text-lg font-bold text-yellow-800">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center text-lg">
                      <FiAlertCircle className="w-5 h-5 mr-2" />
                      Hướng dẫn thanh toán
                    </h4>
                    <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                      <li>Mở ứng dụng ngân hàng của bạn</li>
                      <li>Chọn "Quét mã QR"</li>
                      <li>Quét mã QR ở trên</li>
                      <li>Xác nhận thanh toán</li>
                    </ol>
                  </div>

                  {/* Manual Payment Instructions */}
                  {invoiceData && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
                      <h4 className="font-bold text-purple-900 mb-4 flex items-center text-lg">
                        <FiAlertCircle className="w-5 h-5 mr-2" />
                        Hoặc chuyển khoản thủ công
                      </h4>
                      <div className="space-y-4">
                        {/* Bank Name */}
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Ngân hàng
                          </p>
                          <p className="font-bold text-gray-900 text-lg">
                            {invoiceData.sePayResponse?.bankName ||
                              "Vietinbank"}
                          </p>
                        </div>

                        {/* Account Number */}
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Số tài khoản
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono font-bold text-gray-900 text-xl">
                              {invoiceData.sePayResponse?.accountNumber ||
                                "104877830765"}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  invoiceData.sePayResponse?.accountNumber ||
                                    "104877830765"
                                );
                                message.success("Đã sao chép số tài khoản");
                              }}
                              className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
                            >
                              Sao chép
                            </button>
                          </div>
                        </div>

                        {/* Account Holder */}
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Chủ tài khoản
                          </p>
                          <p className="font-bold text-gray-900">
                            {invoiceData.sePayResponse?.accountHolder ||
                              "DONG MINH QUAN"}
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Số tiền</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-orange-600 text-2xl">
                              {paymentData.amount.toLocaleString("vi-VN")} đ
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  paymentData.amount.toString()
                                );
                                message.success("Đã sao chép số tiền");
                              }}
                              className="text-purple-600 hover:text-purple-700 text-sm font-semibold"
                            >
                              Sao chép
                            </button>
                          </div>
                        </div>

                        {/* Transfer Content */}
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Nội dung chuyển khoản
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-mono font-bold text-gray-900 break-all pr-2">
                              {invoiceData.transactionNumber}
                            </p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  invoiceData.transactionNumber
                                );
                                message.success("Đã sao chép nội dung");
                              }}
                              className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex-shrink-0"
                            >
                              Sao chép
                            </button>
                          </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                          <p className="text-xs text-yellow-800 font-medium">
                            ⚠️ <strong>Lưu ý quan trọng:</strong> Vui lòng nhập
                            chính xác nội dung chuyển khoản để hệ thống tự động
                            xác nhận thanh toán của bạn.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Error */
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <FiAlertCircle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-900 mb-2">
                    Không thể tạo mã QR
                  </h3>
                  <p className="text-gray-600 mb-6">Vui lòng thử lại sau</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
                  >
                    Thử lại
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary - Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-purple-100 p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h3>

              {/* Package Name */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">
                    {config.packageName}
                  </span>
                  <span className="text-gray-600">×1</span>
                </div>
                {config.originalAmount && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Giá gốc</span>
                    <span className="line-through text-gray-400">
                      {config.originalAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}
              </div>

              {/* Buyer Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Thông tin người mua
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Người mua</span>
                    <span className="font-medium text-gray-900">
                      {paymentData?.buyer?.fullName ||
                        registrationData?.fullName ||
                        bookingData?.buyerName ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium text-gray-900">
                      {paymentData?.buyer?.email ||
                        registrationData?.email ||
                        bookingData?.buyerEmail ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SĐT</span>
                    <span className="font-medium text-gray-900">
                      {paymentData?.buyer?.phone ||
                        registrationData?.phone ||
                        bookingData?.buyerPhone ||
                        "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {paymentData.amount.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              {qrUrl && invoiceData && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-bold text-orange-900 mb-3">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số tiền</span>
                      <span className="font-bold text-orange-600">
                        {paymentData.amount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <div className="pt-2 border-t border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Mã giao dịch</p>
                      <p className="text-xs font-mono font-bold text-gray-800 break-all">
                        {invoiceData.transactionNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <FiShield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800 font-medium">
                  Thanh toán an toàn & bảo mật 100%
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={goBack}
            disabled={qrUrl !== null || isProcessing}
            className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all ${
              qrUrl || isProcessing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 shadow-md"
            }`}
          >
            <FiArrowLeft className="mr-2" />
            Quay lại
          </button>

          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all ${
              isProcessing
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
            }`}
          >
            <FiX className="mr-2" />
            Hủy thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
