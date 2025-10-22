import React from "react";
import { X } from "lucide-react";

const InvoiceDetailModal = ({ open, invoice, onClose }) => {
  if (!open || !invoice) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Chi tiết hóa đơn</h3>
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
              <p className="text-sm text-gray-500 mb-1">ID Hóa đơn</p>
              <p className="font-semibold text-gray-900">#{invoice.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã giao dịch</p>
              <p className="font-mono text-sm text-gray-900">{invoice.transactionNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
              <p className="font-semibold text-gray-900">
                {invoice.totalAmount ? `${invoice.totalAmount.toLocaleString()} ${invoice.currency.toUpperCase()}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.invoiceStatus)}`}>
                {invoice.invoiceStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
              <p className="font-semibold text-gray-900">
                {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày cập nhật</p>
              <p className="font-semibold text-gray-900">
                {invoice.updatedAt ? new Date(invoice.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>

          {invoice.transactionResponses && invoice.transactionResponses.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Giao dịch liên quan</p>
              <div className="border rounded-lg p-3 bg-gray-50">
                {invoice.transactionResponses.map((trans, idx) => (
                  <div key={idx} className="text-sm text-gray-700">
                    {JSON.stringify(trans)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;