import React from 'react';
import AdminMentorShow from './AdminMentorShow';

const AdminMentorList = ({ mentors = [], selectedIds = [], onToggleSelect, onToggleSelectAll, allSelected }) => {
  if (!mentors || mentors.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy dữ liệu</h3>
        <p className="text-gray-500">Chưa có CV nào được gửi.</p>
      </div>
    );
  }

  const hasPendingCVs = mentors.some(m => !m.isApproved && !m.isRejected);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200 top-0 z-20">
              <tr>
                <th className="px-6 py-4 text-left">
                  {hasPendingCVs && (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onToggleSelectAll}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mentor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày sinh</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {mentors.map((mentor, index) => (
                <tr
                  key={mentor._id || index}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <AdminMentorShow
                    mentor={mentor}
                    isSelected={selectedIds.includes(mentor._id || mentor.id)}
                    onToggleSelect={onToggleSelect}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMentorList;