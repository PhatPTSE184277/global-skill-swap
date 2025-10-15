import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authSelector, removeAuth } from '../../reduxs/reducers/AuthReducer';
import { Crown } from 'lucide-react';

export default function AdminHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const user = useSelector(authSelector);

  const profile = {
    name: user.username || '',
    email: user.email || '',
    isAdmin: user.accountRole === 'ADMIN',
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    dispatch(removeAuth());
    setShowDropdown(false);
    navigate('/', { state: { loggedOut: true } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 font-poppins border-b border-gray-200 shadow-lg h-16 flex items-center px-8">
      <Link to="/admin/dashboard" className="flex items-center group transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 admin-avatar rounded-full flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-shadow">
          <span className="text-white font-bold text-sm"></span>
        </div>
        <span className="text-gray-900 text-xl font-extrabold tracking-tight">BẢNG ĐIỀU KHIỂN</span>
      </Link>
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative user-dropdown">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            aria-haspopup="true"
            aria-expanded={showDropdown}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-white/80 transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowDropdown(false);
              if (e.key === 'Enter' || e.key === ' ') setShowDropdown(v => !v);
            }}
          >
            <img
              src={
                user.avatarUrl ||
                "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
              }
              alt="Admin Avatar"
              className="h-9 w-9 rounded-full border-2 border-purple-200 shadow-sm object-cover"
            />
            <div className="hidden sm:block text-left min-w-[80px]">
              <p className="font-semibold text-sm leading-tight">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500">
                {profile.isAdmin ? 'Admin' : 'Thành viên'}
              </p>
            </div>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div
              className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 transform transition-all duration-200 ease-out animate-fade-in"
              tabIndex={-1}
              onKeyDown={e => { if (e.key === 'Escape') setShowDropdown(false); }}
            >
              <div className="px-4 py-4 border-b border-gray-100/50">
                <div className="flex items-start gap-3">
                  <img
                    src={
                      user.avatarUrl ||
                      "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                    }
                    alt="Admin Avatar"
                    className="w-12 h-12 rounded-full border-2 border-purple-200 shadow-sm object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-base truncate">{profile.name}</p>
                    <p className="text-sm text-gray-500 truncate" title={profile.email}>
                      {profile.email}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${profile.isAdmin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {profile.isAdmin ? 'Admin' : 'Thành viên'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-200">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Thông tin cá nhân</span>
                </Link>
                <Link
                  to="/profile/change-password"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 group"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center group-hover:from-gray-200 group-hover:to-slate-200 transition-all duration-200">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a4 4 0 10-8 0v2" />
                    </svg>
                  </div>
                  <span className="font-medium">Đổi mật khẩu</span>
                </Link>
                {profile.isAdmin && (
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-200">
                      <svg
                        className="w-4 h-4 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h6m8-11v10a1 1 0 01-1 1h-6"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Trang chủ</span>
                  </Link>
                )}
              </div>
              <div className="border-t border-gray-100/50 my-2"></div>
              <div className="px-2 pb-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200 transition-all duration-200">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}