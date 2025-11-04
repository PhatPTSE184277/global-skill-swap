import { Eye } from 'lucide-react';
import { useState } from 'react';
import InvoiceDetailModal from './InvoiceDetailModal';

const AdminTransactionShow = ({ transaction }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
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
      case 'SUCCESS':
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
        invoice={transaction}
        onClose={() => setShowDetailModal(false)}
      />

      <td className="px-6 py-5 text-sm text-gray-500 font-medium">#{transaction.id}</td>
      <td className="px-6 py-5 text-sm text-gray-600 font-mono">{transaction.gatewayTransactionId}</td>
      <td className="px-6 py-5 text-sm text-gray-900">
        <div className="font-semibold">
          {transaction.fromUser?.fullName || 'N/A'}
        </div>
        <div className="text-xs text-gray-500">
          @{transaction.fromUser?.username || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-5 text-sm font-medium text-gray-900">
        {transaction.amount ? `${transaction.amount.toLocaleString()} ${transaction.currency?.toUpperCase() || 'VND'}` : 'N/A'}
      </td>
      <td className="px-6 py-5">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.transactionStatus)}`}>
          {getStatusText(transaction.transactionStatus)}
        </span>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">
        {transaction.createdAt
          ? new Date(transaction.createdAt).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
          : ''}
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

export default AdminTransactionShow;