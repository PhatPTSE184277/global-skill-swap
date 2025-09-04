import React from "react";
import { useNavigate } from "react-router-dom";
import RightSidebar from "../../../components/client/Blog/RightSidebar";
import blogApi from "../../../apis/blogApi";

const BlogHome = () => {
  const navigate = useNavigate();

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = React.useState("following");
  // State để quản lý dữ liệu từ API
  const [followingPosts, setFollowingPosts] = React.useState([]);
  const [suggestedPosts, setSuggestedPosts] = React.useState([]);
  const [latestPosts, setLatestPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Function để handle click vào bài viết
  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  // Fetch data khi component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [followingResponse, suggestedResponse, latestResponse] =
          await Promise.all([
            blogApi.getFollowingPosts(),
            blogApi.getSuggestedPosts(),
            blogApi.getLatestPosts(),
          ]);

        setFollowingPosts(followingResponse.data);
        setSuggestedPosts(suggestedResponse.data);
        setLatestPosts(latestResponse.data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Thêm CSS cho thanh cuộn tùy chỉnh
  React.useEffect(() => {
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Dữ liệu bài viết nổi bật
  const featuredPosts = [
    {
      id: 1,
      image:
        "https://images.pexels.com/photos/15861436/pexels-photo-15861436/free-photo-of-japan-and-germany-flag.jpeg",
      alt: "Japan vs Germany",
      title: "Japan vs. Germany: Which Country Is Better For Studying Abroad?",
      description:
        "Bento boxes or bratwurst? I've studied in both countries. Here's how tuition, lifestyle, and culture shock compare side-by-side.",
      tags: ["Study Abroad", "Japan", "Germany"],
      author: "Jenny Kiaa",
      date: "02 December 2022",
      readTime: 3,
    },
    {
      id: 2,
      image:
        "https://images.pexels.com/photos/161892/bowing-japanese-greeting-apologize-161892.jpeg",
      alt: "Korean Etiquette",
      title:
        "Korean Etiquette That Surprised Me (And Almost Got Me in Trouble)",
      description:
        "Did you come here for something in particular or just general Riker-bashing? And blowing into",
      tags: ["Cultural", "Korea", "Life"],
      author: "Jenny Kiaa",
      date: "02 December 2022",
      readTime: 3,
    },
  ];

  // Dữ liệu bài viết hôm nay
  const todayPosts = [
    {
      id: 1,
      title: "Design Is The Mix Of Emotions",
      author: "Jenny Kiaa",
      date: "02 December 2022",
      readTime: 3,
      tag: "Travel",
    },
    {
      id: 2,
      title: "Design Is The Mix Of Emotions",
      author: "Jenny Kiaa",
      date: "02 December 2022",
      readTime: 3,
      tag: "Travel",
    },
    {
      id: 3,
      title: "The Art of Minimalist Design",
      author: "Jenny Kiaa",
      date: "01 December 2022",
      readTime: 4,
      tag: "Design",
    },
    {
      id: 4,
      title: "Understanding User Experience",
      author: "Jenny Kiaa",
      date: "30 November 2022",
      readTime: 5,
      tag: "UX",
    },
  ];

  return (
    <div>
      <main className="w-full font-['Noto Sans'] bg-[#fdf8ee] h-auto p-6">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Bên trái: Bài viết nổi bật */}
          <div className="lg:col-span-2  p-6">
            <h2 className="text-xl font-bold mb-4">
              Những Bài Viết Nổi Bật Của{" "}
              <span className="text-orange-500">Tháng Này</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-full h-50 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.description}
                    </p>

                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime} Min. To Read</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Bên phải: Hôm Nay Có Gì */}
          <aside className=" p-6 rounded-2xl ">
            <h2 className="text-xl font-bold mb-4 text-orange-500">
              Hôm Nay Có Gì?
            </h2>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {todayPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="cursor-pointer hover:text-purple-600 transition-colors duration-200 pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded mb-2">
                    {post.tag}
                  </span>

                  <h3 className="font-medium line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center text-xs text-gray-500">
                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime} Min. To Read</span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    Did you come here for something in particular or just
                    general Riker-bashing? And blowing into maximum warp
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>
      </main>
   <section className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto">
        <div className="col-span-2">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl p-6 ">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("following")}
                  className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
                    activeTab === "following"
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>Đang Theo Dõi</span>
                </button>
                <button
                  onClick={() => setActiveTab("suggestions")}
                  className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
                    activeTab === "suggestions"
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span> Đề Xuất Cho Bạn</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "following" && (
                <div>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-500">Đang tải...</p>
                    </div>
                  ) : followingPosts.length > 0 ? (
                    <div className="space-y-4">
                      {followingPosts.map((post) => (
                        <article key={post.id}>
                          <div
                            onClick={() => handlePostClick(post.id)}
                            className="flex cursor-pointerpointer  items-center "
                          >
                            <img
                              src={post.image}
                              alt={post.alt}
                              className="w-60 h-35 object-cover rounded-xl  "
                            />
                            <div className="flex-1 p-4">
                              <div className="flex gap-2 mb-2">
                                {post.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 text-xs font-medium rounded ${
                                      index % 2 === 0
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-purple-100 text-purple-600"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <h3 className="font-semibold text-lg mb-2">
                                {post.title}
                              </h3>

                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                <span>{post.author}</span>
                                <span className="mx-2">•</span>
                                <span>{post.date}</span>
                                <span className="mx-2">•</span>
                                <span>{post.readTime} Min. To Read</span>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                {post.description}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                      {/* Button Xem Thêm */}
                      <div className="flex justify-end mt-8">
                        <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-all duration-200">
                          Xem Thêm
                          <span>
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-7-7l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có bài viết nào để hiển thị
                    </div>
                  )}
                </div>
              )}

              {activeTab === "suggestions" && (
                <div>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-500">Đang tải...</p>
                    </div>
                  ) : suggestedPosts.length > 0 ? (
                    <div className="space-y-4">
                      {suggestedPosts.map((post) => (
                        <article key={post.id}>
                          <div
                            onClick={() => handlePostClick(post.id)}
                            className="flex cursor-pointer hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          >
                            <img
                              src={post.image}
                              alt={post.alt}
                              className="w-60 h-35 object-cover rounded-xl"
                            />
                            <div className="flex-1 p-4">
                              <div className="flex gap-2 mb-2">
                                {post.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 text-xs font-medium rounded ${
                                      index % 2 === 0
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-purple-100 text-purple-600"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <h3 className="font-semibold text-lg mb-2">
                                {post.title}
                              </h3>

                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                                <span>{post.author}</span>
                                <span className="mx-2">•</span>
                                <span>{post.date}</span>
                                <span className="mx-2">•</span>
                                <span>{post.readTime} Min. To Read</span>
                              </div>

                              <p className="text-sm text-gray-600 line-clamp-2">
                                {post.description}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                      {/* Button Xem Thêm */}
                      <div className="flex justify-end mt-8">
                        <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-all duration-200">
                          Xem Thêm
                          <span>
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14m-7-7l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có bài viết đề xuất nào
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bài Viết Mới Nhất Section */}
            <div className="bg-white rounded-xl p-6">
              {/* Header với button */}
              <div className="bg-purple-950 text-white rounded-xl p-6 mb-6 text-center">
                <h2 className="text-xl font-bold mb-3">
                  "Bắt Đầu Bài Viết Tuyệt Vời Của Bạn"
                </h2>
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-200">
                  Bài viết mới...
                </button>
              </div>

              <h2 className="text-xl font-bold mb-4">
                Bài Viết <span className="text-orange-500">Mới Nhất</span>
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-2 text-gray-500">Đang tải...</p>
                </div>
              ) : latestPosts.length > 0 ? (
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <article key={post.id}>
                      <div
                        onClick={() => handlePostClick(post.id)}
                        className="flex cursor-pointer items-center "
                      >
                        <img
                          src={post.image}
                          alt={post.alt}
                          className="w-60 h-35 object-cover rounded-xl"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex gap-2 mb-2">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  index % 2 === 0
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-purple-100 text-purple-600"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-semibold text-lg mb-2">
                            {post.title}
                          </h3>

                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                            <span>{post.author}</span>
                            <span className="mx-2">•</span>
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span>{post.readTime} Min. To Read</span>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có bài viết mới nào
                </div>
              )}
            </div>

            {/* Button Xem Thêm */}
            <div className="flex justify-end mt-8">
              <button className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-all duration-200">
                Xem Thêm
                <span>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-7-7l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Right Sidebar */}
        <div className="mt-6">
          <RightSidebar />
        </div>
      </section>
    </div>
  );
};

export default BlogHome;
