import React from "react";
import { MessageCircleMore } from "lucide-react";

const UserHeader = () => {
  return (
    <div className="pt-10 pb-0 px-8 rounded-b-3xl">
      <div className="max-w-4xl flex flex-col md:flex-row gap-13 mx-auto">
        <img
          src="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
          alt="Jenny Kia"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-xl font-normal text-[#4D2C5E] ">Jenny Kia</h2>
            <div className="flex gap-3">
              <button className="bg-orange-500 text-white px-5 py-1 rounded-xl font-medium flex items-center justify-center hover:bg-orange-600 transition-all duration-200">
                Theo Dõi
              </button>
              <button className="bg-[#4D2C5E] text-white px-4 py-1 rounded-xl font-medium flex items-center justify-center hover:bg-[#6d3bbd] transition-all duration-200">
                <MessageCircleMore size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-8 text-base font-medium mt-3 mb-6">
            <span>
              <span className="font-bold">12</span> bài viết
            </span>
            <span>
              <span className="font-bold">737</span> người theo dõi
            </span>
            <span>
              Đang theo dõi <span className="font-bold">114</span> người dùng
            </span>
          </div>

          <p className="text-gray-700">
            Hiện đang sống và làm việc tại Nhật 3 năm kinh nghiệm dạy tiếng Anh
            giao tiếp cho người mới bắt đầu...
          </p>
          <div className="flex gap-3 mb-4">
            <a href="#" className="text-gray-400 hover:text-orange-500">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
