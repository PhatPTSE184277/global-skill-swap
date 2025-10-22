import React from 'react';
import ProductShow from './ProductShow';

const ProductList = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy dữ liệu</h3>
        <p className="text-gray-500">Chưa có gói mentor nào được thêm.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200 top-0 z-20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên gói</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loại tiền</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products.map((product, index) => (
                <tr
                  key={product.id || index}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <ProductShow product={product} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;