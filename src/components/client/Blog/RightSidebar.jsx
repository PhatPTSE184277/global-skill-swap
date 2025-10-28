import React from "react";
import { useNavigate } from "react-router-dom";

// Component cho tác giả nổi bật
const TopAuthor = ({ avatar, name, title, description, username }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      onClick={() => navigate(`/profile/${username}`)}
    >
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

// Component cho danh mục với biểu đồ tròn
const CategoryItem = ({ name, count }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-gray-700">{name}</span>
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-orange-500">
        {count.toString().padStart(2, "0")}
      </span>
    </div>
  </div>
);

// Component cho bài viết được xem
const PopularPost = ({ title, author, date, readTime, tag, description }) => (
  <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 mb-4 last:mb-0">
    <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded mb-2">
      {tag}
    </span>
    <h4 className="font-medium text-sm line-clamp-2 mb-2 hover:text-purple-600 cursor-pointer transition-colors">
      {title}
    </h4>
    <div className="flex items-center text-xs text-gray-500 mb-2">
      <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
      <span>{author}</span>
      <span className="mx-2">•</span>
      <span>{date}</span>
      <span className="mx-2">•</span>
      <span>{readTime} Min. To Read</span>
    </div>
    {description && (
      <p className="text-xs text-gray-600 line-clamp-3">{description}</p>
    )}
  </div>
);

const RightSidebar = () => {
  // Dữ liệu tác giả nổi bật
  const topAuthors = [
    {
      id: 1,
      name: "Jenny Kia",
      username: "jenny.kia", // thêm username
      title: "Fashion Designer, Blogger, Activist",
      description: "Creating unique fashion content and lifestyle tips",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b192?w=48&h=48&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Andreas Rasel",
      username: "andreas.rasel",
      title: "Blogger for www.panyounglishnet.com",
      description: "English language learning and cultural exchange expert",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Sophia Clark",
      username: "sophia.clark",
      title: "Content Designer, Blogger, Activist",
      description: "Passionate about storytelling and visual design",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face",
    },
  ];

  // Dữ liệu danh mục với percentage cho biểu đồ tròn
  const categories = [
    { name: "Lifestyle", count: 9, percentage: 45 },
    { name: "Visa", count: 6, percentage: 30 },
    { name: "Food", count: 8, percentage: 40 },
    { name: "Healthcare", count: 16, percentage: 80 },
    { name: "Technology", count: 3, percentage: 15 },
  ];

  // Dữ liệu bài viết được xem nhiều
  const popularPosts = [
    {
      id: 1,
      title: "The Truth About Working Part-Time In Japan As A Student",
      author: "Jenny Kia",
      date: "02 December 2022",
      readTime: 5,
      tag: "JAPAN",
      description:
        "Did you come here for something in particular or just general Riker-bashing? And blowing into maximum warp speed, you appeared for an instant to be in two places at once.",
    },
  ];

  // Dữ liệu tag
  const tags = [
    "Japan",
    "Culture",
    "Visa",
    "Food",
    "Healthcare",
    "Life",
    "Guide",
  ];

  return (
    <div className="space-y-6">
      {/* Search Box */}

      <div className="relative m-3 mb-8">
        <input
          type="text"
          placeholder="Tìm Kiếm..."
          className="w-full border border-gray-200 rounded-4xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </div>

      {/* Top Tác Giả Nổi Bật */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Top Tác Giả Nổi Bật
        </h3>
        <div className="space-y-1">
          {topAuthors.map((author) => (
            <TopAuthor key={author.id} {...author} />
          ))}
        </div>
      </div>

      {/* Danh Mục Bài Viết */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Danh Mục Bài Viết
        </h3>
        <div className="space-y-1">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              name={category.name}
              count={category.count}
              percentage={category.percentage}
            />
          ))}
        </div>
      </div>

      {/* Bài Viết Được Xem Nhiều */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">
          Bài Viết Được <span className="text-orange-500">Xem Gần Đây</span>
        </h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <PopularPost
              key={post.id}
              title={post.title}
              author={post.author}
              date={post.date}
              readTime={post.readTime}
              tag={post.tag}
              description={post.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
