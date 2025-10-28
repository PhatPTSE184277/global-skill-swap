import React, { useContext, useEffect, useState } from "react";
import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import CommentContext from "../../../../contexts/CommentContext";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

const CommentSection = ({ postId }) => {
  const {
    comments,
    loading,
    totalElements,
    totalPages,
    currentPage,
    getCommentsByPost,
  } = useContext(CommentContext);

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (postId) {
      getCommentsByPost({ forumPostId: postId, page, size: 10 });
    }
  }, [postId, page, getCommentsByPost]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={20} className="text-[#4D2C5E]" />
        <h3 className="text-lg font-semibold text-gray-900">
          Bình luận ({totalElements})
        </h3>
      </div>

      <div className="mb-6">
        <CommentInput postId={postId} />
      </div>

      {loading && comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Chưa có bình luận nào</p>
          <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên bình luận!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Trang {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;