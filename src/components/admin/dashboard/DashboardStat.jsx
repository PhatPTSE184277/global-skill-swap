import React from 'react';
import { FaUsers, FaUser, FaUserPlus, FaUserShield } from "react-icons/fa";

const DashboardStats = ({ totalMembers, totalUsers, totalMentors, totalAdmins }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FaUsers className="text-indigo-600 text-xl" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Tổng thành viên</p>
          <p className="text-2xl font-bold text-indigo-600">{totalMembers}</p>
        </div>
      </div>
      <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <FaUser className="text-green-600 text-xl" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Người dùng</p>
          <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
        </div>
      </div>
      <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FaUserPlus className="text-blue-600 text-xl" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Mentor</p>
          <p className="text-2xl font-bold text-blue-600">{totalMentors}</p>
        </div>
      </div>
      <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <FaUserShield className="text-red-600 text-xl" />
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">Quản trị viên</p>
          <p className="text-2xl font-bold text-red-600">{totalAdmins}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;