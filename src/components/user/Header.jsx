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

import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";

const UserHeader = ({ userId }) => {
  const authUser = useSelector(authSelector);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Xác định có phải profile của mình không
  const isOwnProfile = !userId || userId === authUser?._id;

  useEffect(() => {
    const fetchUser = async () => {
      if (isOwnProfile) {
        // Nếu là profile của mình, dùng authUser
        setUser(authUser);
      } else {
        // Nếu là profile người khác, fetch từ API
        setLoading(true);
        try {
          const response = await axiosClient.get(`/user/${userId}`);
          console.log("UserHeader fetch response:", response.data);
          // API trả về {success, message, data}, cần lấy data.data
          const userData = response.data?.data || response.data;
          setUser(userData);
          console.log("UserHeader user set to:", userData);
        } catch (error) {
          console.error("Error fetching user header:", error);
          setUser(authUser); // Fallback về authUser nếu lỗi
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, authUser, isOwnProfile]);

  // Debug log
  console.log("UserHeader Debug:", {
    userId,
    isOwnProfile,
    authUserId: authUser?._id,
    displayUserId: user?._id,
    displayUserName: user?.username,
    fullUserData: user,
  });

  if (loading) {
    return (
      <div className="pt-10 pb-0 px-8 rounded-b-3xl">
        <div className="max-w-4xl mx-auto flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
        </div>
      </div>
    );
  }

  const displayName = user?.fullName || user?.username || "User";
  const avatarUrl =
    user?.avatarUrl ||
    user?.avatar ||
    "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg";

  return (
    <div className="pt-6 pb-0 px-6 rounded-b-3xl">
      <div className="max-w-7xl flex flex-col md:flex-row gap-6 mx-auto">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-20 h-20 rounded-full object-cover border-3 border-white shadow"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-[#4D2C5E]">
                  {displayName}
                </h2>
                {user?.accountRole === "TEACHER" && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Mentor
                  </span>
                )}
              </div>
              {user?.email && (
                <span className="text-xs text-gray-500">{user.email}</span>
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
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
