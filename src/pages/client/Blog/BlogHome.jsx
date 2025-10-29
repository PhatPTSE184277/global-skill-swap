import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import RightSidebar from "../../../components/client/Blog/RightSidebar";
import TrendingPostContext from "../../../contexts/TrendingPostContext";

const defaultBlogImage = "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg";

const BlogHome = () => {
  const navigate = useNavigate();
  const {
    trendingPosts,
    loading,
    getTrendingPosts,
    likedMap,
    checkLiked,
  } = useContext(TrendingPostContext);

  const [activeTab, setActiveTab] = useState("following");
  const [followingPosts, setFollowingPosts] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState([]);

  useEffect(() => {
    getTrendingPosts({ page: 0, size: 20 });
  }, [getTrendingPosts]);

  useEffect(() => {
    trendingPosts.forEach((post) => {
      if (likedMap[post.id] === undefined) {
        checkLiked(post.id);
      }
    });
  }, [trendingPosts, checkLiked, likedMap]);

  useEffect(() => {
    if (trendingPosts.length > 0) {
      const mid = Math.ceil(trendingPosts.length / 2);
      setFollowingPosts(trendingPosts.slice(0, mid));
      setSuggestedPosts(trendingPosts.slice(mid));
    }
  }, [trendingPosts]);

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleAuthorClick = (e, username) => {
    e.stopPropagation();
    navigate(`/profile/${username}`);
  };

  // Custom scrollbar CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #4d2c5e transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4d2c5e;
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #4d2c5e;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Lấy featured posts (2 bài đầu tiên)
  const featuredPosts = trendingPosts.slice(0, 2);

  // Lấy today posts (4 bài tiếp theo)
  const todayPosts = trendingPosts.slice(2, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.main
        className="w-full font-['Noto Sans'] bg-[#fdf8ee] h-auto p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Bên trái: Bài viết nổi bật */}
          <div className="lg:col-span-2 p-6">
            <motion.h2
              className="text-xl font-bold mb-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Những Bài Viết Nổi Bật Của{" "}
              <span className="text-orange-500">Tháng Này</span>
            </motion.h2>

            {loading && featuredPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-2 text-gray-500">Đang tải...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                    whileHover={{
                      y: -5,
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => handlePostClick(post.id)}
                    className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
                  >
                    <motion.img
                      src={
                        post.imageUrl && post.imageUrl.trim() !== ""
                          ? post.imageUrl
                          : defaultBlogImage
                      }
                      alt={post.title}
                      className="w-full h-50 object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.8 + tagIndex * 0.1,
                            }}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.description || post.content}
                      </p>

                      <div className="flex items-center text-xs text-gray-500">
                        <img
                          src="https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                          alt="User Avatar"
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                        <span
                          className="cursor-pointer text-purple-700"
                        >
                          {post.accountId?.username || "Anonymous"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>

          {/* Bên phải: Hôm Nay Có Gì */}
          <motion.aside
            className="p-6 rounded-2xl"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h2
              className="text-xl font-bold mb-4 text-orange-500"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Hôm Nay Có Gì?
            </motion.h2>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {todayPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 },
                  }}
                  onClick={() => handlePostClick(post.id)}
                  className="cursor-pointer hover:text-purple-600 transition-colors duration-200 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <motion.img
                    src={
                      post.imageUrl && post.imageUrl.trim() !== ""
                        ? post.imageUrl
                        : defaultBlogImage
                    }
                    alt={post.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded mb-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {post.tags?.[0] || "Blog"}
                  </motion.span>

                  <h3 className="font-medium line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center text-xs text-gray-500">
                    <img
                      src="https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                    />
                    <span
                      className="cursor-pointer text-purple-700"
                    >
                      {post.accountId?.username || "Anonymous"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {post.description || post.content}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.aside>
        </section>
      </motion.main>

      <motion.section
        className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="col-span-2">
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white pt-6 sticky top-16 z-20">
            </div>


            <div>
              {activeTab === "following" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-500">Đang tải...</p>
                    </div>
                  ) : followingPosts.length > 0 ? (
                    <div className="space-y-4">
                      {followingPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handlePostClick(post.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <motion.img
                              src={
                                post.imageUrl && post.imageUrl.trim() !== ""
                                  ? post.imageUrl
                                  : defaultBlogImage
                              }
                              alt={post.title}
                              className="w-60 h-35 object-cover rounded-xl"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                            <div className="flex-1 p-4">
                              <div className="flex gap-2 mb-2">
                                {post.tags?.map((tag, tagIndex) => (
                                  <motion.span
                                    key={tagIndex}
                                    className={`px-2 py-1 text-xs font-medium rounded ${tagIndex % 2 === 0
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-purple-100 text-purple-600"
                                      }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: tagIndex * 0.1,
                                    }}
                                  >
                                    {tag}
                                  </motion.span>
                                ))}
                              </div>

                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                {post.title}
                              </h3>

                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <img
                                  src="https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                                  alt="User Avatar"
                                  className="w-6 h-6 rounded-full mr-2 object-cover"
                                />
                                <span>{post.accountId?.username || "Anonymous"}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                {post.description || post.content}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                      <p className="text-center text-gray-500 py-4">*Bạn đã xem hết</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có bài viết nào để hiển thị
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "suggestions" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-500">Đang tải...</p>
                    </div>
                  ) : suggestedPosts.length > 0 ? (
                    <div className="space-y-4">
                      {suggestedPosts.map((post, index) => (
                        <motion.article
                          key={post.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handlePostClick(post.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                            <motion.img
                              src={
                                post.imageUrl && post.imageUrl.trim() !== ""
                                  ? post.imageUrl
                                  : defaultBlogImage
                              }
                              alt={post.title}
                              className="w-60 h-35 object-cover rounded-xl"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            />
                            <div className="flex-1 p-4">
                              <div className="flex gap-2 mb-2">
                                {post.tags?.map((tag, tagIndex) => (
                                  <motion.span
                                    key={tagIndex}
                                    className={`px-2 py-1 text-xs font-medium rounded ${tagIndex % 2 === 0
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-purple-100 text-purple-600"
                                      }`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: tagIndex * 0.1,
                                    }}
                                  >
                                    {tag}
                                  </motion.span>
                                ))}
                              </div>

                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                {post.title}
                              </h3>

                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                <span>{post.accountId?.fullName || "Anonymous"}</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                                <span className="mx-2">•</span>
                                <span>{post.readTime || 3} Min. To Read</span>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                {post.description || post.content}
                              </p>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có bài viết đề xuất nào
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <motion.div
          className="mt-6 relative group"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="sticky top-18 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar pointer-events-none group-hover:pointer-events-auto">
            <RightSidebar />
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default BlogHome;