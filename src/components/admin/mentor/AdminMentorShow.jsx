import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useState } from "react";
import MentorCVModal from "./MentorCVModal";

const AdminMentorShow = ({ mentor, isSelected, onToggleSelect }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  const isPending = !mentor.isApproved && !mentor.isRejected;

  // Hàm lấy thông tin trạng thái dựa trên applicationStatus
  const getStatusDisplay = () => {
    const status =
      mentor.applicationStatus ||
      (mentor.isApproved
        ? "APPROVED"
        : mentor.isRejected
        ? "REJECT"
        : "PENDING");

    switch (status) {
      case "PENDING":
        return {
          label: "Đang chờ",
          className: "bg-yellow-100 text-yellow-700",
        };
      case "RE_SUBMIT":
        return { label: "Nộp lại", className: "bg-blue-100 text-blue-700" };
      case "APPROVED":
        return {
          label: "Đã chấp nhận",
          className: "bg-green-100 text-green-700",
        };
      case "REJECT":
        return { label: "Đã từ chối", className: "bg-red-100 text-red-700" };
      default:
        return {
          label: "Chờ duyệt",
          className: "bg-yellow-100 text-yellow-700",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <>
      <MentorCVModal
        open={showPdfModal}
        cvUrl={mentor.profileCvUrl}
        onClose={() => setShowPdfModal(false)}
      />

      <td className="px-6 py-5">
        {isPending && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(mentor._id || mentor.id)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />
        )}
      </td>
      <td className="px-6 py-5 text-sm text-gray-500 font-medium">
        #{mentor._id || mentor.id}
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src={
              mentor.avatarUrl ||
              "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
            }
            alt={mentor.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-900">
            {mentor.fullName}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600">{mentor.email}</td>
      <td className="px-6 py-5 text-sm font-medium text-gray-900">
        {mentor.dateOfBirth
          ? new Date(mentor.dateOfBirth).toLocaleDateString()
          : ""}
      </td>
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusDisplay.className}`}
        >
          {statusDisplay.label}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">
          {mentor.profileCvUrl && (
            <button
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title="Xem CV"
              onClick={() => setShowPdfModal(true)}
            >
              <Eye size={14} />
            </button>
          )}
        </div>
      </td>
    </>
  );
};

export default AdminMentorShow;
