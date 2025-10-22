import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaChalkboardTeacher,
  FaChevronDown,
  FaStar,
  FaBoxOpen,
  FaExchangeAlt
} from "react-icons/fa";
import { useState } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const menu = [
    {
      label: "Bảng điều khiển",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt className="w-5 h-5 mr-3 text-cyan-500" />,
      color: "cyan",
      desc: "Tổng quan & thống kê",
    },
    {
      label: "Tài khoản",
      path: "/admin/accounts",
      icon: <FaUser className="w-5 h-5 mr-3 text-blue-500" />,
      color: "blue",
      desc: "Quản lý tài khoản người dùng",
    },
    {
      label: "Hồ sơ Mentor",
      path: "/admin/mentorcv",
      icon: <FaChalkboardTeacher className="w-5 h-5 mr-3 text-purple-500" />,
      color: "purple",
      desc: "Quản lý hồ sơ mentor",
    },
    {
      label: "Gói Mentor",
      path: "/admin/products",
      icon: <FaBoxOpen className="w-5 h-5 mr-3 text-teal-500" />,
      color: "teal",
      desc: "Quản lý các gói mentor",
    },
     {
      label: "Quản lý giao dịch",
      path: "/admin/transactions",
      icon: <FaExchangeAlt className="w-5 h-5 mr-3 text-pink-500" />,
      color: "pink",
      desc: "Kiểm tra & quản lý giao dịch",
    },
    {
      label: "Quản lý Feedback",
      path: "/admin/feedbacks",
      icon: <FaStar className="w-5 h-5 mr-3 text-orange-500" />,
      color: "orange",
      desc: "Xem và phản hồi feedback",
    },
    // {
    //   label: 'Diễn đàn',
    //   path: '/admin/forum',
    //   icon: <FaComments className="w-5 h-5 mr-3 text-green-500" />,
    //   color: 'green',
    //   desc: 'Bài viết & bình luận',
    //   children: [
    //     { label: 'Bài viết', path: '/admin/forum/posts', icon: <FaRegFileAlt className="w-4 h-4 mr-2 text-green-400" /> },
    //     { label: 'Bình luận', path: '/admin/forum/comments', icon: <FaClipboardList className="w-4 h-4 mr-2 text-green-400" /> },
    //   ],
    // },
    // {
    //   label: 'Thanh toán',
    //   path: '/admin/payments',
    //   icon: <FaMoneyCheckAlt className="w-5 h-5 mr-3 text-yellow-500" />,
    //   color: 'yellow',
    //   desc: 'Quản lý thanh toán',
    // },
    // {
    //   label: 'Đặt lịch',
    //   path: '/admin/bookings',
    //   icon: <FaCalendarAlt className="w-5 h-5 mr-3 text-pink-500" />,
    //   color: 'pink',
    //   desc: 'Quản lý đặt lịch',
    // },
    // {
    //   label: 'Lịch',
    //   path: '/admin/calendars',
    //   icon: <FaBook className="w-5 h-5 mr-3 text-indigo-500" />,
    //   color: 'indigo',
    //   desc: 'Quản lý lịch',
    // },
    // {
    //   label: 'Tài liệu',
    //   path: '/admin/documents',
    //   icon: <FaFolderOpen className="w-5 h-5 mr-3 text-orange-500" />,
    //   color: 'orange',
    //   desc: 'Quản lý tài liệu',
    // },
    // {
    //   label: 'Phòng họp',
    //   path: '/admin/meetingrooms',
    //   icon: <FaDoorOpen className="w-5 h-5 mr-3 text-teal-500" />,
    //   color: 'teal',
    //   desc: 'Phòng họp & lịch sử họp',
    //   children: [
    //     { label: 'Phòng', path: '/admin/meetingrooms', icon: <FaDoorOpen className="w-4 h-4 mr-2 text-teal-400" /> },
    //     { label: 'Lịch sử', path: '/admin/meetinghistory', icon: <FaHistory className="w-4 h-4 mr-2 text-teal-400" /> },
    //   ],
    // },
    // {
    //   label: 'Phản hồi Mentor',
    //   path: '/admin/mentorfeedback',
    //   icon: <FaClipboardList className="w-5 h-5 mr-3 text-red-500" />,
    //   color: 'red',
    //   desc: 'Phản hồi về mentor',
    // },
    // {
    //   label: 'Đăng ký học',
    //   path: '/admin/registerforstudy',
    //   icon: <FaClipboardList className="w-5 h-5 mr-3 text-gray-500" />,
    //   color: 'gray',
    //   desc: 'Quản lý đăng ký học',
    // },
  ];

  const getMenuClass = (item) => {
    const isActive = location.pathname.startsWith(item.path);
    let activeClass = "";
    if (isActive) {
      if (item.color === "cyan")
        activeClass = "bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600";
      if (item.color === "blue")
        activeClass = "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
      if (item.color === "purple")
        activeClass =
          "bg-purple-50 text-purple-600 border-r-4 border-purple-600";
      if (item.color === "green")
        activeClass = "bg-green-50 text-green-600 border-r-4 border-green-600";
      if (item.color === "yellow")
        activeClass =
          "bg-yellow-50 text-yellow-600 border-r-4 border-yellow-600";
      if (item.color === "pink")
        activeClass = "bg-pink-50 text-pink-600 border-r-4 border-pink-600";
      if (item.color === "indigo")
        activeClass =
          "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600";
      if (item.color === "orange")
        activeClass =
          "bg-orange-50 text-orange-600 border-r-4 border-orange-600";
      if (item.color === "teal")
        activeClass = "bg-teal-50 text-teal-600 border-r-4 border-teal-600";
      if (item.color === "red")
        activeClass = "bg-red-50 text-red-600 border-r-4 border-red-600";
      if (item.color === "gray")
        activeClass = "bg-gray-50 text-gray-600 border-r-4 border-gray-600";
    }
    return `admin-nav-item flex items-center px-4 py-3 rounded-lg text-gray-700 transition-all duration-200 group ${activeClass}`;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto sidebar-scroll pt-20">
      <div className="p-6">
        {menu.map((item) => (
          <div key={item.path}>
            <div
              className={
                getMenuClass(item) + (item.children ? " cursor-pointer" : "")
              }
              onClick={() => {
                if (item.children) {
                  setOpenMenu(openMenu === item.path ? null : item.path);
                } else {
                  navigate(item.path);
                }
              }}
            >
              {item.icon}
              <div className="flex-1">
                <div className="font-medium flex items-center">
                  {item.label}
                  {item.children && (
                    <FaChevronDown
                      className={`ml-2 transition-transform ${openMenu === item.path ? "rotate-180" : ""
                        }`}
                      size={14}
                    />
                  )}
                </div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            </div>
            {item.children && openMenu === item.path && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map((sub) => (
                  <Link
                    to={sub.path}
                    key={sub.path}
                    className={`flex items-center px-3 py-2 rounded text-sm ${location.pathname === sub.path
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {sub.icon}
                    <span className="font-semibold">{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
