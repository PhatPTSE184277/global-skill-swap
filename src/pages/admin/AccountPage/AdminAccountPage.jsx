import { useEffect, useState } from 'react';
import axiosClient from '../../../apis/axiosClient';
import { FaUserCog, FaUser, FaEnvelope, FaSearch, FaSpinner, FaUserShield, FaUsers, FaUserPlus } from "react-icons/fa";
import { toast } from 'react-toastify';
import AdminAccountSkeleton from './AdminAccountSkeleton';

const AdminAccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/accounts');
      setAccounts(res.data.members || []);
    } catch (err) {
      toast.error('Lỗi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const totalMembers = accounts.length;
  const totalUsers = accounts.filter(a => a.role === 'user').length;
  const newestMember = accounts.length > 0 ? accounts[0] : null;

  const filteredAccounts = accounts.filter(member =>
    (member.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (member.membername || '').toLowerCase().includes(search.toLowerCase()) ||
    (member.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-300 shadow mr-3">
              <FaUserCog className="text-white text-2xl" />
            </span>
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600 mt-2">Quản lý tài khoản thành viên</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <p className="text-gray-600 text-sm font-medium">Người dùng thường</p>
            <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaUserPlus className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">Thành viên mới nhất</p>
            <p className="text-2xl font-bold text-blue-600">
              {newestMember
                ? new Date(newestMember.createdAt).toLocaleDateString()
                : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm thành viên..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Members Table */}
      <div className="admin-card rounded-xl p-6 bg-white shadow">
        <div className="table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading ? (
            <AdminAccountSkeleton />
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy thành viên</h3>
              <p className="text-gray-500">Chưa có thành viên nào được đăng ký.</p>
            </div>
          ) : (
            <table className="data-table w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-700">Họ tên</th>
                  <th className="text-left font-semibold text-gray-700">Tên đăng nhập</th>
                  <th className="text-left font-semibold text-gray-700">Email</th>
                  <th className="text-left font-semibold text-gray-700">Năm sinh</th>
                  <th className="text-left font-semibold text-gray-700">Vai trò</th>
                  <th className="text-left font-semibold text-gray-700">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((member) => (
                  <tr
                    key={member._id}
                    className="member-row border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center">
                            {member.name}
                            {member.isAdmin && (
                              <FaUserShield className="text-red-500 ml-2 text-sm" title="Quản trị viên" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">ID: {member._id?.toString().slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">@{member.membername}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">{member.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">{member.YOB}</div>
                      <div className="text-sm text-gray-400">
                        Tuổi: {member.YOB ? new Date().getFullYear() - member.YOB : "?"}
                      </div>
                    </td>
                    <td className="p-4">
                      {member.isAdmin ? (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center">
                          <FaUserShield className="mr-1" />Quản trị viên
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                          <FaUser className="mr-1" />Người dùng
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600">
                        {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "?"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {member.createdAt ? new Date(member.createdAt).toLocaleTimeString() : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccountPage;