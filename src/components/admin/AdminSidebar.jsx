import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaUser, FaChalkboardTeacher, FaComments, FaMoneyCheckAlt, FaCalendarAlt,
  FaBook, FaFolderOpen, FaDoorOpen, FaHistory, FaRegFileAlt, FaClipboardList,
  FaChevronDown, FaListUl, FaPlus
} from 'react-icons/fa';
import { useState } from 'react';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const menu = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <FaTachometerAlt className="w-5 h-5 mr-3 text-cyan-500" />,
      color: 'cyan',
    },
    {
      label: 'Accounts',
      path: '/admin/accounts',
      icon: <FaUser className="w-5 h-5 mr-3 text-blue-500" />,
      color: 'blue',
    },
    {
      label: 'Mentor CVs',
      path: '/admin/mentorcv',
      icon: <FaChalkboardTeacher className="w-5 h-5 mr-3 text-purple-500" />,
      color: 'purple',
    },
    {
      label: 'Forum',
      path: '/admin/forum',
      icon: <FaComments className="w-5 h-5 mr-3 text-green-500" />,
      color: 'green',
      children: [
        { label: 'Posts', path: '/admin/forum/posts', icon: <FaRegFileAlt className="w-4 h-4 mr-2 text-green-400" /> },
        { label: 'Comments', path: '/admin/forum/comments', icon: <FaClipboardList className="w-4 h-4 mr-2 text-green-400" /> },
      ],
    },
    {
      label: 'Payments',
      path: '/admin/payments',
      icon: <FaMoneyCheckAlt className="w-5 h-5 mr-3 text-yellow-500" />,
      color: 'yellow',
    },
    {
      label: 'Bookings',
      path: '/admin/bookings',
      icon: <FaCalendarAlt className="w-5 h-5 mr-3 text-pink-500" />,
      color: 'pink',
    },
    {
      label: 'Calendars',
      path: '/admin/calendars',
      icon: <FaBook className="w-5 h-5 mr-3 text-indigo-500" />,
      color: 'indigo',
    },
    {
      label: 'Documents',
      path: '/admin/documents',
      icon: <FaFolderOpen className="w-5 h-5 mr-3 text-orange-500" />,
      color: 'orange',
    },
    {
      label: 'Meeting Rooms',
      path: '/admin/meetingrooms',
      icon: <FaDoorOpen className="w-5 h-5 mr-3 text-teal-500" />,
      color: 'teal',
      children: [
        { label: 'Rooms', path: '/admin/meetingrooms', icon: <FaDoorOpen className="w-4 h-4 mr-2 text-teal-400" /> },
        { label: 'History', path: '/admin/meetinghistory', icon: <FaHistory className="w-4 h-4 mr-2 text-teal-400" /> },
      ],
    },
    {
      label: 'Mentor Feedback',
      path: '/admin/mentorfeedback',
      icon: <FaClipboardList className="w-5 h-5 mr-3 text-red-500" />,
      color: 'red',
    },
    {
      label: 'Register for Study',
      path: '/admin/registerforstudy',
      icon: <FaClipboardList className="w-5 h-5 mr-3 text-gray-500" />,
      color: 'gray',
    },
  ];

  const getMenuClass = (item) => {
    const isActive = location.pathname.startsWith(item.path);
    let activeClass = '';
    if (isActive) {
      if (item.color === 'cyan') activeClass = 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600';
      if (item.color === 'blue') activeClass = 'bg-blue-50 text-blue-600 border-r-4 border-blue-600';
      if (item.color === 'purple') activeClass = 'bg-purple-50 text-purple-600 border-r-4 border-purple-600';
      if (item.color === 'green') activeClass = 'bg-green-50 text-green-600 border-r-4 border-green-600';
      if (item.color === 'yellow') activeClass = 'bg-yellow-50 text-yellow-600 border-r-4 border-yellow-600';
      if (item.color === 'pink') activeClass = 'bg-pink-50 text-pink-600 border-r-4 border-pink-600';
      if (item.color === 'indigo') activeClass = 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600';
      if (item.color === 'orange') activeClass = 'bg-orange-50 text-orange-600 border-r-4 border-orange-600';
      if (item.color === 'teal') activeClass = 'bg-teal-50 text-teal-600 border-r-4 border-teal-600';
      if (item.color === 'red') activeClass = 'bg-red-50 text-red-600 border-r-4 border-red-600';
      if (item.color === 'gray') activeClass = 'bg-gray-50 text-gray-600 border-r-4 border-gray-600';
    }
    return `admin-nav-item flex items-center px-4 py-3 rounded-lg text-gray-700 transition-all duration-200 group ${activeClass}`;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-40 overflow-y-auto sidebar-scroll pt-20">
      <div className="p-6">
        {menu.map(item => (
          <div key={item.path}>
            <div
              className={getMenuClass(item) + (item.children ? ' cursor-pointer' : '')}
              onClick={() => {
                if (item.children) {
                  setOpenMenu(openMenu === item.path ? null : item.path);
                } else {
                  navigate(item.path); // Chuyển route nếu không có submenu
                }
              }}
            >
              {item.icon}
              <div className="flex-1">
                <div className="font-medium flex items-center">
                  {item.label}
                  {item.children && (
                    <FaChevronDown
                      className={`ml-2 transition-transform ${openMenu === item.path ? 'rotate-180' : ''}`}
                      size={14}
                    />
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {item.label === 'Dashboard' && 'Overview & statistics'}
                  {item.label === 'Accounts' && 'Manage user accounts'}
                  {item.label === 'Mentor CVs' && 'Manage mentor profiles'}
                  {item.label === 'Forum' && 'Forum posts & comments'}
                  {item.label === 'Payments' && 'Manage payments'}
                  {item.label === 'Bookings' && 'Manage bookings'}
                  {item.label === 'Calendars' && 'Manage calendars'}
                  {item.label === 'Documents' && 'Manage documents'}
                  {item.label === 'Meeting Rooms' && 'Rooms & meeting history'}
                  {item.label === 'Mentor Feedback' && 'Feedback for mentors'}
                  {item.label === 'Register for Study' && 'Study registrations'}
                </div>
              </div>
            </div>
            {item.children && openMenu === item.path && (
              <div className="ml-8 mt-1 space-y-1">
                {item.children.map(sub => (
                  <Link
                    to={sub.path}
                    key={sub.path}
                    className={`flex items-center px-3 py-2 rounded text-sm ${
                      location.pathname === sub.path
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
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