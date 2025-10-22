import React from 'react';
import { X } from 'lucide-react';

const ProductDetail = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Chi tiết gói mentor</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={onClose}
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
            <p className="text-gray-900 font-semibold">#{product.id}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">Tên gói</label>
            <p className="text-gray-900 font-semibold">{product.name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">Giá</label>
            <p className="text-gray-900 font-semibold text-lg text-teal-600">{formatPrice(product.price)}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-500 mb-1">Loại tiền</label>
            <p className="text-gray-900 font-semibold">{product.currency}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;