import React, { useState, useContext } from 'react';
import { X } from 'lucide-react';
import ProductContext from '../../../contexts/admin/ProductContext';
import { toast } from 'react-toastify';

const ProductCreate = ({ isOpen, onClose }) => {
  const { addProduct } = useContext(ProductContext);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'VND'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        name: formData.name,
        price: Number(formData.price),
        currency: formData.currency
      });
      toast.success('Thêm gói mentor thành công!');
      onClose();
      setFormData({ name: '', price: '', currency: 'VND' });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm gói mentor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Thêm gói mentor mới</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={onClose}
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên gói <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ring-offset-2 ring-offset-white transition-all"
                placeholder="Nhập tên gói mentor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ring-offset-2 ring-offset-white transition-all"
                placeholder="Nhập giá"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại tiền <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ring-offset-2 ring-offset-white transition-all"
              >
                <option value="VND">VND</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? 'Đang xử lý...' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;