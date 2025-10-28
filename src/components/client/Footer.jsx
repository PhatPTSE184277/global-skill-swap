import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#fcf7ee] border-t border-gray-100 mt-12 font-['Noto Sans']">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo & About */}
        <div className="flex flex-col gap-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="inline-block bg-purple-900 rounded-lg p-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#6D28D9"/>
                <text x="7" y="18" fontSize="14" fill="#fff" fontWeight="bold">G</text>
              </svg>
            </span>
            <span className="font-bold text-xl text-purple-900">GlobalSkill</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            GlobalSkill là nền tảng chia sẻ kỹ năng toàn cầu. Kết nối, học hỏi và phát triển cùng cộng đồng chuyên gia.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 text-base">Công ty</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-purple-700 transition">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-purple-700 transition">Dịch vụ</a></li>
            <li><a href="#" className="hover:text-purple-700 transition">FAQ</a></li>
            <li><a href="#" className="hover:text-purple-700 transition">Trung tâm trợ giúp</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 text-base">Liên hệ</h4>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-purple-700" /> 0913-705-3875
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-purple-700" /> ElizabethJ@jourrapide.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-purple-700 mt-0.5" />
              <span>
                Đại học FPT, Lô E2a-7, Đường D1, Khu Công nghệ cao<br/>
                Phường Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-400">
        GlobalSkill &copy; {new Date().getFullYear()} All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;