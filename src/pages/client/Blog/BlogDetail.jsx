import React from "react";
import { useParams } from "react-router-dom";
import RightSidebar from "../../../components/client/Blog/RightSidebar";
import {
  Bookmark,
  Heart,
  ImagePlus,
  Navigation,
  SendHorizontal,
} from "lucide-react";
import blogApi from "../../../apis/blogApi"; // Thêm nếu chưa có

const BlogDetail = () => {
  const { id } = useParams();

  // Mock data cho bài viết chi tiết
  const blogPost = {
    id: id,
    title: "Life In Japan: The Good, The Weird, And The Beautiful",
    author: "Joanna Wellick",
    date: "02 December 2022",
    readTime: "3 Min. To Read",
    views: "1.2K views",
    likes: "1.6K likes",
    image:
      "https://images.pexels.com/photos/15861436/pexels-photo-15861436/free-photo-of-japan-and-germany-flag.jpeg",
    tags: ["Japan", "Life"],
    content: `
      <p>A foreigner's personal look at the joys, oddities, and timeless beauty of Japan.</p>
      
      <h2>The Good: Everyday Revelries</h2>
      <p>One of the first things newcomers notice is how exceptionally well things work. Public transport is not only punctual but immaculately clean. Trains arrive on time to the second—and people actually form neat lines to board them.</p>
      
      <p>You'll also find a strong sense of safety. It's common to see children walk home alone or let wallets and cash sit unattended in cafes. It's a quality of life that makes you breathe easier.</p>
      
      <h2>The Weird: Wonderfully Strange Moments</h2>
      <p>Living in Japan means embracing its quirks, whether it's about buying hot ramen, umbrellas, or rice-filled lunch vending machines.</p>
      
      <p>You'll encounter odd rules, mild quirks, and even robot cafes. This throws can be hilariously chaotic, featuring everything from complicated directions to confusing etiquette.</p>
      
      <h2>The Beautiful: Nature, Rituals & Impermanence</h2>
      <p>Japan is a country that has deeply respected aesthetics—it's about appreciating moments.</p>
      
      <p>The seasons aren't just weather changes—they are celebrated. Spring means cherry blossoms (hanami), punctual rice grain yields, and wide-spread cultural offerings.</p>
      
      <h2>Final Thoughts</h2>
      <p>Living in Japan has taught me to slow down and pay attention—to savor tastes, to respect rituals, and to find joy in small things. If you're ever here, embrace the beauty, appreciate the culture, and humility—and Japan will reveal its layers one breathtaking, awe-inspiring, and beautiful moment at a time.</p>
    `,
  };

  // Mock data cho phần bình luận
  const comments = [
    {
      id: 1,
      author: "Brian Jackson",
      date: "December 14, 2017 at 5:13 pm",
      content:
        "I think you forgot to mention a very good one: Thrive architect from themeforest. This thing is pretty powerful.",
      replies: [
        {
          id: 2,
          author: "Joanna Wellick",
          date: "December 14, 2017 at 5:15 pm",
          content:
            "Thanks Brian! We have updated the above post. You are correct, their page builder has both a free and a premium version.",
        },
      ],
    },
    {
      id: 3,
      author: "Brian Jackson",
      date: "December 14, 2017 at 5:13 pm",
      content:
        "I think you forgot to mention a very good one: Thrive architect from themeforest. This thing is pretty powerful.",
      replies: [
        {
          id: 4,
          author: "Joanna Wellick",
          date: "December 14, 2017 at 5:15 pm",
          content:
            "Thanks Brian! We have updated the above post. You are correct, their page builder has both a free and a premium version.",
        },
      ],
    },
  ];

  // State cho bài viết mới nhất
  const [latestPosts, setLatestPosts] = React.useState([]);

  React.useEffect(() => {
    const fetchLatest = async () => {
      const res = await blogApi.getLatestPosts?.();
      if (res?.data) setLatestPosts(res.data.slice(0, 3)); // Lấy 3 bài viết
    };
    fetchLatest();
  }, []);

  return (
    <div className="w-full font-['Noto Sans'] min-h-screen p-10">
      {/* Main Content Container - matching BlogHome layout */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1.5fr] gap-6 max-w-7xl mx-auto">
        {/* Blog Content - spans 2 columns like BlogHome */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Hero Image */}
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />

            {/* Content */}
            <div className="p-10">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {blogPost.tags.map((tag, index) => (
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

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {blogPost.author}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>{blogPost.date}</span>
                    <span>•</span>
                    <span>{blogPost.readTime}</span>
                    <span>•</span>
                    <span>{blogPost.views}</span>
                    <span>•</span>
                    <span>{blogPost.likes}</span>
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
                <div>
                  <Heart
                    size={23}
                    color="#fb5607"
                    strokeWidth={2.5}
                    cursor="pointer"
                  />
                </div>

                <div className="flex gap-6">
                  <Navigation
                    size={23}
                    color="#4D2C5E"
                    strokeWidth={2.5}
                    cursor="pointer"
                  />
                  <Bookmark
                    size={23}
                    color="#4D2C5E"
                    strokeWidth={2.5}
                    cursor="pointer"
                  />
                </div>
              </div>
              {/* Comments Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold mb-4">Bình luận</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Chính sách bình luận: Chúng tôi rất trân trọng các bình luận
                  và thời gian mà độc giả dành để chia sẻ ý tưởng và phản hồi.
                  Tuy nhiên, tất cả bình luận đều được kiểm duyệt thủ công và
                  những bình luận được xem là spam hoặc chỉ mang tính quảng cáo
                  sẽ bị xóa.
                </p>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-gray-100 pb-4"
                    >
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

                          {/* Replies */}
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
                {/* Add Comment */}
                <div className="mt-6 flex items-center gap-3">
                  {/* Avatar */}
                  {/* <img
                    src="/img/avatar.png"
                    className="w-12 h-12 rounded-full object-cover"
                  /> */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  {/* Input box */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {/* Icon group */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      {/* Image icon */}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ImagePlus size={20} />
                      </button>
                      {/* Send icon */}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-orange-500"
                      >
                        <SendHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                  {/* View All link */}
                </div>
              </div>
            </div>
          </article>

          {/* You Might Also Like */}
          <div className="mt-12">
            <h2 className="text-lg font-bold mb-6 text-orange-500">
              You Might Also Like...
            </h2>
            <div className="space-y-6">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex gap-5 cursor-pointer hover:bg-gray-50 rounded-xl p-3 transition"
                  onClick={() => (window.location.href = `/blog/${post.id}`)}
                >
                  <img
                    src={post.image}
                    alt={post.alt}
                    className="w-36 h-24 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      {post.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            idx % 2 === 0
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-base mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
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
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - same position as BlogHome */}
        <div className="mt-0">
          <RightSidebar />
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
