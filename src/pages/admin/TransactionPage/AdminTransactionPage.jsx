import React, { useContext, useEffect, useState } from 'react';
import { FaFileInvoiceDollar } from "react-icons/fa";
import AdminTransactionList from '../../../components/admin/transaction/AdminTransactionList';
import TransactionContext from '../../../contexts/admin/TransactionContext';
import Pagination from '../../../components/admin/Pagination';
import AdminSelect from '../../../components/admin/AdminSelect';
import AdminSearchInput from '../../../components/admin/AdminSearchInput';
import AdminTransactionListSkereton from './AdminTransactionListSkereton';

const statusOptions = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const AdminTransactionPage = () => {
  const { transactions, loading, fetchTransactions, totalPages } = useContext(TransactionContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('all');
  const size = 10;

  useEffect(() => {
    fetchTransactions({ page, size });
  }, [fetchTransactions, page, size]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchSearch = (transaction.transactionNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (transaction.id?.toString() || '').includes(search);

    const matchStatus = status === 'all' || transaction.transactionStatus === status;

    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-300 shadow mr-3">
              <FaFileInvoiceDollar className="text-white text-2xl" />
            </span>
            Quản lý Hóa đơn
          </h1>
          <p className="text-gray-600 mt-2">Xem và quản lý tất cả hóa đơn</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="w-full md:w-48">
          <AdminSelect
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Chọn trạng thái"
          />
        </div>
        <div className="relative w-full md:w-72">
          <AdminSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm hóa đơn..."
          />
        </div>
      </div>

      <div className="admin-card rounded-xl p-6 bg-white shadow">
        {loading ? (
          <AdminTransactionListSkereton />
        ) : (
          <>
            <AdminTransactionList transactions={filteredTransactions} />
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

export default AdminTransactionPage;