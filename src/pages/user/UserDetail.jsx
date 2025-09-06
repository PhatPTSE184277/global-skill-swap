import React, { useEffect, useRef, useState } from "react";
import blogApi from "../../apis/blogApi";
import UserAbout from "./UserAbout";

const UserDetail = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about"); // mặc định vào Giới thiệu
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef({});

  const tabs = [
    { key: "about", label: "Giới thiệu" },
    { key: "posts", label: "Bài viết" },
    { key: "lectures", label: "Bài giảng" },
    { key: "reviews", label: "Đánh giá" },
    { key: "schedule", label: "Lịch trình" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await blogApi.getFollowingPosts();
      setPosts(res.data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setUnderlineStyle({
        width: `${currentTab.offsetWidth}px`,
        left: `${currentTab.offsetLeft}px`,
      });
    }
  }, [activeTab]);

  return (
    <div className="font-['Noto Sans'] min-h-screen">
      <div>
        {/* Tabs chữ */}
        <div className="relative flex gap-8 max-w-4xl mx-auto border-b-2 border-gray-200 ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-purple-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-0.5 bg-purple-900 transition-all duration-300"
            style={underlineStyle}
          />
        </div>

        {/* Nội dung theo tab */}
        <div className="max-w-5xl mx-auto gap-10 py-10">
          {activeTab === "about" && <UserAbout />}{" "}
          {activeTab === "posts" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {loading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl shadow flex flex-col animate-pulse"
                      >
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow p-5 flex flex-col"
                    >
                      <img
                        src={post.image}
                        alt={post.alt}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <div className="flex gap-2 mb-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-[#4D2C5E]">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} Min. To Read</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "lectures" && (
            <div className="text-center text-gray-500 py-10">
              Đây là phần Bài giảng.
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="text-center text-gray-500 py-10">
              Đây là phần Đánh giá.
            </div>
          )}
          {activeTab === "schedule" && (
            <div className="text-center text-gray-500 py-10">
              Đây là phần Lịch trình.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
