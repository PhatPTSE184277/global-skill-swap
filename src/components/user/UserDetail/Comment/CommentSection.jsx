import React from "react";

const CommentSection = ({ comments }) => (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <h2 className="text-xl font-bold mb-4">Bình luận</h2>
    <p className="text-sm text-gray-500 mb-4">
      Chính sách bình luận: Chúng tôi rất trân trọng các bình luận
      và thời gian mà độc giả dành để chia sẻ ý tưởng và phản hồi.
      Tuy nhiên, tất cả bình luận đều được kiểm duyệt thủ công và
      những bình luận được xem là spam hoặc chỉ mang tính quảng cáo
      sẽ bị xóa.
    </p>
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b border-gray-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm text-gray-900">
                  {comment.author}
                </h3>
                <span className="text-xs text-gray-500">
                  {comment.date}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {comment.content}
              </p>
              {comment.replies &&
                comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="mt-5 ml-6 pl-4 border-l-2 border-gray-200 flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {reply.author}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {reply.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-end mt-4">
      <a
        href="#"
        className="text-xs text-gray-500 underline hover:text-gray-700"
      >
        View All...
      </a>
    </div>
    <div className="mt-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button type="button" className="text-gray-400 hover:text-gray-600">
            {/* icon */}
          </button>
          <button type="button" className="text-gray-400 hover:text-orange-500">
            {/* icon */}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CommentSection;