import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import blogApi from "../../apis/blogApi";
import userService from "../../services/userService";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import MentorSchedule from "./MentorSchedule";
import UserSchedule from "./UserSchedule";

const UserDetail = () => {
  const { id } = useParams();
  const authUser = useSelector(authSelector);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about"); // mặc định vào Giới thiệu
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef({});

  // Kiểm tra xem có phải là profile của chính mình không
  const isOwnProfile = currentUser?.id?.toString() === id?.toString();
  const isTeacherOwner = isOwnProfile && user?.accountRole === "TEACHER";

  // Debug logs
  console.log("Debug UserDetail:", {
    authUser: authUser,
    currentUser: currentUser,
    currentUserId: currentUser?.id,
    profileId: id,
    userRole: user?.accountRole,
    isOwnProfile,
    isTeacherOwner,
  });

  // Tạo tabs động dựa trên accountRole
  const getTabsForUser = (userData) => {
    const baseTabs = [
      { key: "about", label: "Giới thiệu" },
      { key: "posts", label: "Bài viết" },
    ];

    // Chỉ hiển thị tab "Bài giảng", "Đánh giá" và "Lịch trình" nếu là TEACHER
    if (userData?.accountRole === "TEACHER") {
      baseTabs.push(
        { key: "lectures", label: "Bài giảng" },
        { key: "reviews", label: "Đánh giá" },
        { key: "schedule", label: "Lịch trình" }
      );
    }

    // Thêm tab "Lịch học" cho USER (chỉ hiển thị khi xem profile của chính mình)
    if (userData?.accountRole === "USER" && isOwnProfile) {
      baseTabs.push({ key: "my-schedule", label: "Lịch học" });
    }

    return baseTabs;
  };

  const tabs = getTabsForUser(user);

  // Fetch current user từ API /user/me
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (authUser?.token) {
          const currentUserData = await userService.getCurrentUser();
          setCurrentUser(currentUserData);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [authUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data by ID
        const userData = await userService.getUserById(id);
        setUser(userData);

        // Fetch user posts - có thể cần API endpoint mới để lấy posts của user cụ thể
        const res = await blogApi.getFollowingPosts(); // TODO: Thay bằng API lấy posts của user theo ID
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Reset activeTab nếu tab hiện tại không hợp lệ cho user role
  useEffect(() => {
    if (user) {
      const availableTabs = getTabsForUser(user);
      const isCurrentTabAvailable = availableTabs.some(
        (tab) => tab.key === activeTab
      );

      if (!isCurrentTabAvailable) {
        setActiveTab("about"); // Reset về tab đầu tiên
      }
    }
  }, [user, activeTab]);

  useEffect(() => {
    const currentTab = tabRefs.current[activeTab];
    if (currentTab) {
      setUnderlineStyle({
        width: `${currentTab.offsetWidth}px`,
        left: `${currentTab.offsetLeft}px`,
      });
    }
  }, [activeTab]);

  return (
    <div className="font-['Noto Sans'] ">
      <div>
        {/* Tabs chữ */}
        <div className="relative flex gap-8 max-w-4xl mx-auto border-b-2 border-gray-200 ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
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

        {/* Nội dung theo tab */}
        <div className="max-w-5xl mx-auto gap-10 py-10">
          {activeTab === "about" && <UserAbout userId={id} />}{" "}
          {activeTab === "posts" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {loading ? (
                  <>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl shadow flex flex-col animate-pulse"
                      >
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow p-5 flex flex-col"
                    >
                      <img
                        src={post.image}
                        alt={post.alt}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <div className="flex gap-2 mb-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-[#4D2C5E]">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} Min. To Read</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "lectures" && user?.accountRole === "TEACHER" && (
            <div className="text-center text-gray-500 py-10">
              Đây là phần Bài giảng.
            </div>
          )}
          {activeTab === "reviews" && user?.accountRole === "TEACHER" && (
            <UserFeedback userId={id} />
          )}
          {activeTab === "schedule" && user?.accountRole === "TEACHER" && (
            <MentorSchedule userId={id} isOwner={isTeacherOwner} />
          )}
          {activeTab === "my-schedule" &&
            user?.accountRole === "USER" &&
            isOwnProfile && <UserSchedule userId={id} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
