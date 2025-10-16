import React from "react";
import ReactMarkdown from "react-markdown";
import { Heart, MessageCircle } from "lucide-react";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const PostShow = ({ post }) => {
  const DEFAULT_IMAGE = `https://picsum.photos/seed/${post.id}/300/200`;

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition-shadow p-5 flex flex-col gap-2 h-[400px] justify-between group relative">
      <div className="relative mb-4">
        <img
          src={post.image || DEFAULT_IMAGE}
          alt={post.title || "Ảnh bài viết"}
          className="w-full h-44 object-cover rounded-xl border"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
          <div className="flex items-center gap-2 text-white text-lg font-semibold">
            <Heart size={28} className="mr-2" />
            {post.likes ?? 0}
          </div>
          <div className="flex items-center gap-2 text-white text-lg font-semibold">
            <MessageCircle size={28} className="mr-2" />
            {post.comments ?? 0}
          </div>
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-2 text-[#4D2C5E] line-clamp-2">
        {post.title && post.title.trim()}
      </h3>
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <span>{formatDate(post.createdAt)}</span>
        {post.isPublic ? (
          <>
            <span className="mx-2">•</span>
            <span className="text-green-600">Công khai</span>
          </>
        ) : (
          <>
            <span className="mx-2">•</span>
            <span className="text-red-500">Riêng tư</span>
          </>
        )}
      </div>
      <div className="text-sm text-gray-700 flex-1">
        <div className="line-clamp-2 overflow-hidden prose prose-sm">
          {post.content ? (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          ) : (
            "Không có nội dung"
          )}
        </div>
      </div>
    </div>
  );
};

export default PostShow;