import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import TrendingPostContext from "../../../contexts/TrendingPostContext";
import RightSidebar from "../../../components/client/Blog/RightSidebar";
import Pagination from "../../../components/client/Blog/Pagination";

function BlogList() {
  const navigate = useNavigate();
  const {
    trendingPosts,
    loading,
    totalPages,
    totalElements,
    currentPage,
    getTrendingPosts,
    likedMap,
    likePost,
    unlikePost,
    checkLiked,
  } = useContext(TrendingPostContext);

  const [page, setPage] = useState(0);
  const size = 10;

  useEffect(() => {
    getTrendingPosts({ page, size });
  }, [page, getTrendingPosts]);

  // Check liked status for all posts
  useEffect(() => {
    trendingPosts.forEach((post) => {
      if (likedMap[post.id] === undefined) {
        checkLiked(post.id);
      }
    });
  }, [trendingPosts, checkLiked, likedMap]);

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleAuthorClick = (e, username) => {
    e.stopPropagation();
    navigate(`/profile/${username}`);
  };

  const handleLikeClick = (e, postId) => {
    e.stopPropagation();
    if (likedMap[postId]) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading && trendingPosts.length === 0) {
    return (
      <div className="w-full font-['Noto Sans'] bg-[#fdf8ee] min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-500">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full font-['Noto Sans'] bg-[#fdf8ee] min-h-screen p-6"
    >
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto">
        {/* Main Content - Trending Posts */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold mb-2">
              Bài Viết <span className="text-orange-500">Trending</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Khám phá {totalElements} bài viết nổi bật nhất
            </p>
          </motion.div>

          {/* Posts List */}
          <div className="space-y-6">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <motion.div
                      className="md:w-80 h-48 md:h-auto flex-shrink-0"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={
                          post.imageUrl ||
                          "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: tagIndex * 0.1 }}
                            className={`px-2 py-1 text-xs font-medium rounded ${tagIndex % 2 === 0
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                              }`}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-xl mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {post.description || post.content}
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                        <span
                          className="cursor-pointer hover:text-purple-700 hover:underline"
                          onClick={(e) =>
                            handleAuthorClick(
                              e,
                              post.authorUsername || post.author
                            )
                          }
                        >
                          {post.author || post.accountId?.fullName}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime || 3} Min. To Read</span>
                      </div>

                      {/* Interaction Buttons */}
                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleLikeClick(e, post.id)}
                          className={`flex items-center gap-2 text-sm transition-colors ${likedMap[post.id]
                              ? "text-red-500"
                              : "text-gray-500 hover:text-red-500"
                            }`}
                        >
                          <Heart
                            size={18}
                            fill={likedMap[post.id] ? "currentColor" : "none"}
                          />
                          <span>{post.likeCount || 0}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <MessageCircle size={18} />
                          <span>{post.commentCount || 0}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500 transition-colors"
                        >
                          <Share2 size={18} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-yellow-500 transition-colors ml-auto"
                        >
                          <Bookmark size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">Không có bài viết nào</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex justify-center bg-white py-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.325 14.825C11.175 14.825 11.025 14.775 10.925 14.65L5.27495 8.90002C5.04995 8.67502 5.04995 8.32503 5.27495 8.10002L10.925 2.35002C11.15 2.12502 11.5 2.12502 11.725 2.35002C11.95 2.57502 11.95 2.92502 11.725 3.15002L6.47495 8.50003L11.75 13.85C11.975 14.075 11.975 14.425 11.75 14.65C11.6 14.75 11.475 14.825 11.325 14.825Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="max-sm:hidden">Trước</span>
                  </button>

                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, idx) => {
                    if (
                      idx === 0 ||
                      idx === totalPages - 1 ||
                      (idx >= currentPage - 1 && idx <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(idx)}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 transition ${currentPage === idx
                              ? "bg-orange-500 text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    } else if (idx === currentPage - 2 || idx === currentPage + 2) {
                      return (
                        <span key={idx} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <span className="max-sm:hidden">Sau</span>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.67495 14.825C5.52495 14.825 5.39995 14.775 5.27495 14.675C5.04995 14.45 5.04995 14.1 5.27495 13.875L10.525 8.50003L5.27495 3.15002C5.04995 2.92502 5.04995 2.57502 5.27495 2.35002C5.49995 2.12502 5.84995 2.12502 6.07495 2.35002L11.725 8.10002C11.95 8.32503 11.95 8.67502 11.725 8.90002L6.07495 14.65C5.97495 14.75 5.82495 14.825 5.67495 14.825Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative group"
        >
          <div className="sticky top-18 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar pointer-events-none group-hover:pointer-events-auto">
            <RightSidebar />
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}

export default BlogList;