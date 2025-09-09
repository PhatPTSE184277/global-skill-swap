import React, { useState, useEffect } from "react";
import VNPayLogo from "../../img/svg/vnpay.svg";
import MoMoLogo from "../../img/svg/momo.svg";

export default function PaymentConfirm() {
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
      time: "3:00pm",
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

  const [data, setData] = useState(null);

  useEffect(() => {
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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 mt-6">
      {/* Header */}
      <div className="text-xl font-semibold mb-5 text-orange-600">
        Xác nhận đăng ký buổi học
      </div>
      <div className="flex items-center gap-5 border-b border-gray-300 pb-5">
        <img
          src={data.mentor.avatar}
          alt={data.mentor.name}
          className="w-20 h-20 rounded-lg object-cover"
        />

        <div className="flex-1">
          <div className="font-medium text-gray-700">{data.mentor.name}</div>
          <div className="text-xs text-gray-500">{data.mentor.language}</div>
          <div className="text-xs text-gray-500">{data.mentor.phone}</div>
          <div className="text-xs text-gray-500">{data.mentor.email}</div>
        </div>
        <div className="text-right min-w-[120px]">
          <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium mb-2 inline-block">
            {data.order.code}
          </div>
          <div className="text-xs text-gray-500">Số tiền cần thanh toán</div>
          <div className="text-lg font-bold text-gray-800">
            {data.order.amount} VND
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col md:flex-row gap-6 py-6">
        <div className="bg-gray-50 rounded-lg p-5 flex-1">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="font-semibold text-gray-600">Người đăng ký</div>
            <div className="text-gray-700">{data.user.name}</div>

            <div className="font-semibold text-gray-600">Nội dung học</div>
            <div className="text-gray-700">{data.course.title}</div>

            <div className="font-semibold text-gray-600">Số điện thoại</div>
            <div className="text-gray-700">{data.user.phone}</div>

            <div className="font-semibold text-gray-600">Email</div>
            <div className="text-gray-700">{data.user.email}</div>

            <div className="font-semibold text-gray-600">Ngày đặt lịch</div>
            <div className="text-gray-700">{data.booking.date}</div>

            <div className="font-semibold text-gray-600">Ngày học</div>
            <div className="text-gray-700">
              {data.schedule.date} - {data.schedule.time}
            </div>

            <div className="font-semibold text-gray-600">
              Thời hạn thanh toán
            </div>
            <div className="font-bold text-gray-900">{data.order.deadline}</div>

            <div className="font-semibold text-gray-600">Mã tham chiếu</div>
            <div className="text-gray-700">{data.order.reference}</div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-4">
        <div className="text-base font-semibold text-purple-900 mb-6">
          Phương Thức Thanh Toán
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex gap-10 items-center">
            <img src={VNPayLogo} alt="VNPAY" className="h-8" />
            <img src={MoMoLogo} alt="MoMo" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
