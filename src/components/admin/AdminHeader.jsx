import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';

export default function AdminHeader() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const profile = {
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
  };

  const handleLogout = () => {
    setShowDropdown(false);
    navigate('/', { replace: true });
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
      {/* Logo */}
      <Link to="/admin/teams" className="flex items-center group transition-all duration-300 hover:scale-105">
        <div className="w-10 h-10 admin-avatar rounded-full flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-shadow">
          <span className="text-white font-bold text-sm">⚽</span>
        </div>
        <span className="text-gray-900 text-xl font-extrabold tracking-tight">ADMIN PANEL</span>
      </Link>
      {/* User section right-aligned */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative user-dropdown">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            aria-haspopup="true"
            aria-expanded={showDropdown}
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-white/80 transition-all duration-200 backdrop-blur-sm border border-transparent hover:border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Escape') setShowDropdown(false);
              if (e.key === 'Enter' || e.key === ' ') setShowDropdown(v => !v);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <span className="text-white font-bold text-sm">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left min-w-[80px]">
              <p className="font-semibold text-sm leading-tight">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500">
                {profile.isAdmin ? 'Admin' : 'Member'}
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
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-gray-100/50">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-base truncate">{profile.name}</p>
                    <p className="text-sm text-gray-500 truncate" title={profile.email}>
                      {profile.email}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${profile.isAdmin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {profile.isAdmin ? (
                        <>
                          <Crown className="w-5 h-5 mr-1 inline-block align-middle text-yellow-500" />
                          Admin
                        </>
                      ) : (
                        'Member'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {/* Menu Items */}
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
                  <span className="font-medium">Profile</span>
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
                  <span className="font-medium">Change Password</span>
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
                    <span className="font-medium">Home</span>
                  </Link>
                )}
              </div>
              {/* Divider */}
              <div className="border-t border-gray-100/50 my-2"></div>
              {/* Logout Button */}
              <div className="px-2 pb-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center group-hover:from-red-200 group-hover:to-pink-200 transition-all duration-200">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}