import { useSelector, useDispatch } from "react-redux";
import { authSelector, removeAuth } from "../../reduxs/reducers/AuthReducer";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import userService from "../../services/userService";

import { Link, useNavigate } from "react-router-dom";

const handleLogoClick = (navigate) => {
  if (window.location.pathname === "/") {
    window.location.reload();
  } else {
    navigate("/");
  }
};

const Header = () => {
  const user = useSelector(authSelector);
  console.log("user in header:", user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setShowServicesDropdown(false);
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

  const handleServicesClick = (path) => {
    setShowServicesDropdown(false);
    navigate(path);
  };

  const handleProfileClick = async () => {
    try {
      setShowDropdown(false);
      // Gọi API /user/me để lấy ID chính xác
      const currentUser = await userService.getCurrentUser();
      if (currentUser && currentUser.id) {
        navigate(`/profile/${currentUser.id}`);
      } else {
        // Fallback nếu không lấy được ID từ API
        console.error("Cannot get user ID from API");
        // Có thể hiển thị thông báo lỗi hoặc redirect về trang khác
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      // Xử lý lỗi - có thể hiển thị thông báo hoặc redirect
    }
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
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/blog">Bài Viết</Link>
          </li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/meeting">Phòng học</Link>
          </li>
          <li className="hover:text-purple-700 cursor-pointer">
            <Link to="/mentor/finding">Mentor</Link>
          </li>
          <li className="relative" ref={servicesDropdownRef}>
            <div
              className="hover:text-purple-700 cursor-pointer flex items-center gap-1"
              onClick={() => setShowServicesDropdown(!showServicesDropdown)}
            >
              Dịch Vụ
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showServicesDropdown ? "rotate-180" : ""
                }`}
              />
            </div>
            {showServicesDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-purple-100 rounded-lg shadow-lg z-50 animate-fade-in">
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition rounded-t-lg"
                  onClick={() => handleServicesClick("/mentor/register")}
                >
                  Đăng ký Mentor
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  onClick={() => handleServicesClick("/faq")}
                >
                  FAQ
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition rounded-b-lg"
                  onClick={() => handleServicesClick("/contact")}
                >
                  Contact
                </button>
              </div>
            )}
          </li>
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
                  onClick={handleProfileClick}
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
