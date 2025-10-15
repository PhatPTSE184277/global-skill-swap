import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PostContext from "../../../../contexts/PostContext";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const PostEdit = ({ post, onClose }) => {
  const { updatePost } = useContext(PostContext);
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [isPublic, setIsPublic] = useState(post.isPublic || true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung bài viết!");
      return;
    }
    setLoading(true);
    try {
      await updatePost(post.id, { title, content, isPublic }); // Gọi hàm updatePost từ context
      toast.success("Cập nhật bài viết thành công!");
      onClose(); // Đóng modal
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Cập nhật bài viết thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        {...fadeInUp}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl relative border border-purple-100"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
          aria-label="Đóng"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-[#4D2C5E] mb-6 text-center">
          Chỉnh sửa bài viết
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-[#4D2C5E] bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Nhập tiêu đề bài viết..."
              maxLength={200}
            />
          </div>
          <div className="relative mt-2">
            <MdEditor
              value={content}
              style={{ height: "250px" }}
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={({ text }) => setContent(text)}
              placeholder="Nhập nội dung bài viết bằng markdown..."
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {content.length}/3000 ký tự
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              id="isPublic"
              className="accent-[#4D2C5E] w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="isPublic"
              className="text-sm text-gray-700 select-none cursor-pointer"
            >
              Công khai bài viết
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Cập nhật bài viết"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default PostEdit;