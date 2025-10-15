import React from "react";
import { X } from "lucide-react";

const MentorCVModal = ({ open, cvUrl, onClose }) => {
  if (!open || !cvUrl) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-4 w-[90vw] h-[90vh] max-w-5xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">CV Mentor</h3>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full cursor-pointer"
            onClick={onClose}
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>
        <iframe
          src={cvUrl}
          className="w-full h-[calc(100%-60px)] rounded-lg"
          title="CV Preview"
        />
      </div>
    </div>
  );
};

export default MentorCVModal;