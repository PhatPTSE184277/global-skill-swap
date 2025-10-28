import React, { useState, useContext } from "react";
import { ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2 } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentEdit from "./CommentEdit";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import CommentContext from "../../../../contexts/CommentContext";

const CommentItem = ({ comment, postId, isReply = false }) => {
  const { replies, getRepliesByComment } = useContext(CommentContext);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Lấy reply data từ context
  const replyData = replies[comment.id];
  const commentReplies = replyData?.content || [];
  const replyCount = replyData?.totalElements || 0;

  const formatDate = (date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return "";
    }
  };

  const toggleReplies = async () => {
    if (!showReplies && !replyData) {
      await getRepliesByComment({ parentCommentId: comment.id, page: 0, size: 10 });
    }
    setShowReplies(!showReplies);
  };

  const loadMoreReplies = async () => {
    if (replyData && replyData.currentPage < replyData.totalPages - 1) {
      await getRepliesByComment({ 
        parentCommentId: comment.id, 
        page: replyData.currentPage + 1, 
        size: 10 
      });
    }
  };

  const authorInfo = comment.accountId || {};
  const authorName = authorInfo.fullName || authorInfo.username || "Ẩn danh";
  const avatarUrl = authorInfo.avatarUrl;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-4" : ""}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {authorName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-2xl p-3">
          <div className="flex items-start justify-between mb-1">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm text-gray-900 truncate">
                {authorName}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
                {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                  <span className="ml-1">(đã chỉnh sửa)</span>
                )}
              </p>
            </div>
            <div className="relative ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded-full transition cursor-pointer"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Chỉnh sửa
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <CommentEdit
              comment={comment}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <p className="text-sm text-gray-700 mt-1 break-words">{comment.content}</p>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-4 mt-2 text-xs">
            {!isReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-[#4D2C5E] hover:underline font-medium cursor-pointer"
              >
                Trả lời
              </button>
            )}
            {!isReply && replyCount > 0 && (
              <button
                onClick={toggleReplies}
                className="text-gray-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {showReplies ? (
                  <>
                    <ChevronUp size={14} />
                    Ẩn câu trả lời
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Xem {replyCount} câu trả lời
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {showReplyInput && (
          <div className="mt-3">
            <CommentInput
              postId={postId}
              replyCommentId={comment.id}
              onCancel={() => setShowReplyInput(false)}
              onSuccess={() => {
                setShowReplyInput(false);
                setShowReplies(true);
              }}
              placeholder={`Trả lời ${authorName}...`}
            />
          </div>
        )}

        {showReplies && commentReplies.length > 0 && (
          <div className="mt-3 space-y-3">
            {commentReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                isReply
              />
            ))}
            {replyData && replyData.currentPage < replyData.totalPages - 1 && (
              <button
                onClick={loadMoreReplies}
                className="text-sm text-[#4D2C5E] hover:underline font-medium ml-12 cursor-pointer"
              >
                Xem thêm câu trả lời...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;