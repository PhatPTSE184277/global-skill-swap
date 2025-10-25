import React, { useContext, useState } from "react";
import PostShow from "./PostShow";
import PostSkeleton from "./PostSkeleton";
import PostContext from "../../../../contexts/PostContext";
import PostCreate from "./PostCreate";
import PostDetail from "./PostDetail";

const PostList = () => {
  const { loading, posts, fetchPosts } = useContext(PostContext);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    fetchPosts();
  };

  const handleShowDetail = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setSelectedPost(post);
    setShowDetail(true);
  };

  const mainPosts = posts.filter(post => !post.isRepost);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4D2C5E]">Danh sách bài viết</h2>
        <button
          className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          + Thêm bài viết mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <PostSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        ) : (
          mainPosts.map((post) => (
            <div key={post.id} className="cursor-pointer" onClick={() => handleShowDetail(post.id)}>
              <PostShow post={post} />
            </div>
          ))
        )}
      </div>

      {showModal && (
        <PostCreate
          onClose={() => setShowModal(false)}
          onSuccess={handleModalClose}
        />
      )}

      {showDetail && (
        <PostDetail
          open={showDetail}
          onClose={() => setShowDetail(false)}
          post={selectedPost}
          posts={mainPosts}
        />
      )}
    </div>
  );
};

export default PostList;