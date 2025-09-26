import { CalendarCheck, ChevronRight, MessageSquareMore } from "lucide-react";
import { useEffect, useState } from "react";

export default function NewBlog() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // Mock API giả
    const mockData = [
      {
        id: 1,
        title: "Cuộc Sống Ở Nhật Bản: Những Điều Hay, Lạ Và Đẹp",
        date: "21/4/2024",
        commentCount: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      },
      {
        id: 2,
        title: "Cách Mình Lấy Visa Du Học Úc. Kiểm Tra Thực Tế Từng Bước",
        date: "21/4/2024",
        commentCount: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      },
      {
        id: 3,
        title: "5 Unexpected Things About Living In South Korea",
        date: "21/4/2024",
        commentCount: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      },
    ];

    // Giả lập fetch API (delay 500ms)
    setTimeout(() => setNewsList(mockData), 500);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 my-20">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-12">
        <span className="text-orange-500">Tin Tức</span> Mới Nhất &{" "}
        <span className="text-orange-500">Bài Viết</span> Gần Đây
      </h2>

      {/* Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsList.length > 0 ? (
          newsList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Image có padding + bo góc */}
              <div className="p-5">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>

              {/* Content */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarCheck size={14} /> {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquareMore size={14} /> Bình luận (
                    {item.commentCount})
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                <div className="flex justify-end">
                  <button className="flex items-center gap-2 text-purple-700 bg-purple-100 px-4 py-2 rounded-full hover:bg-purple-200 transition">
                    Đọc Thêm <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            Đang tải dữ liệu...
          </p>
        )}
      </div>
    </section>
  );
}
