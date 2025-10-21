import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import CommentContext from "../../../../contexts/CommentContext";

const CommentEdit = ({ comment, onCancel, onSuccess }) => {
  const { editComment } = useContext(CommentContext);
  const [content, setContent] = useState(comment.content || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    setLoading(true);
    try {
      await editComment({ commentId: comment.id, content });
      toast.success("Đã cập nhật bình luận!");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows={2}
        disabled={loading}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-3 py-1.5 text-sm bg-[#4D2C5E] text-white rounded-lg hover:bg-[#3c204a] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default CommentEdit;