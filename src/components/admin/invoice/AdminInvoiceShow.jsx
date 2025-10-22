import { Eye } from 'lucide-react';
import { useState } from 'react';
import InvoiceDetailModal from './InvoiceDetailModal';

const AdminInvoiceShow = ({ invoice }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const getStatusText = (status) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <>
      <InvoiceDetailModal
        open={showDetailModal}
        invoice={invoice}
        onClose={() => setShowDetailModal(false)}
      />

      <td className="px-6 py-5 text-sm text-gray-500 font-medium">#{invoice.id}</td>
      <td className="px-6 py-5 text-sm text-gray-600 font-mono">{invoice.transactionNumber}</td>
      <td className="px-6 py-5 text-sm font-medium text-gray-900">
        {invoice.totalAmount ? `${invoice.totalAmount.toLocaleString()} ${invoice.currency.toUpperCase()}` : 'N/A'}
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.invoiceStatus)}`}>
          {getStatusText(invoice.invoiceStatus)}
        </span>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">
        {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('vi-VN') : ''}
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">
          <button
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            title="Xem chi tiết"
            onClick={() => setShowDetailModal(true)}
          >
            <Eye size={14} />
          </button>
        </div>
      </td>
    </>
  );
};

export default AdminInvoiceShow;