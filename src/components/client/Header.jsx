import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const handleLogoClick = (navigate) => {
  if (window.location.pathname === "/") {
    window.location.reload();
  } else {
    navigate("/");
  }
};

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axiosClient.get("/user/1");
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="w-full font-['Noto Sans'] bg-[#fdf8ee] shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleLogoClick(navigate)}
        >
          <span className="text-lg font-bold text-purple-950">GlobalSkill</span>
        </div>
        <ul className="flex items-center gap-8 text-gray-700 text-sm font-medium">
          <li className="hover:text-purple-700 cursor-pointer">Trang chủ</li>
          <li className="hover:text-purple-700 cursor-pointer">Giới Thiệu</li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/blog">Bài Viết</Link>
          </li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/room">Phòng học</Link>
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
          <button
            className="bg-purple-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
