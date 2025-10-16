import React, { useContext, useState, useRef, useEffect } from "react";
import PostShow from "./PostShow";
import PostSkeleton from "./PostSkeleton";
import PostContext from "../../../../contexts/PostContext";
import PostCreate from "./PostCreate";
import PostDetail from "./PostDetail";
import { FiGrid, FiRepeat } from "react-icons/fi";

const TABS = [
  { key: "main", icon: <FiGrid size={24} /> },
  { key: "repost", icon: <FiRepeat size={24} /> },
];

const PostList = () => {
  const { loading, posts, fetchPosts } = useContext(PostContext);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [tab, setTab] = useState("main");
  const tabRefs = useRef({});
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const currentTab = tabRefs.current[tab];
    if (currentTab) {
      setUnderlineStyle({
        width: `${currentTab.offsetWidth}px`,
        left: `${currentTab.offsetLeft}px`,
      });
    }
  }, [tab]);

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
  const reposts = posts.filter(post => post.isRepost);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#4D2C5E]">Danh sách bài viết</h2>
        {tab === "main" && (
          <button
            className="bg-gradient-to-r from-purple-700 to-purple-900 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            + Thêm bài viết mới
          </button>
        )}
      </div>
      <div className="relative flex gap-16 border-b border-gray-300 mb-4 justify-center">
        {TABS.map((item) => (
          <button
            key={item.key}
            ref={el => (tabRefs.current[item.key] = el)}
            onClick={() => setTab(item.key)}
            className={`flex items-center justify-center pb-2 pt-2 transition-colors cursor-pointer
        ${tab === item.key ? "text-purple-900" : "text-gray-400 hover:text-purple-700"}
      `}
            style={{ width: 48, height: 48 }}
          >
            {item.icon}
          </button>
        ))}
        <span
          className="absolute bottom-0 h-1 rounded-full bg-purple-900 transition-all duration-300"
          style={underlineStyle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <PostSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        ) : (
          (tab === "main" ? mainPosts : reposts).map((post) => (
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
          posts={tab === "main" ? mainPosts : reposts}
        />
      )}
    </div>
  );
};

export default PostList;