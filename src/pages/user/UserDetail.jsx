import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import axiosClient from "../../apis/axiosClient";
import UserHeader from "../../components/user/Header";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import MentorSchedule from "./MentorSchedule";
import UserSchedule from "./UserSchedule";
import PostList from "../../components/user/UserDetail/Post/PostList";
import PostContext from "../../contexts/PostContext";

const UserDetail = () => {
  const { userId } = useParams(); // Lấy userId từ URL params
  const { fetchPosts } = useContext(PostContext);
  const authUser = useSelector(authSelector);
  const [activeTab, setActiveTab] = useState("about");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef({});
  const [profileUser, setProfileUser] = useState(null); // User đang được xem
  const [loading, setLoading] = useState(false);

  // Xác định user hiện tại: nếu có userId từ URL thì dùng userId đó, không thì dùng authUser
  const currentUserId = userId || authUser?._id;
  const isOwnProfile = !userId || userId === authUser?._id;
  const displayUser = isOwnProfile ? authUser : profileUser; // User để hiển thị thông tin
  const isTeacherOwner = isOwnProfile && authUser?.accountRole === "TEACHER";

  // Debug log
  console.log("UserDetail Debug:", {
    userId,
    authUserId: authUser?._id,
    currentUserId,
    isOwnProfile,
    displayUser: displayUser?._id,
    profileUser: profileUser?._id,
  });

  // Fetch thông tin user nếu đang xem profile người khác
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userId && userId !== authUser?._id) {
        setLoading(true);
        try {
          const response = await axiosClient.get(`/user/${userId}`);
          console.log("UserDetail fetch response:", response.data);
          // API trả về {success, message, data}, cần lấy data.data
          const userData = response.data?.data || response.data;
          setProfileUser(userData);
          console.log("Profile user set to:", userData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userId, authUser?._id]);

  const getTabsForUser = (userData) => {
    const baseTabs = [
      { key: "about", label: "Giới thiệu" },
      { key: "posts", label: "Bài viết" },
    ];

    if (userData?.accountRole === "TEACHER") {
      baseTabs.push(
        { key: "lectures", label: "Bài giảng" },
        { key: "reviews", label: "Đánh giá" },
        { key: "schedule", label: "Lịch trình" }
      );
    }

    if (userData?.accountRole === "USER" && isOwnProfile) {
      baseTabs.push({ key: "my-schedule", label: "Lịch học" });
    }

    return baseTabs;
  };

  const tabs = getTabsForUser(displayUser);

  // Debug thêm về tabs và roles
  console.log("Tabs available:", tabs);
  console.log("Display User Role:", displayUser?.accountRole);
  console.log("Is Own Profile:", isOwnProfile);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts({ accountId: currentUserId });
    }
  }, [activeTab, currentUserId, fetchPosts]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setUnderlineStyle({
        width: `${currentTab.offsetWidth}px`,
        left: `${currentTab.offsetLeft}px`,
      });
    }
  }, [activeTab]);

  // Hiển thị loading khi đang fetch thông tin user
  if (loading) {
    return (
      <div className="font-['Noto Sans'] flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra nếu không tìm thấy user
  if (!isOwnProfile && !profileUser) {
    return (
      <div className="font-['Noto Sans'] flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Noto Sans'] ">
      {/* Thêm UserHeader vào đây */}
      <UserHeader userId={currentUserId} />

      <div>
        <div className="relative flex gap-8 max-w-4xl mx-auto border-b-2 border-gray-200 ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "text-purple-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-0.5 bg-purple-900 transition-all duration-300"
            style={underlineStyle}
          />
        </div>

        <div className="max-w-5xl mx-auto gap-10 py-10">
          {activeTab === "about" && <UserAbout userId={currentUserId} />}{" "}
          {activeTab === "posts" && (
            <div>
              <PostList isOwnProfile={isOwnProfile} />
            </div>
          )}
          {activeTab === "lectures" &&
            displayUser?.accountRole === "TEACHER" && (
              <div className="text-center text-gray-500 py-10">
                Đây là phần Bài giảng.
              </div>
            )}
          {activeTab === "reviews" &&
            displayUser?.accountRole === "TEACHER" && (
              <UserFeedback userId={currentUserId} />
            )}
          {activeTab === "schedule" &&
            displayUser?.accountRole === "TEACHER" && (
              <MentorSchedule userId={currentUserId} isOwner={isTeacherOwner} />
            )}
          {activeTab === "my-schedule" &&
            displayUser?.accountRole === "USER" &&
            isOwnProfile && <UserSchedule userId={currentUserId} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
