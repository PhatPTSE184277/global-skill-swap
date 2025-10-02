import { useSelector, useDispatch } from "react-redux";
import { authSelector, removeAuth } from "../../reduxs/reducers/AuthReducer";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
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
  const user = useSelector(authSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(removeAuth());
    setShowDropdown(false);
    navigate("/");
  };

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
        {user && user.token ? (
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer rounded-full px-2 py-1 hover:bg-purple-100 transition"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <img
                src={
                  user.avatarUrl ||
                  "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                }
                alt="User Avatar"
                className="h-9 w-9 rounded-full border-2 border-purple-200 shadow-sm object-cover"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-purple-900">
                  {user.username || "User"}
                </span>
                <span className="text-xs text-gray-500 max-w-[120px] truncate">
                  {user.email || ""}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 ml-1 text-purple-700 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-purple-100 rounded-2xl shadow-2xl z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatarUrl ||
                        "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                      }
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full border-2 border-purple-200 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-purple-900 text-base">
                        {user.username || "User"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">
                        {user.email || ""}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 transition rounded-none cursor-pointer"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/profile");
                  }}
                >
                  <User className="w-4 h-4 text-purple-700" />
                  Thông tin cá nhân
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition rounded-none cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  Đăng xuất
                </button>
              </div>
            )}
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
