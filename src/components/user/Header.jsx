import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const UserHeader = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const displayName = user?.username || "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get(`/user/${id}`);
        console.log("User data:", res.data);
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const handleChatClick = () => {
    // Truyền thông tin user qua state khi navigate
    navigate(`/messages`, {
      state: {
        recipientId: parseInt(id),
        recipientInfo: {
          id: parseInt(id),
          username: user?.username,
          fullName: user?.fullName || user?.username,
          avatarUrl: user?.avatarUrl || user?.avatar
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="pt-10 pb-0 px-8 rounded-b-3xl text-center text-gray-500">
        Không tìm thấy người dùng
      </div>
    );
  }

  return (
    <div className="pt-10 pb-0 px-8 rounded-b-3xl">
      <div className="max-w-4xl flex flex-col md:flex-row gap-13 mx-auto">
        <img
          src={
            user?.avatar ||
            user?.avatarUrl ||
            "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg"
          }
          alt={displayName}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
        />
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-5">
            <div className="flex flex-col">
              <div className="flex items-center gap-10">
                <h2 className="text-xl font-normal text-[#4D2C5E] ">
                  {displayName}
                </h2>
                {user?.accountRole === "TEACHER" && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    Mentor
                  </span>
                )}
              </div>
              {user?.email && (
                <span className="text-sm text-gray-500">{user.email}</span>
              )}
              <p className="text-gray-700 mt-4">
                {user?.bio || user?.description || "Chưa có thông tin giới thiệu"}
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <button
                className="bg-[#4D2C5E] text-white px-4 py-1 rounded-xl font-medium flex items-center justify-center hover:bg-[#6d3bbd] transition-all duration-200"
                onClick={handleChatClick}
              >
                <MessageCircleMore size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mb-4 mt-4">
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