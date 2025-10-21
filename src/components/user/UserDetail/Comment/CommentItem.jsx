import React, { useState } from "react";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentEdit from "./CommentEdit";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const CommentItem = ({ comment, postId, allComments, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Lấy replies từ allComments theo parent_id
  const commentReplies = allComments
    ? allComments.filter(c => c.parent_id === comment.id)
    : [];

  const formatDate = (date) => {
    if (!date) return "";
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
  };

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12" : ""}`}>
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{comment.author || "Người dùng"}</h4>
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt || comment.created_at)}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded-full transition cursor-pointer"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    Chỉnh sửa
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                    Xóa
                  </button>
                </div>
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
            <p className="text-gray-700 mt-2">{comment.content}</p>
          )}
        </div>

        <div className="flex gap-4 mt-2 text-sm">
          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-[#4D2C5E] hover:underline cursor-pointer"
          >
            Trả lời
          </button>
          {!isReply && commentReplies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showReplies 
                ? "Ẩn câu trả lời" 
                : `Xem ${commentReplies.length} câu trả lời`
              }
            </button>
          )}
        </div>

        {showReplyInput && (
          <div className="mt-3">
            <CommentInput
              postId={postId}
              replyCommentId={comment.id}
              onCancel={() => setShowReplyInput(false)}
              placeholder={`Trả lời ${comment.author || "người dùng"}...`}
            />
          </div>
        )}

        {showReplies && commentReplies.length > 0 && (
          <div className="mt-4 space-y-3">
            {commentReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                allComments={allComments}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;