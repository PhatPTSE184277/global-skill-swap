import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import axiosClient from "../../apis/axiosClient";

const UserHeader = ({ userId }) => {
  const authUser = useSelector(authSelector);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kiểm tra xem userId có phải là số hay username
  const isNumericId = userId && !isNaN(userId);

  // Xác định có phải profile của mình không - so sánh cả string và number
  const isOwnProfile =
    userId &&
    authUser &&
    ((isNumericId && parseInt(userId) === parseInt(authUser._id)) ||
      (!isNumericId && userId === authUser.username));

  useEffect(() => {
    const fetchUser = async () => {
      if (isOwnProfile) {
        // Nếu là profile của mình, dùng authUser
        setUser(authUser);
      } else if (userId) {
        // Nếu là profile người khác, fetch từ API (có thể là id hoặc username)
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
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        // Không có userId, dùng authUser
        setUser(authUser);
      }
    };

    fetchUser();
  }, [userId, authUser, isOwnProfile]);

  // Handler cho nút chat - navigate đến messages
  const handleChatClick = () => {
    if (!user) return;
    navigate(`/messages`, {
      state: {
        recipientId: parseInt(userId || user._id),
        recipientInfo: {
          id: parseInt(userId || user._id),
          username: user?.username,
          fullName: user?.fullName || user?.username,
          avatarUrl: user?.avatarUrl || user?.avatar,
        },
      },
    });
  };

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

  if (!user) {
    return (
      <div className="pt-10 pb-0 px-8 rounded-b-3xl text-center text-gray-500">
        Không tìm thấy người dùng
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
            </div>
            {!isOwnProfile && (
              <div className="flex gap-2">
                <button className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-orange-600 transition-all duration-200">
                  Theo Dõi
                </button>
                <button
                  onClick={handleChatClick}
                  className="bg-[#4D2C5E] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-[#6d3bbd] transition-all duration-200"
                >
                  <MessageCircleMore size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-6 text-sm font-medium mt-2 mb-3">
            <span>
              <span className="font-bold">{user?.postsCount || 0}</span> bài
              viết
            </span>
            <span>
              <span className="font-bold">{user?.followersCount || 0}</span>{" "}
              người theo dõi
            </span>
            <span>
              Đang theo dõi{" "}
              <span className="font-bold">{user?.followingCount || 0}</span>{" "}
              người dùng
            </span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">
            {user?.bio || user?.description || "Chưa có thông tin giới thiệu"}
          </p>

          <div className="flex gap-3 mt-2 mb-2">
            <a href="#" className="text-gray-400 hover:text-orange-500 text-sm">
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
