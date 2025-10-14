import React, { useContext, useEffect, useState } from 'react';
import { FaUserCog, FaSearch } from "react-icons/fa";
import AdminAccountSkeleton from './AdminAccountSkeleton';
import AdminAccountList from '../../../components/admin/account/AdminAccountList';
import UserContext from '../../../contexts/UserContext';
import Pagination from '../../../components/admin/Pagination';

const AdminAccountPage = () => {
  const { users, loading, fetchUsers, totalPages } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    fetchUsers({ page, size });
  }, [fetchUsers, page, size]);

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
        {loading ? (
          <AdminAccountSkeleton />
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
