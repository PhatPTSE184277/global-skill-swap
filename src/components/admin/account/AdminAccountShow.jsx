import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import {  useState } from 'react';
import UserContext from '../../../contexts/admin/UserContext';
import ConfirmModal from '../ConfirmModal';

const AdminAccountShow = ({ account, onDelete, onRestore }) => {
  const [showModal, setShowModal] = useState(false);

  const isDeleted = account.isActive === false;

  const handleAction = () => setShowModal(true);

   const handleConfirm = () => {
    if (isDeleted) {
      onRestore && onRestore(account._id || account.id);
    } else {
      onDelete && onDelete(account._id || account.id);
    }
    setShowModal(false);
  };

  return (
    <>
      <ConfirmModal
        open={showModal}
        title={isDeleted ? "Khôi phục tài khoản" : "Xác nhận xóa tài khoản"}
        message={
          isDeleted
            ? "Bạn có muốn khôi phục tài khoản này không?"
            : "Bạn có chắc muốn xóa tài khoản này?"
        }
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
      <td className="px-6 py-5 text-sm text-gray-500 font-medium">#{account._id || account.id}</td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src={account.avatar || 'https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg'}
            alt={account.username || account.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">{account.username || account.fullName}</span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">{account.email}</td>
      <td className="px-6 py-5 text-sm font-medium text-gray-900">
        {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : ''}
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">{account.accountRole}</td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">
          {/* <button
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil size={14} />
          </button> */}
          {isDeleted ? (
            <button
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title="Restore"
              onClick={handleAction}
            >
              <RotateCcw size={14} />
            </button>
          ) : (
            <button
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title="Delete"
              onClick={handleAction}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </>
  );
};

export default AdminAccountShow;