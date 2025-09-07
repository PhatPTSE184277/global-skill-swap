import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

// ⭐ Data mẫu
const feedbacks = [
  {
    name: "Emily Carter",
    date: "May 15, 2024",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    content:
      "Người hướng dẫn của tôi, cô Rodriguez, là một nhà giáo dục xuất sắc...",
    likes: 12,
    dislikes: 2,
  },
  {
    name: "Ryan Bennett",
    date: "April 22, 2024",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    content:
      "Ông Davis là một người hướng dẫn tốt, nhưng tôi cảm thấy các bài học có thể được tổ chức chặt chẽ hơn...",
    likes: 5,
    dislikes: 1,
  },
  {
    name: "Sophia Clark",
    date: "March 10, 2024",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    content:
      "Cô Chen là một người hướng dẫn tuyệt vời! Các bài học của cô được lên kế hoạch rất kỹ lưỡng...",
    likes: 7,
    dislikes: 0,
  },
];

// ⭐ Icon sao
const Star = () => (
  <svg
    className="w-5 h-5 text-yellow-400 inline"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
  </svg>
);

// ⭐ Một feedback card
const FeedbackCard = ({ fb }) => {
  const [likes, setLikes] = useState(fb.likes);
  const [dislikes, setDislikes] = useState(fb.dislikes);
  const [userVote, setUserVote] = useState(null);

  const handleLike = () => {
    if (userVote === "like") {
      setLikes(likes - 1);
      setUserVote(null);
    } else {
      setLikes(likes + 1);
      if (userVote === "dislike") setDislikes(dislikes - 1);
      setUserVote("like");
    }
  };

  const handleDislike = () => {
    if (userVote === "dislike") {
      setDislikes(dislikes - 1);
      setUserVote(null);
    } else {
      setDislikes(dislikes + 1);
      if (userVote === "like") setLikes(likes - 1);
      setUserVote("dislike");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center mb-2">
        <img
          src={fb.avatar}
          alt={fb.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold">{fb.name}</div>
          <div className="text-xs text-gray-400">{fb.date}</div>
        </div>
      </div>

      <div className="flex items-center mb-2">
        {Array.from({ length: fb.rating }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>

      <div className="text-gray-700 mb-3">{fb.content}</div>

      <div className="flex gap-6 text-gray-500 text-sm">
        <button
          className={clsx(
            "flex items-center gap-1 hover:text-green-500 transition",
            userVote === "like" && "text-green-600 font-semibold"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="w-4 h-4" /> {likes}
        </button>
        <button
          className={clsx(
            "flex items-center gap-1 hover:text-red-500 transition",
            userVote === "dislike" && "text-red-600 font-semibold"
          )}
          onClick={handleDislike}
        >
          <ThumbsDown className="w-4 h-4" /> {dislikes}
        </button>
      </div>
    </div>
  );
};

// ⭐ Dropdown chuẩn (Headless UI v2)
const Dropdown = ({ label, options, selected, setSelected }) => (
  <div className="w-44">
    <Listbox value={selected} onChange={setSelected}>
      <ListboxButton
        className={clsx(
          "relative block w-full rounded-lg bg-white py-2 pr-8 pl-3 text-left text-sm text-gray-700 shadow",
          "focus:outline-none"
        )}
      >
        {label}: {selected}
        <ChevronDownIcon
          className="absolute right-2.5 top-2.5 size-4 text-gray-400"
          aria-hidden="true"
        />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        className="mt-1 w-[var(--button-width)] rounded-lg border border-gray-200 bg-white p-1 shadow-lg focus:outline-none z-10"
      >
        {options.map((opt) => (
          <ListboxOption
            key={opt}
            value={opt}
            className="group flex cursor-default items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-700 select-none hover:bg-gray-100"
          >
            <CheckIcon className="invisible size-4 text-green-600 group-data-[selected]:visible" />
            {opt}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  </div>
);

// ⭐ Main component
const UserFeedback = () => {
  const [sortOrder, setSortOrder] = useState("Mới nhất");
  const [filterRate, setFilterRate] = useState("Tất cả");

  const parseDate = (dateStr) => new Date(dateStr);

  const filtered = feedbacks
    .filter((fb) =>
      filterRate === "Tất cả" ? true : fb.rating === Number(filterRate[0])
    )
    .sort((a, b) => {
      if (sortOrder === "Mới nhất") {
        return parseDate(b.date) - parseDate(a.date);
      } else {
        return parseDate(a.date) - parseDate(b.date);
      }
    });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">Đánh giá</h2>
        <div className="flex gap-3">
          <Dropdown
            label="Sắp xếp"
            options={["Mới nhất", "Cũ nhất"]}
            selected={sortOrder}
            setSelected={setSortOrder}
          />
          <Dropdown
            label="Xếp hạng"
            options={["Tất cả", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]}
            selected={filterRate}
            setSelected={setFilterRate}
          />
        </div>
      </div>

      <p className="text-gray-500 mb-8">
        Đọc những gì các học viên khác chia sẻ về trải nghiệm của họ với người
        hướng dẫn này.
      </p>

      <div className="space-y-8">
        {filtered.map((fb, idx) => (
          <FeedbackCard fb={fb} key={idx} />
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-400 italic">Không có đánh giá nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default UserFeedback;
