import React, { useState, useEffect } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import userService from "../../services/userService";

const menuItems = ["Tổng quan", "Thông tin liên hệ", "Chi tiết"];

const UserAbout = ({ userId }) => {
  const [active, setActive] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data based on userId
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await userService.getUserById(userId);
          setUserData(response);
          console.log("Fetching user data for ID:", userId);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="flex bg-white rounded-lg shadow min-h-[400px]">
      {/* Menu bên trái */}
      <div className="w-64 border-r border-gray-200 px-6 py-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={item}>
              <button
                className={`w-full text-left px-4 py-2 rounded font-normal ${
                  active === idx
                    ? "bg-purple-950 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActive(idx)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Nội dung bên phải giữ nguyên */}
      <div className="flex-1 p-6">
        {/* Giới thiệu */}
        <p className="text-gray-600 leading-relaxed mb-6">
          Xin chào! Tôi là Sophia, một giáo viên tiếng Anh được chứng nhận với 5
          năm kinh nghiệm. Tôi đã dạy học sinh ở mọi độ tuổi và trình độ, từ
          người mới bắt đầu đến người nói tiếng Anh nâng cao. Tôi tập trung vào
          việc tạo ra một môi trường học tập thú vị và hiệu quả để giúp bạn đạt
          được mục tiêu ngôn ngữ của mình.
        </p>

        {/* Kinh nghiệm */}
        <h3 className="text-lg font-semibold mb-3">Kinh nghiệm</h3>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Giáo viên Tiếng Anh</p>
              <p className="text-gray-500 text-sm">
                Trường Ngôn Ngữ Quốc Tế, 2018 - Hiện tại
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Trợ Giảng</p>
              <p className="text-gray-500 text-sm">
                Trung Tâm Cộng Đồng Học Tập, 2016 - 2018
              </p>
            </div>
          </div>
        </div>

        {/* Học vấn */}
        <h3 className="text-lg font-semibold mb-3">Học vấn</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Thạc sĩ Ngôn ngữ học</p>
              <p className="text-gray-500 text-sm">
                Đại học California, Los Angeles, 2016
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-gray-500 mt-1" />
            <div>
              <p className="font-medium">Cử nhân Tiếng Anh</p>
              <p className="text-gray-500 text-sm">
                Đại học California, Berkeley, 2014
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAbout;
