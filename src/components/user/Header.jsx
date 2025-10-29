import React, { useEffect, useState } from "react";
import { MessageCircleMore } from "lucide-react";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import axiosClient from "../../apis/axiosClient";

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
    <div className="pt-10 pb-0 px-8 rounded-b-3xl">
      <div className="max-w-4xl flex flex-col md:flex-row gap-13 mx-auto">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
        />
        <div className="flex-1">
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
            </div>
            {!isOwnProfile && (
              <div className="flex gap-3">
                <button className="bg-orange-500 text-white px-5 py-1 rounded-xl font-medium flex items-center justify-center hover:bg-orange-600 transition-all duration-200">
                  Theo Dõi
                </button>
                <button className="bg-[#4D2C5E] text-white px-4 py-1 rounded-xl font-medium flex items-center justify-center hover:bg-[#6d3bbd] transition-all duration-200">
                  <MessageCircleMore size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-8 text-base font-medium mt-3 mb-6">
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

          <p className="text-gray-700">
            {user?.bio || user?.description || "Chưa có thông tin giới thiệu"}
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
