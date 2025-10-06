import React, { useEffect, useState } from "react";
import axiosClient from "../../apis/axiosClient";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axiosClient.get("/user/1");
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full font-['Noto Sans'] sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-[#fdf8ee] shadow"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-purple-950">GlobalSkill</span>
        </div>
        <ul className="flex items-center gap-8 text-gray-700 text-sm font-medium">
          <li className="hover:text-purple-700 cursor-pointer">Trang chủ</li>
          <li className="hover:text-purple-700 cursor-pointer">Giới Thiệu</li>
<<<<<<< Updated upstream
          <li className="hover:text-purple-700 cursor-pointer">Bài Viết</li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/room">Phòng học</Link>
=======
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/blog">Bài Viết</Link>
          </li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/meeting">Phòng học</Link>
>>>>>>> Stashed changes
          </li>
          <li className="hover:text-purple-700 cursor-pointer">Mentor</li>
          <li className="hover:text-purple-700 cursor-pointer">Dịch Vụ</li>
        </ul>
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
