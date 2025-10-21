import { Pencil, Eye } from 'lucide-react';
import { useState } from 'react';
import ProductEdit from './ProductEdit';
import ProductDetail from './ProductDetail';

const ProductShow = ({ product }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <>
      <td className="px-6 py-5 text-sm text-gray-500 font-medium">#{product.id}</td>
      <td className="px-6 py-5">
        <span className="text-sm font-medium text-gray-900">{product.name}</span>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">{formatPrice(product.price)}</td>
      <td className="px-6 py-5 text-sm font-medium text-gray-900">{product.currency}</td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">
          <button
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            title="View"
            onClick={() => setShowDetailModal(true)}
          >
            <Eye size={14} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            title="Edit"
            onClick={() => setShowEditModal(true)}
          >
            <Pencil size={14} />
          </button>
        </div>
      </td>

      <ProductEdit
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
      />

      <ProductDetail
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductShow;