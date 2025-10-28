import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RightSidebar from "../../../components/client/Blog/RightSidebar";
import { Heart } from "lucide-react";
import TrendingPostContext from "../../../contexts/TrendingPostContext";
import { fetchPostById } from "../../../services/postService";
import CommentSection from "../../../components/user/UserDetail/Comment/CommentSection";

const defaultBlogImage = "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg";

const BlogDetail = () => {
  const { id } = useParams();
  const { 
    likedMap, 
    checkLiked, 
    likePost, 
    unlikePost,
    loadingLikeMap 
  } = useContext(TrendingPostContext);

  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch chi tiết bài viết
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await fetchPostById(id);
        setBlogPost(response.data);
      } catch (error) {
        console.error("Error fetching post detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  // Check liked status
  useEffect(() => {
    if (id && likedMap[id] === undefined) {
      checkLiked(id);
    }
  }, [id, checkLiked, likedMap]);

  // Handle like/unlike
  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLikeMap[id]) return;

    try {
      if (likedMap[id]) {
        await unlikePost(id);
      } else {
        await likePost(id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy bài viết</p>
      </div>
    );
  }

  const isLiked = likedMap[id] === true;

  return (
    <div className="w-full font-['Noto Sans'] min-h-screen p-10 bg-[#fdf8ee]">
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto">
        <div className="lg:col-span-2">
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Hero Image */}
            <img
              src={
                blogPost.imageUrl && blogPost.imageUrl.trim() !== ""
                  ? blogPost.imageUrl
                  : defaultBlogImage
              }
              alt={blogPost.title}
              className="w-full h-96 object-cover"
            />

            {/* Content */}
            <div className="p-10">
              {/* Tags */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded"
                      style={{
                        backgroundImage: 'url("http://ii.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.07)"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <img
                  src="https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {blogPost.accountId?.username || "Anonymous"}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>
                      {new Date(blogPost.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-gray max-w-none">
                <style jsx>{`
                  .prose h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #1f2937;
                  }
                  .prose p {
                    font-size: 0.875rem;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    color: #4b5563;
                  }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
              </div>

              {/* Heart Icon */}
              <div className="flex justify-between my-6">
                <div 
                  onClick={handleLikeClick}
                  className="cursor-pointer hover:scale-110 transition-transform"
                >
                  <Heart
                    size={24}
                    color="#fb5607"
                    fill={isLiked ? "#fb5607" : "none"}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Comment Section - Thay thế phần comment cũ */}
              <CommentSection postId={id} />
            </div>
          </article>

        </div>

        {/* Right Sidebar */}
        <div className="relative group">
          <div className="sticky top-18 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar pointer-events-none group-hover:pointer-events-auto">
            <RightSidebar />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;