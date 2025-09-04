import React, { useEffect, useState } from "react";
import axiosClient from "../../apis/axiosClient";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // gọi API user (ví dụ lấy id=1)
        const data = await axiosClient.get("/user/1");
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="w-full bg-[#fdf8ee] font-['Noto Sans']">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="GlobalSkill Logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-gray-800">GlobalSkill</span>
        </div>

        {/* Menu */}
        <ul className="flex items-center gap-8 text-gray-700 text-sm font-medium">
          <li className="hover:text-purple-700 cursor-pointer">Trang chủ</li>
          <li className="hover:text-purple-700 cursor-pointer">Giới Thiệu</li>
          <li className="hover:text-purple-700 cursor-pointer">Bài Viết</li>
          <li className="hover:text-purple-700 cursor-pointer">Phòng học</li>
          <li className="hover:text-purple-700 cursor-pointer">Mentor</li>
          <li className="hover:text-purple-700 cursor-pointer">Dịch Vụ</li>
        </ul>

        {/* User */}
        {user ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium text-purple-800">
              {user.name}
            </span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Đang tải...</div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
