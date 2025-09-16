import React, { useState } from "react";
import TQ from "../../img/svg/tq.svg";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  Search,
} from "lucide-react";

const avatars = [
  "https://i.pravatar.cc/100?img=5",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1464306076886-debede1a7c94?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1464306076886-debede1a7c94?auto=format&fit=facearea&w=100&h=100",
];

const data = [
  {
    id: 1,
    title: "Làm quen với tiếng Trung",
    author: "Matthew E. McNatt",
    duration: "2h",
    img: TQ,
    rating: 5,
    joined: "3/10",
  },
  {
    id: 2,
    title: "Luyện nghe Ielts",
    author: "Tracy D. Wright",
    duration: "2h",
    img: TQ,
    rating: 4,
    joined: "3/10",
  },
  {
    id: 3,
    title: "Ôn tập HSK 1",
    author: "Cynthia A. Nelson",
    duration: "2h",
    img: TQ,
    rating: 4,
    joined: "3/10",
  },
];

export default function PublicRoom() {
  const [page, setPage] = useState(1);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col  gap-6">
        <div className="flex justify-start gap-8 ml-20">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="avatar"
              className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
              style={{ background: "#fff" }}
            />
          ))}
        </div>
        <div className="flex justify-between gap-6">
          <h1 className="text-xl font-semibold mt-2">
            Phòng Học <span className="text-orange-500">Miễn Phí</span>
          </h1>

          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              placeholder="Mentor hoặc nội dung phòng học..."
              className="w-full rounded-full  px-12 py-2 shadow focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <p className="text-xs italic text-black mt-1">
            Tuần Này Bạn Đã Tham Gia{" "}
            <span className="font-bold text-orange-500">1/3</span> Phòng Học
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {data.concat(data).map((item, idx) => (
          <div
            key={item.id + idx}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-32  rounded-2xl"
            />
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">{item.author}</p>
                <div className="flex gap-1 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < item.rating ? "#f59e0b" : "none"}
                      strokeWidth={1}
                    />
                  ))}
                </div>
              </div>
              <h2 className="text-base font-semibold mb-2">{item.title}</h2>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} /> Đã diễn ra trong {item.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />{" "}
                  <span className="font-semibold">{item.joined}</span>
                </div>
              </div>
              <button className="self-center px-8 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold  ">
                Tham gia
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center gap-15 mt-10">
        <button
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white px-4 py-3 rounded-full shadow transition"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white px-4 py-3 rounded-full shadow transition"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
