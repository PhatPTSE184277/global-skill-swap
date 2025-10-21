import React, { useContext, useEffect, useState } from 'react';
import { FaBoxOpen, FaPlus } from "react-icons/fa";
import AdminProductListSkeleton from './AdminProductListSkeleton';
import ProductList from '../../../components/admin/product/ProductList';
import ProductCreate from '../../../components/admin/product/ProductCreate';
import ProductContext from '../../../contexts/admin/ProductContext';
import Pagination from '../../../components/admin/Pagination';
import AdminSearchInput from '../../../components/admin/AdminSearchInput';

const AdminProductPage = () => {
  const { products, loading, fetchProducts, totalPages } = useContext(ProductContext);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const size = 10;

  useEffect(() => {
    fetchProducts({
      page,
      size,
      sortBy: 'id',
      sortDir: 'desc'
    });
  }, [fetchProducts, page, size]);

  const filteredProducts = products.filter(product =>
    (product.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-300 shadow mr-3">
              <FaBoxOpen className="text-white text-2xl" />
            </span>
            Quản lý Gói Mentor
          </h1>
          <p className="text-gray-600 mt-2">Quản lý các gói dịch vụ mentor</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-lg"
        >
          <FaPlus size={16} />
          Thêm gói mới
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-72 ml-auto">
          <AdminSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm gói mentor..."
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card rounded-xl p-6 bg-white shadow">
        {loading ? (
          <AdminProductListSkeleton />
        ) : (
          <>
            <ProductList products={filteredProducts} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ProductCreate
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default AdminProductPage;