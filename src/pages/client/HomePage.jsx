import { AlarmClockCheck, Check, Search } from "lucide-react";
import feature1 from "../../img/svg/f1.svg";
import feature2 from "../../img/svg/f2.svg";
import feature3 from "../../img/svg/f3.svg";
import s1 from "../../img/svg/s1.svg";
import s2 from "../../img/svg/s2.svg";
import s3 from "../../img/svg/s3.svg";
import s4 from "../../img/svg/s4.svg";
import { Rate } from "antd";
import UserFeedback from "../../components/client/Home/UserFeedback";
import NewBlog from "../../components/client/Home/NewBlog";
import SubscribeSection from "../../components/client/Home/SubscribeSection";

const mentors = [
  {
    name: "Matthew E. McNatt",
    title: "Giảng viên tại George Brown College",
    desc: "Ut enim ad minim veniam, quis nost exercitation ullamco laboris nisi ut aliquip ex commodo.",
    lang: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600",
  },
  {
    name: "Tracy D. Wright",
    title: "Giảng viên tại Trung Tâm Luyện Thi HSK",
    desc: "Ut enim ad minim veniam, quis nost exercitation ullamco laboris nisi ut aliquip ex commodo.",
    lang: "Tiếng Trung",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600",
  },
  {
    name: "Cynthia A. Nelson",
    title: "Sinh viên Đại Học Ngôn Ngữ Anh",
    desc: "Ut enim ad minim veniam, quis nost exercitation ullamco laboris nisi ut aliquip ex commodo.",
    lang: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
  },
];
const HomePage = () => {
  return (
    <div>
      {" "}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-between px-50"
        style={{
          background: "#fdf8ee",
          backgroundImage: "url('src/img/svg/homeBG.svg')",
        }}
      >
        {" "}
        {/* Left Section */}{" "}
        <div className="max-w-2xl">
          {" "}
          <h1 className="text-5xl font-bold leading-snug">
            {" "}
            Lựa chọn <span className="text-orange-500">
              thông minh
            </span> cho <br /> <span className="text-black">tương lai</span> của
            bạn{" "}
          </h1>{" "}
          <p className="mt-6 text-gray-400 text-lg">
            {" "}
            Thành thạo ngôn ngữ, mở ra thế giới đầy cơ hội{" "}
          </p>{" "}
          {/* Search Bar */}{" "}
          <div className="mt-15 flex items-center bg-white shadow-md rounded-full px-4 py-2 w-[450px]">
            {" "}
            <Search className="text-gray-400 w-5 h-5 mr-2" />{" "}
            <input
              type="text"
              placeholder="Tìm kiếm một ngôn ngữ..."
              className="flex-1 outline-none text-gray-700"
            />{" "}
            <button className="ml-2 bg-purple-950 text-white px-6 py-2 rounded-full font-medium">
              {" "}
              Tiếp tục{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right Illustration */}{" "}
        <div className="flex-shrink-0">
          {" "}
          <img
            src="/src/img/svg/homeIllu.svg"
            alt="Illustration"
            className="w-[480px]"
          />{" "}
        </div>{" "}
      </div>{" "}
      {/* Features Section */}{" "}
      <div className="px-30 pb-12 bg-[#fdf8ee]">
        {" "}
        <div className="w-full bg-purple-950 text-white rounded-2xl py-10 px-12 flex justify-between gap-10">
          {" "}
          {/* Feature 1 */}{" "}
          <div className="flex items-center gap-4 w-1/3 align">
            {" "}
            <img
              src={feature1}
              alt="Hướng dẫn"
              className="w-20 h-20 flex-shrink-0"
            />{" "}
            <div>
              {" "}
              <h3 className="text-lg font-semibold mb-2">
                {" "}
                Hướng dẫn cá nhân hóa{" "}
              </h3>{" "}
              <p className="text-xs leading-relaxed text-gray-200">
                {" "}
                Các buổi học 1 kèm 1 được thiết kế riêng cho mục tiêu học ngôn
                ngữ của bạn – từ các cụm từ chuyên ngành đến luyện phỏng vấn xin
                visa.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Feature 2 */}{" "}
          <div className="flex items-center gap-4 w-1/3">
            {" "}
            <img
              src={feature2}
              alt="Sự nghiệp"
              className="w-20 h-20 flex-shrink-0"
            />{" "}
            <div>
              {" "}
              <h3 className="text-lg font-semibold mb-2">
                {" "}
                Sẵn sàng cho sự nghiệp{" "}
              </h3>{" "}
              <p className="text-xs leading-relaxed text-gray-200">
                {" "}
                Các bài học thực tiễn trong các tình huống nghề nghiệp tại Nhật
                Bản, Hàn Quốc, Đức và nhiều quốc gia khác.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Feature 3 */}{" "}
          <div className="flex items-center gap-4 w-1/3">
            {" "}
            <img
              src={feature3}
              alt="Cộng đồng"
              className="w-20 h-20 flex-shrink-0"
            />{" "}
            <div>
              {" "}
              <h3 className="text-lg font-semibold mb-2">
                {" "}
                Cộng đồng toàn cầu hỗ trợ{" "}
              </h3>{" "}
              <p className="text-xs leading-relaxed text-gray-200">
                {" "}
                Tham gia các nhóm, chia sẻ mẹo vặt và kết nối với những người
                khác cùng đang chuẩn bị đi làm hoặc du học nước ngoài.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Courses Section */}{" "}
      <div className="px-40 my-18">
        {" "}
        {/* Title */}{" "}
        <div className="text-center mb-15">
          {" "}
          <h2 className="text-4xl font-bold">
            {" "}
            Các Phòng Học <span className="text-orange-500">Đang Mở</span> –
            Tham Gia <span className="text-orange-500">Ngay</span>{" "}
          </h2>{" "}
          <p className="text-gray-500 mt-5">
            {" "}
            Các bài học ngôn ngữ thực tế, sẵn sàng cho công việc{" "}
          </p>{" "}
        </div>{" "}
        {/* Courses Grid */}{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {" "}
          {/* Course Card 1 */}{" "}
          <div className="bg-white rounded-2xl shadow-lg relative">
            {" "}
            <img
              src="https://images.unsplash.com/photo-1585139495646-df1f2d5c5c5a"
              alt="Làm quen với tiếng Trung"
              className="w-full h-48 object-cover p-4 rounded-3xl"
            />{" "}
            <div className="p-5">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <p className="text-gray-400 text-xs">Matthew E. McNatt</p>{" "}
                <Rate disabled defaultValue={5} />{" "}
              </div>{" "}
              <h3 className="font-semibold text-lg">
                {" "}
                Làm quen với tiếng Trung{" "}
              </h3>{" "}
              <div className="border-t border-gray-300 border-dashed my-3"></div>{" "}
              <div className="flex items-center justify-between mt-2 mb-4 text-gray-400 text-sm">
                {" "}
                <span className="flex items-center gap-1">
                  {" "}
                  <AlarmClockCheck size={18} /> 2hr{" "}
                </span>{" "}
              </div>{" "}
              {/* Nút tràn ra ngoài card */}{" "}
              <button className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg">
                {" "}
                Tham gia{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          {/* Course Card 2 */}{" "}
          <div className="bg-white rounded-2xl shadow-lg relative">
            {" "}
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              alt="Luyện nghe Ielts"
              className="w-full h-48 object-cover p-4 rounded-3xl"
            />{" "}
            <div className="px-5 pt-5">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <p className="text-gray-400 text-xs">Tracy D. Wright</p>{" "}
                <Rate disabled defaultValue={5} />{" "}
              </div>{" "}
              <h3 className="font-semibold text-lg">Luyện nghe Ielts</h3>{" "}
              <div className="border-t border-gray-300 border-dashed my-3"></div>{" "}
              <div className="flex items-center justify-between mt-2 mb-4 text-gray-400 text-sm">
                {" "}
                <span className="flex items-center gap-1">
                  {" "}
                  <AlarmClockCheck size={18} /> 2hr{" "}
                </span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Nút tràn ra ngoài card */}{" "}
            <button className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg">
              {" "}
              Tham gia{" "}
            </button>{" "}
          </div>{" "}
          {/* Course Card 3 */}{" "}
          <div className="bg-white rounded-2xl shadow-lg relative">
            {" "}
            <img
              src="https://images.unsplash.com/photo-1576003606649-2e3a23c58eaa"
              alt="Ôn tập HSK 1"
              className="w-full h-48 object-cover p-4 rounded-3xl"
            />{" "}
            <div className="p-5 pb-0">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <p className="text-gray-400 text-xs">Cynthia A. Nelson</p>{" "}
                <Rate disabled defaultValue={5} />{" "}
              </div>{" "}
              <h3 className="font-semibold text-lg">Ôn tập HSK 1</h3>{" "}
              <div className="border-t border-gray-300 border-dashed my-3"></div>{" "}
              <div className="flex items-center justify-between mt-2 mb-4 text-gray-400 text-sm">
                {" "}
                <span className="flex items-center gap-1">
                  {" "}
                  <AlarmClockCheck size={18} /> 2hr{" "}
                </span>{" "}
              </div>{" "}
              {/* Nút tràn ra ngoài card */}{" "}
              <button className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg">
                {" "}
                Tham gia{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Section: Đặc quyền */}{" "}
      <section className="bg-[#FFF8F2] py-8">
        {" "}
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-20 px-6">
          {" "}
          {/* Hình bên trái */}{" "}
          <div className="flex-1">
            {" "}
            <img
              src={s3}
              alt="Special Feature"
              className="w-full max-w-lg mx-auto"
            />{" "}
          </div>{" "}
          {/* Nội dung bên phải */}{" "}
          <div className="flex-1">
            {" "}
            <h2 className="text-4xl font-bold mb-15">
              {" "}
              Tận hưởng <span className="text-orange-500">đặc quyền</span>{" "}
            </h2>{" "}
            <div className="space-y-6">
              {" "}
              {/* Item 1 */}{" "}
              <div className="flex items-center gap-5">
                {" "}
                <img src={s1} alt="Feature 1" className="w-18 h-18" />{" "}
                <div className="flex flex-col gap-2">
                  {" "}
                  <p className="font-semibold text-lg">
                    {" "}
                    Tính năng xịn – Học siêu mượt{" "}
                  </p>{" "}
                  <p className="text-gray-500 text-basic">
                    {" "}
                    Xem không quảng cáo, ghép mentor nhanh.{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              {/* Item 2 */}{" "}
              <div className="flex items-start gap-5">
                {" "}
                <img src={s2} alt="Feature 2" className="w-18 h-18" />{" "}
                <div className="flex flex-col gap-2">
                  {" "}
                  <p className="font-semibold text-lg">
                    {" "}
                    Mở khóa nhiều phòng học miễn phí{" "}
                  </p>{" "}
                  <p className="text-gray-500 text-basic">
                    {" "}
                    Tương tác cao giúp bạn tiếp thu nhanh và ghi nhớ lâu.{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Section: Hướng dẫn học 1-1 */}{" "}
      <section className="bg-white pb-10 pt-20">
        {" "}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6">
          {" "}
          {/* Nội dung bên trái */}{" "}
          <div className="flex-1">
            {" "}
            <h2 className="text-4xl font-bold leading-normal mb-6">
              {" "}
              Hướng Dẫn{" "}
              <span className="text-orange-500">
                Học Ngôn Ngữ 1-1
              </span> <br /> Với Các Mentor{" "}
              <span className="text-orange-500">Chất Lượng</span>{" "}
            </h2>{" "}
            <p className="text-gray-500 mb-6 text-lg ">
              {" "}
              Muốn học tiếng Anh để đi làm ở nước ngoài? Cần giúp đỡ chuẩn bị
              cho buổi phỏng vấn visa Trung Quốc?{" "}
            </p>{" "}
            <ul className="space-y-3 text-gray-700">
              {" "}
              <li className="flex items-center gap-3 text-lg font-semibold">
                {" "}
                Đặt buổi học 1-1 với các mentor giàu kinh nghiệm:{" "}
              </li>{" "}
              <li className="flex items-center gap-3 text-lg font-semibold">
                {" "}
                <Check /> Có kinh nghiệm thực tế{" "}
              </li>{" "}
              <li className="flex items-center gap-3 text-lg font-semibold">
                {" "}
                <Check /> Lịch học linh hoạt – học mọi lúc, mọi nơi{" "}
              </li>{" "}
              <li className="flex items-center gap-3 text-lg font-semibold">
                {" "}
                <Check /> Chỉ từ 100.000 VNĐ/giờ hoặc miễn phí{" "}
              </li>{" "}
            </ul>{" "}
            <button className="mt-12 bg-purple-950 hover:bg-purple-900 text-white px-8 py-3 rounded-full font-medium shadow-md text-lg">
              {" "}
              Ghép Với Mentor Của Bạn{" "}
            </button>{" "}
          </div>{" "}
          {/* Hình minh họa bên phải */}{" "}
          <div className="flex-1">
            {" "}
            <img
              src={s4}
              alt="Học với Mentor"
              className="w-full max-w-md mx-auto"
            />{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      <UserFeedback />
      {/* Section: Mentor Được Đề Xuất */}
      <div className="bg-[#FFF8F2] w-full py-1">
        <section className="max-w-6xl mx-auto px-4 mt-15 mb-20 ">
          <h2 className="text-3xl font-bold text-center mb-12">
            Các Mentor Được{" "}
            <span className="text-orange-500">Đề Xuất Cho Bạn</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mentors.map((mentor, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-shadow duration-300"
              >
                {/* Ảnh có padding và bo góc */}
                <div className="p-5">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-45 object-cover rounded-xl"
                  />
                </div>

                {/* Nội dung */}
                <div className="px-5 pb-5">
                  <h3 className="text-lg font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.title}</p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {mentor.desc}
                  </p>
                  <p className="text-orange-500 font-medium mt-3">
                    {mentor.lang}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewBlog />

      <SubscribeSection/>
    </div>
  );
};
export default HomePage;
