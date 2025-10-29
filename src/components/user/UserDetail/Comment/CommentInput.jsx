import React, { useState, useContext } from "react";
import { SendHorizontal } from "lucide-react";
import { toast } from "react-toastify";
import CommentContext from "../../../../contexts/CommentContext";

const CommentInput = ({ postId, replyCommentId, onCancel, onSuccess, placeholder = "Viết bình luận..." }) => {
  const { addComment, getCommentsByPost, getRepliesByComment, currentPage } = useContext(CommentContext);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setLoading(true);
    try {
      await addComment({ postId, content, replyCommentId });
      toast.success(replyCommentId ? "Đã trả lời bình luận!" : "Đã thêm bình luận!");
      setContent("");
      
      // Refresh comments hoặc replies
      if (replyCommentId) {
        await getRepliesByComment({ parentCommentId: replyCommentId, page: 0, size: 10 });
      } else {
        await getCommentsByPost({ forumPostId: postId, page: currentPage, size: 10 });
      }
      
      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
    } catch (err) {
      toast.error("Có lỗi xảy ra khi gửi bình luận");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={2}
          disabled={loading}
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-[#4D2C5E] text-white rounded-lg hover:bg-[#3c204a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition cursor-pointer"
          >
            <SendHorizontal size={16} />
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentInput;