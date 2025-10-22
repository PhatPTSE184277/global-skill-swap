import React from 'react';
import AdminInvoiceShow from './AdminInvoiceShow';

const AdminInvoiceList = ({ invoices = [] }) => {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy dữ liệu</h3>
        <p className="text-gray-500">Chưa có hóa đơn nào.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mã giao dịch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Người tạo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((invoice, index) => (
                <tr
                  key={invoice.id || index}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <AdminInvoiceShow invoice={invoice} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoiceList;