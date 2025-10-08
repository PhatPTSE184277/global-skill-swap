import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import VNPayLogo from "../../img/svg/vnpay.svg";
import MoMoLogo from "../../img/svg/momo.svg";

const PaymentConfirm = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Data giả (mock)
    const mockData = {
      mentor: {
        name: "Liam Harper",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        language: "Ngôn ngữ Anh",
        phone: "848127194",
        email: "liam@gmail.com",
      },
      user: {
        name: "Sophia Clark",
        phone: "0988123456",
        email: "sophi@gmail.com",
      },
      course: {
        title: "Tiếng Anh Giao Tiếp",
      },
      booking: {
        date: "19/07/2025",
      },
      schedule: {
        date: "20/07/2025",
        time: "3:00PM",
      },
      order: {
        code: "#2020-05-0001",
        amount: "100,000",
        deadline: "19/07/2025",
        reference: "ABC123XYZ",
      },
      paymentMethods: [
        {
          name: "VNPAY",
          logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/VNPAY_logo.png",
        },
        {
          name: "MoMo",
          logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/MoMo_Logo.png",
        },
      ],
    };

    // giả lập fetch API
    setTimeout(() => {
      setData(mockData);
    }, 500); // delay cho giống gọi API
  }, []);

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-6 text-center">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="text-center pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle className="w-5 h-5 text-orange-700" />
          <h1 className="text-xl font-bold text-purple-950">
            Xác nhận đăng ký buổi học
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          Vui lòng kiểm tra thông tin và thanh toán
        </p>
      </div>

      {/* Mentor Info */}
      <div className="bg-white rounded-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={data.mentor.avatar}
              alt={data.mentor.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-700 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-purple-950 mb-2">
              {data.mentor.name}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-orange-700" />
                <span className="text-sm">{data.mentor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-orange-700" />
                <span className="text-sm">{data.mentor.phone}</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-white ">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
            <p className="font-semibold text-orange-700 mb-3">
              {data.order.code}
            </p>
            <p className="text-sm text-gray-500 mb-1">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-purple-950">
              {data.order.amount} VNĐ
            </p>
          </div>
        </div>
      </div>

      {/* Booking Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Student Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-orange-700" />
            <h3 className="font-bold text-purple-950 text-lg">
              Thông tin học viên
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Họ tên</span>
              <span className="font-semibold text-gray-900">
                {data.user.name}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Khóa học</span>
              <span className="font-semibold text-gray-900">
                {data.course.title}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Điện thoại</span>
              <span className="font-semibold text-gray-900">
                {data.user.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-700" />
            <h3 className="font-bold text-purple-950 text-lg">
              Thông tin lịch học
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Ngày học</span>
              <span className="font-semibold text-gray-900">
                {data.schedule.date}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Giờ học</span>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-700" />
                <span className="font-semibold text-gray-900">
                  {data.schedule.time}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Hạn thanh toán</span>
              <span className="font-bold text-orange-700">
                {data.order.deadline}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-900 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-6 h-6 text-purple-950" />
          <h3 className="font-bold text-purple-950 text-xl">
            Phương thức thanh toán
          </h3>
        </div>

        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-900 hover:shadow-md transition-all duration-200">
            <img src={VNPayLogo} alt="VNPAY" className="h-8 mx-auto" />
          </div>
          <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-900 hover:shadow-md transition-all duration-200">
            <img src={MoMoLogo} alt="MoMo" className="h-8 mx-auto" />
          </div>
        </div>

        <button className="w-full bg-purple-950 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Xác nhận thanh toán {data.order.amount} VNĐ</span>
          </div>
        </button>
      </div>
    </div>
  );
};
export default PaymentConfirm;
