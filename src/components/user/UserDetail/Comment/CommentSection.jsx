import React, { useContext, useEffect, useState } from "react";
import CommentContext from "../../../../contexts/CommentContext";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

const CommentSection = ({ postId }) => {
  const { comments, loading, getCommentsByPost } = useContext(CommentContext);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (postId) {
      getCommentsByPost({ forumPostId: postId, page, size: 10 });
    }
  }, [postId, page, getCommentsByPost]);

  // Chỉ lấy comment gốc (parent_id == null hoặc undefined)
  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bình luận</h3>
      <CommentInput postId={postId} />
      {loading ? (
        <div className="text-center py-4 text-gray-500">Đang tải bình luận...</div>
      ) : (
        <div className="space-y-4 mt-6">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              allComments={comments}
            />
          ))}
          {rootComments.length === 0 && (
            <p className="text-center text-gray-500 py-4">Chưa có bình luận nào</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;