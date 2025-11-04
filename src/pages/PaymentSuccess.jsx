import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiDownload,
  FiHome,
  FiMail,
  FiCalendar,
  FiUser,
  FiUpload,
} from "react-icons/fi";
import { message } from "antd";
import userService from "../services/userService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Lấy dữ liệu từ trang thanh toán hoặc URL parameters
  const {
    paymentData,
    paymentType,
    registrationData,
    bookingData,
    transactionId,
  } = location.state || {};

  // Lấy transaction info từ URL parameters (khi redirect từ payment gateway)
  const urlTransactionId =
    searchParams.get("transactionId") ||
    searchParams.get("vnp_TxnRef") ||
    searchParams.get("orderId");
  const paymentStatus =
    searchParams.get("status") || searchParams.get("vnp_ResponseCode");

  // Lấy thêm thông tin từ VNPay
  const vnpAmount = searchParams.get("vnp_Amount"); // Số tiền (x100)
  const vnpBankCode = searchParams.get("vnp_BankCode");
  const vnpBankTranNo = searchParams.get("vnp_BankTranNo");
  const vnpCardType = searchParams.get("vnp_CardType");
  const vnpPayDate = searchParams.get("vnp_PayDate");
  const vnpTransactionNo = searchParams.get("vnp_TransactionNo");

  // Xác định transaction ID từ state hoặc URL
  const finalTransactionId = transactionId || urlTransactionId;

  // Xác định payment type mặc định nếu không có trong state
  const finalPaymentType = paymentType || "mentor_registration"; // Default cho mentor registration

  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [cvUploadSuccess, setCvUploadSuccess] = useState(false);
  const [cvUploadError, setCvUploadError] = useState(null);

  useEffect(() => {
    // Nếu không có transaction ID từ cả state và URL, chuyển về trang chủ
    if (!finalTransactionId) {
      console.log("No transaction ID found, redirecting to home");
      navigate("/");
      return;
    }

    // Kiểm tra payment status - nếu không thành công, chuyển đến trang cancel
    if (paymentStatus && paymentStatus !== "00") {
      console.log("Payment failed with status:", paymentStatus);
      navigate("/payment-cancel", {
        state: {
          paymentStatus,
          transactionId: finalTransactionId,
          paymentType: finalPaymentType,
          registrationData,
          bookingData,
          errorCode: paymentStatus,
          urlParams: Object.fromEntries(searchParams.entries()),
        },
      });
      return;
    }

    // Log để debug
    console.log("=== PaymentSuccess Debug Info ===");
    console.log("Transaction ID:", finalTransactionId);
    console.log("Payment Status:", paymentStatus);
    console.log("Payment Type:", finalPaymentType);
    console.log("Has Registration Data:", !!registrationData);
    console.log("Has Booking Data:", !!bookingData);
    console.log("Booking Data:", bookingData);
    console.log("Location State:", location.state);
    console.log("URL Params:", Object.fromEntries(searchParams.entries()));
    console.log("================================");

    // Kiểm tra nếu là mentor registration
    if (finalPaymentType === "mentor_registration" && registrationData) {
      if (registrationData.cvUploaded) {
        console.log("CV already uploaded before payment");
        message.success("Thanh toán thành công! CV đã được tải lên.");
      } else {
        // Fallback: Upload CV nếu chưa được upload (trường hợp cũ)
        console.log("CV not uploaded yet, uploading now...");
        uploadCV();
      }
    }

    // Hiển thị thông báo thành công cho lesson booking
    if (finalPaymentType === "lesson_booking") {
      console.log("Lesson booking payment successful");
      message.success("Thanh toán đặt lịch học thành công!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTransactionId, navigate, finalPaymentType, paymentStatus]);

  const uploadCV = async () => {
    // Upload CV nếu có
    if (registrationData?.cv) {
      try {
        setIsUploadingCV(true);
        setCvUploadError(null);

        console.log("Uploading CV:", registrationData.cv.name);
        await userService.uploadCV(registrationData.cv);

        setCvUploadSuccess(true);
        console.log("CV uploaded successfully after payment");

        message.success("Tải lên CV thành công!");
      } catch (error) {
        console.error("Error uploading CV after payment:", error);
        console.error("Error response:", error.response?.data);

        const errorMessage =
          error.response?.data?.message ||
          "Có lỗi xảy ra khi tải lên CV. Thông tin sẽ được xử lý trong vòng 24h.";

        setCvUploadError(errorMessage);
        message.error(errorMessage);
      } finally {
        setIsUploadingCV(false);
      }
    } else {
      console.log("No CV file to upload");
    }
  };

  const handleDownloadReceipt = () => {
    // Xử lý tải xuống hóa đơn
    const receiptData = {
      transactionId: finalTransactionId,
      paymentData,
      paymentType: finalPaymentType,
      registrationData,
      bookingData,
      paymentStatus,
      vnpInfo: {
        amount: vnpAmount ? parseInt(vnpAmount) / 100 : null,
        bankCode: vnpBankCode,
        bankTranNo: vnpBankTranNo,
        cardType: vnpCardType,
        payDate: vnpPayDate,
        transactionNo: vnpTransactionNo,
      },
      date: vnpPayDate
        ? vnpPayDate.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            "$3/$2/$1"
          )
        : new Date().toLocaleDateString("vi-VN"),
      time: vnpPayDate
        ? vnpPayDate.replace(
            /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
            "$4:$5:$6"
          )
        : new Date().toLocaleTimeString("vi-VN"),
    };

    console.log("Downloading receipt:", receiptData);
    alert("Tính năng tải xuống hóa đơn sẽ được cập nhật sớm!");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToDashboard = () => {
    // Chuyển đến dashboard tương ứng với loại thanh toán
    if (finalPaymentType === "mentor_registration") {
      navigate("/mentor/dashboard");
    } else if (finalPaymentType === "lesson_booking") {
      navigate("/user/dashboard");
    } else {
      navigate("/");
    }
  };

  const getSuccessContent = () => {
    switch (finalPaymentType) {
      case "mentor_registration":
        return {
          title: "Đăng ký Mentor thành công!",
          subtitle: "Chúc mừng! Bạn đã đăng ký thành công làm mentor.",
          nextSteps: [
            {
              step: 1,
              title: "Xem xét hồ sơ",
              description:
                "Chúng tôi sẽ xem xét hồ sơ của bạn trong vòng 24-48 giờ",
              color: "blue",
            },
            {
              step: 2,
              title: "Thông báo kết quả",
              description:
                "Bạn sẽ nhận được email thông báo về kết quả xét duyệt",
              color: "green",
            },
            {
              step: 3,
              title: "Bắt đầu dạy học",
              description:
                "Sau khi được duyệt, bạn có thể bắt đầu nhận học viên và dạy học",
              color: "purple",
            },
          ],
        };
      case "lesson_booking":
        return {
          title: "Đăng ký buổi học thành công!",
          subtitle:
            "Bạn đã đặt lịch học thành công. Mentor sẽ sớm liên hệ với bạn.",
          nextSteps: [
            {
              step: 1,
              title: "Xác nhận lịch học",
              description: "Mentor sẽ xác nhận lịch học trong vòng 2 giờ",
              color: "blue",
            },
            {
              step: 2,
              title: "Chuẩn bị buổi học",
              description:
                "Bạn sẽ nhận được link meeting và tài liệu trước buổi học",
              color: "green",
            },
            {
              step: 3,
              title: "Bắt đầu học",
              description:
                "Tham gia buổi học đúng giờ đã hẹn để có trải nghiệm tốt nhất",
              color: "purple",
            },
          ],
        };
      default:
        return {
          title: "Thanh toán thành công!",
          subtitle: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
          nextSteps: [
            {
              step: 1,
              title: "Hoàn tất",
              description: "Giao dịch của bạn đã được xử lý thành công",
              color: "green",
            },
          ],
        };
    }
  };

  const content = getSuccessContent();

  if (!finalTransactionId) {
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
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            {content.subtitle}
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
                    {finalTransactionId}
                  </span>
                </div>
                {/* Buyer Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Thông tin người mua
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Người mua:</span>
                    <span className="font-medium">
                      {paymentData?.buyer?.fullName ||
                        registrationData?.fullName ||
                        bookingData?.buyerName ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {paymentData?.buyer?.email ||
                        registrationData?.email ||
                        bookingData?.buyerEmail ||
                        "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SĐT:</span>
                    <span className="font-medium">
                      {paymentData?.buyer?.phone ||
                        registrationData?.phone ||
                        bookingData?.buyerPhone ||
                        "-"}
                    </span>
                  </div>
                </div>
                {vnpTransactionNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã GD VNPay:</span>
                    <span className="font-mono text-sm font-medium">
                      {vnpTransactionNo}
                    </span>
                  </div>
                )}
                {paymentStatus && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`font-medium ${
                        paymentStatus === "00"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {paymentStatus === "00"
                        ? "Thành công"
                        : `Lỗi: ${paymentStatus}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {vnpPayDate
                      ? vnpPayDate.replace(
                          /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                          "$3/$2/$1 $4:$5:$6"
                        )
                      : new Date().toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium capitalize">
                    {vnpBankCode
                      ? "VNPay"
                      : paymentData?.paymentMethod === "zalopay"
                      ? "ZaloPay"
                      : "VNPay"}
                  </span>
                </div>
                {vnpPayDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian thanh toán:</span>
                    <span className="font-medium">
                      {vnpPayDate.replace(
                        /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                        "$3/$2/$1 $4:$5:$6"
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-green-600">
                    {vnpAmount
                      ? (parseInt(vnpAmount) / 100).toLocaleString("vi-VN")
                      : paymentData?.amount?.toLocaleString("vi-VN") ||
                        "100,000"}{" "}
                    VNĐ
                  </span>
                </div>
                {vnpBankCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium uppercase">{vnpBankCode}</span>
                  </div>
                )}
                {vnpCardType && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại thẻ:</span>
                    <span className="font-medium">
                      {vnpCardType === "ATM" ? "Thẻ ATM" : vnpCardType}
                    </span>
                  </div>
                )}
                {vnpBankTranNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã GD ngân hàng:</span>
                    <span className="font-mono text-sm font-medium">
                      {vnpBankTranNo}
                    </span>
                  </div>
                )}
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

          {/* Booking Status - for lesson booking */}
          {finalPaymentType === "lesson_booking" && (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-purple-600" />
                Trạng thái đặt lịch
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {bookingData && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Thông tin đặt lịch:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Mentor ID:</span>
                        <span className="ml-2 font-medium">
                          {bookingData.mentorId || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeslot ID:</span>
                        <span className="ml-2 font-medium">
                          {bookingData.timeslotId || "N/A"}
                        </span>
                      </div>
                      {bookingData.timeslot && (
                        <>
                          <div>
                            <span className="text-gray-500">Ngày học:</span>
                            <span className="ml-2 font-medium">
                              {bookingData.timeslot.slotDate || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Giờ học:</span>
                            <span className="ml-2 font-medium">
                              {bookingData.timeslot.startTime?.slice(0, 5)} -{" "}
                              {bookingData.timeslot.endTime?.slice(0, 5)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 text-purple-600" />
              Thông tin thanh toán
            </h3> */}

          {/* {finalPaymentType === "mentor_registration" && registrationData && (
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
                </div> */}

          {/* User Info & CV Upload Status */}
          {finalPaymentType === "mentor_registration" && (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FiCheck className="mr-2 text-green-500" />
                Trạng thái tải lên CV
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                {/* CV Upload Status */}
                {registrationData?.cv && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <FiUpload className="mr-2" />
                      Trạng thái CV:
                    </span>
                    <div className="flex items-center">
                      {isUploadingCV && (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm">Đang tải lên...</span>
                        </div>
                      )}
                      {cvUploadSuccess && !isUploadingCV && (
                        <div className="flex items-center text-green-600">
                          <FiCheck className="mr-1" />
                          <span className="text-sm font-medium">
                            Đã tải lên thành công
                          </span>
                        </div>
                      )}
                      {cvUploadError && !isUploadingCV && (
                        <div className="flex items-center text-amber-600">
                          <span className="text-sm">Sẽ xử lý trong 24h</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Messages */}
                {cvUploadError && (
                  <div className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                    <p className="font-medium mb-1">Lỗi khi tải lên CV:</p>
                    <p>{cvUploadError}</p>
                    <p className="mt-2 text-xs">
                      Vui lòng liên hệ hỗ trợ với mã giao dịch:{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded text-xs font-mono">
                        {finalTransactionId}
                      </code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 
            {finalPaymentType === "lesson_booking" && bookingData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Học viên:</span>
                      <span className="font-medium">
                        {bookingData.user?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {bookingData.user?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mentor:</span>
                      <span className="font-medium">
                        {bookingData.mentor?.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khóa học:</span>
                      <span className="font-medium">
                        {bookingData.course?.title || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* Next Steps */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiCalendar className="mr-2 text-orange-600" />
              Các bước tiếp theo
            </h3>
            <div className="space-y-3">
              {content.nextSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 bg-${step.color}-50 rounded-lg`}
                >
                  <div
                    className={`w-6 h-6 bg-${step.color}-500 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5`}
                  >
                    {step.step}
                  </div>
                  <div>
                    <p className={`font-medium text-${step.color}-800`}>
                      {step.title}
                    </p>
                    <p className={`text-sm text-${step.color}-600`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
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
          {finalPaymentType === "mentor_registration" && (
            <p className="mt-1">
              Hãy chuẩn bị để chia sẻ kiến thức và kinh nghiệm của bạn với mọi
              người.
            </p>
          )}
          {finalPaymentType === "lesson_booking" && (
            <p className="mt-1">Chúc bạn có buổi học thú vị và hiệu quả!</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
