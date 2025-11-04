import React, { useState, useEffect } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import axiosClient from "../../apis/axiosClient";

const menuItems = ["Tổng quan", "Thông tin liên hệ", "Chi tiết"];

const UserAbout = ({ userId }) => {
  const [active, setActive] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("userId không tồn tại, không gọi API.");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching user data for ID:", userId);
        const response = await axiosClient.get(`/user/${userId}`);
        console.log("UserAbout fetch response:", response.data);
        // API trả về {success, message, data}, cần lấy data.data
        const userData = response.data?.data || response.data;
        setUserData(userData);
        console.log("UserAbout data set to:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="flex bg-white rounded-lg shadow min-h-[400px]">
      <div className="w-64 border-r border-gray-200 px-6 py-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={item}>
              <button
                className={`w-full text-left px-4 py-2 rounded font-normal ${
                  active === idx
                    ? "bg-purple-950 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActive(idx)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
          </div>
        ) : (
          <>
            {/* Giới thiệu */}
            <p className="text-gray-600 leading-relaxed mb-6">
              Xin chào! Tôi là{" "}
              {userData?.username || userData?.fullName || "User"}.
            </p>

            {userData?.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Giới thiệu bản thân
                </h3>
                <p className="text-gray-600">{userData.bio}</p>
              </div>
            )}

            {userData?.experience && userData.experience.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Kinh nghiệm</h3>
                <div className="space-y-4 mb-6">
                  {userData.experience.map((exp, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-gray-500 text-sm">
                          {exp.organization}, {exp.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {userData?.education && userData.education.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Học vấn</h3>
                <div className="space-y-4">
                  {userData.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-gray-500 text-sm">
                          {edu.institution}, {edu.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Hiển thị thông tin cơ bản nếu không có experience/education */}
            {(!userData?.experience || userData.experience.length === 0) &&
              (!userData?.education || userData.education.length === 0) && (
                <div className="text-center text-gray-500 py-10">
                  <p>Chưa có thông tin chi tiết</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserAbout;
