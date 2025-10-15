import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import UserAbout from "./UserAbout";
import UserFeedback from "./UserFeedback";
import MentorSchedule from "./MentorSchedule";
import UserSchedule from "./UserSchedule";
import PostList from "../../components/user/UserDetail/Post/PostList";
import PostContext from "../../contexts/PostContext";

const UserDetail = () => {
  const { fetchPosts } = useContext(PostContext);
  const authUser = useSelector(authSelector);
  const [activeTab, setActiveTab] = useState("about");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const tabRefs = useRef({});

  const isOwnProfile = true;
  const isTeacherOwner = authUser?.accountRole === "TEACHER";

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

  const tabs = getTabsForUser(authUser);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts({ accountId: authUser._id });
    }
  }, [activeTab, authUser._id, fetchPosts]);

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
        <div className="relative flex gap-8 max-w-4xl mx-auto border-b-2 border-gray-200 ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[tab.key] = el)}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.key
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
          {activeTab === "about" && <UserAbout userId={authUser._id} />}{" "}
          {activeTab === "posts" && (
            <div>
              <PostList />
            </div>
          )}
          {activeTab === "lectures" && authUser?.accountRole === "TEACHER" && (
            <div className="text-center text-gray-500 py-10">
              Đây là phần Bài giảng.
            </div>
          )}
          {activeTab === "reviews" && authUser?.accountRole === "TEACHER" && (
            <UserFeedback userId={authUser._id} />
          )}
          {activeTab === "schedule" && authUser?.accountRole === "TEACHER" && (
            <MentorSchedule userId={authUser._id} isOwner={isTeacherOwner} />
          )}
          {activeTab === "my-schedule" &&
            authUser?.accountRole === "USER" &&
            isOwnProfile && <UserSchedule userId={authUser._id} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;