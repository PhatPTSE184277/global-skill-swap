import React, { useContext, useEffect, useState } from 'react';
import { FaUserCog, FaSearch } from "react-icons/fa";
import AdminAccountListSkeleton from './AdminAccountListSkeleton';
import AdminAccountList from '../../../components/admin/account/AdminAccountList';
import UserContext from '../../../contexts/admin/UserContext';
import Pagination from '../../../components/admin/Pagination';
import AdminSelect from '../../../components/admin/AdminSelect';
import AdminSearchInput from '../../../components/admin/AdminSearchInput';

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'true', label: 'Hoạt động' },
  { value: 'false', label: 'Đã khóa' },
];

const AdminAccountPage = () => {
  const { users, loading, fetchUsers, totalPages } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [isActive, setIsActive] = useState('all');
  const size = 10;

  useEffect(() => {
    fetchUsers({
      page,
      size,
      ...(isActive !== 'all' ? { isActive: isActive === 'true' } : {})
    });
  }, [fetchUsers, page, size, isActive]);

  const filteredAccounts = users.filter(member =>
    (member.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (member.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Header */}
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

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="w-full md:w-48">
          <AdminSelect
            value={isActive}
            onChange={setIsActive}
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </div>
        <div className="relative w-full md:w-72">
          <AdminSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm thành viên..."
          />
        </div>
      </div>

      <div className="admin-card rounded-xl p-6 bg-white shadow">
        {loading ? (
          <AdminAccountListSkeleton />
        ) : (
          <>
            <AdminAccountList accounts={filteredAccounts} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAccountPage;