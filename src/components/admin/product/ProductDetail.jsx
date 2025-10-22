import React from 'react';
import { X } from 'lucide-react';

const ProductDetail = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Chi tiết gói mentor</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full cursor-pointer"
            onClick={onClose}
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">ID</p>
              <p className="font-semibold text-gray-900">#{product.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tên gói</p>
              <p className="font-semibold text-gray-900">{product.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá</p>
              <p className="font-semibold text-lg text-teal-600">
                {formatPrice(product.price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Loại tiền</p>
              <p className="font-semibold text-gray-900">{product.currency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;