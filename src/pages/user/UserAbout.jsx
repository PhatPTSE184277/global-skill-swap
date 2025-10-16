import React, { useState, useEffect } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

const menuItems = ["Tổng quan", "Thông tin liên hệ", "Chi tiết"];

const UserAbout = ({ userId }) => {
  const [active, setActive] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("userId không tồn tại, không gọi API.");
        return;
      }

      try {
        const response = {
          username: "Sophia",
          accountRole: "TEACHER",
          experience: [
            {
              title: "Giáo viên Tiếng Anh",
              organization: "Trường Ngôn Ngữ Quốc Tế",
              duration: "2018 - Hiện tại",
            },
            {
              title: "Trợ Giảng",
              organization: "Trung Tâm Cộng Đồng Học Tập",
              duration: "2016 - 2018",
            },
          ],
          education: [
            {
              degree: "Thạc sĩ Ngôn ngữ học",
              institution: "Đại học California, Los Angeles",
              year: "2016",
            },
            {
              degree: "Cử nhân Tiếng Anh",
              institution: "Đại học California, Berkeley",
              year: "2014",
            },
          ],
        };

        setUserData(response);
        console.log("Fetching user data for ID:", userId);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
        {/* Giới thiệu */}
        <p className="text-gray-600 leading-relaxed mb-6">
          Xin chào! Tôi là {userData?.username || "User"}.
        </p>

        <h3 className="text-lg font-semibold mb-3">Kinh nghiệm</h3>
        <div className="space-y-4 mb-6">
          {userData?.experience?.map((exp, idx) => (
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

        <h3 className="text-lg font-semibold mb-3">Học vấn</h3>
        <div className="space-y-4">
          {userData?.education?.map((edu, idx) => (
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
      </div>
    </div>
  );
};

export default UserAbout;