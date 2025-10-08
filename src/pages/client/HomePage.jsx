import { AlarmClockCheck, Check, Search } from "lucide-react";
import { motion } from "framer-motion";
import homeIllu from "../../img/svg/homeIllu.svg";
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

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
      <motion.div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-between px-50"
        style={{
          background: "#fdf8ee",
          backgroundImage: "url('src/img/svg/homeBG.svg')",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {" "}
        {/* Left Section */}{" "}
        <motion.div className="max-w-2xl" {...fadeInLeft}>
          {" "}
          <motion.h1
            className="text-5xl font-bold leading-snug"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {" "}
            Lựa chọn <span className="text-orange-500">
              thông minh
            </span> cho <br /> <span className="text-black">tương lai</span> của
            bạn{" "}
          </motion.h1>{" "}
          <motion.p
            className="mt-6 text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {" "}
            Thành thạo ngôn ngữ, mở ra thế giới đầy cơ hội{" "}
          </motion.p>{" "}
          {/* Search Bar */}{" "}
          <motion.div
            className="mt-15 flex items-center bg-white shadow-md rounded-full px-4 py-2 w-[450px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {" "}
            <Search className="text-gray-400 w-5 h-5 mr-2" />{" "}
            <input
              type="text"
              placeholder="Tìm kiếm một ngôn ngữ..."
              className="flex-1 outline-none text-gray-700"
            />{" "}
            <motion.button
              className="ml-2 bg-purple-950 text-white px-6 py-2 rounded-full font-medium"
              whileHover={{ scale: 1.05, backgroundColor: "#581c87" }}
              whileTap={{ scale: 0.95 }}
            >
              {" "}
              Tiếp tục{" "}
            </motion.button>{" "}
          </motion.div>{" "}
        </motion.div>{" "}
        {/* Right Illustration */}{" "}
        <motion.div
          className="flex-shrink-0"
          {...fadeInRight}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {" "}
          <motion.img
            src={homeIllu}
            alt="Illustration"
            className="w-[480px]"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />{" "}
        </motion.div>{" "}
      </motion.div>{" "}
      {/* Features Section */}{" "}
      <motion.div
        className="px-30 pb-12 bg-[#fdf8ee]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {" "}
        <motion.div
          className="w-full bg-purple-950 text-white rounded-2xl py-10 px-12 flex justify-between gap-10"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {" "}
          {/* Feature 1 */}{" "}
          <motion.div
            className="flex items-center gap-4 w-1/3 align"
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src={feature1}
              alt="Hướng dẫn"
              className="w-20 h-20 flex-shrink-0"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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
          </motion.div>{" "}
          {/* Feature 2 */}{" "}
          <motion.div
            className="flex items-center gap-4 w-1/3"
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src={feature2}
              alt="Sự nghiệp"
              className="w-20 h-20 flex-shrink-0"
              animate={{
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
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
          </motion.div>{" "}
          {/* Feature 3 */}{" "}
          <motion.div
            className="flex items-center gap-4 w-1/3"
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src={feature3}
              alt="Cộng đồng"
              className="w-20 h-20 flex-shrink-0"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
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
          </motion.div>{" "}
        </motion.div>{" "}
      </motion.div>{" "}
      {/* Courses Section */}{" "}
      <motion.div
        className="px-40 my-18"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {" "}
        {/* Title */}{" "}
        <motion.div
          className="text-center mb-15"
          {...fadeInUp}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
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
        </motion.div>{" "}
        {/* Courses Grid */}{" "}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {" "}
          {/* Course Card 1 */}{" "}
          <motion.div
            className="bg-white rounded-2xl shadow-lg relative"
            variants={scaleIn}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src="https://images.unsplash.com/photo-1585139495646-df1f2d5c5c5a"
              alt="Làm quen với tiếng Trung"
              className="w-full h-48 object-cover p-4 rounded-3xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
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
              <motion.button
                className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#ea580c",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {" "}
                Tham gia{" "}
              </motion.button>{" "}
            </div>{" "}
          </motion.div>{" "}
          {/* Course Card 2 */}{" "}
          <motion.div
            className="bg-white rounded-2xl shadow-lg relative"
            variants={scaleIn}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              alt="Luyện nghe Ielts"
              className="w-full h-48 object-cover p-4 rounded-3xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
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
            <motion.button
              className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#ea580c",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {" "}
              Tham gia{" "}
            </motion.button>{" "}
          </motion.div>{" "}
          {/* Course Card 3 */}{" "}
          <motion.div
            className="bg-white rounded-2xl shadow-lg relative"
            variants={scaleIn}
            whileHover={{
              y: -10,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            <motion.img
              src="https://images.unsplash.com/photo-1576003606649-2e3a23c58eaa"
              alt="Ôn tập HSK 1"
              className="w-full h-48 object-cover p-4 rounded-3xl"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
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
              <motion.button
                className="absolute left-1/2 -translate-x-1/2 -bottom-5 bg-orange-500 text-white px-12 py-2 rounded-full font-medium shadow-md cursor-pointer text-lg"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#ea580c",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {" "}
                Tham gia{" "}
              </motion.button>{" "}
            </div>{" "}
          </motion.div>{" "}
        </motion.div>{" "}
      </motion.div>{" "}
      {/* Section: Đặc quyền */}{" "}
      <motion.section
        className="bg-[#FFF8F2] py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {" "}
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-20 px-6">
          {" "}
          {/* Hình bên trái */}{" "}
          <motion.div
            className="flex-1"
            {...fadeInLeft}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {" "}
            <motion.img
              src={s3}
              alt="Special Feature"
              className="w-full max-w-lg mx-auto"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />{" "}
          </motion.div>{" "}
          {/* Nội dung bên phải */}{" "}
          <motion.div
            className="flex-1"
            {...fadeInRight}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {" "}
            <motion.h2
              className="text-4xl font-bold mb-15"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {" "}
              Tận hưởng <span className="text-orange-500">đặc quyền</span>{" "}
            </motion.h2>{" "}
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {" "}
              {/* Item 1 */}{" "}
              <motion.div
                className="flex items-center gap-5"
                variants={scaleIn}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <motion.img
                  src={s1}
                  alt="Feature 1"
                  className="w-18 h-18"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />{" "}
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
              </motion.div>{" "}
              {/* Item 2 */}{" "}
              <motion.div
                className="flex items-start gap-5"
                variants={scaleIn}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <motion.img
                  src={s2}
                  alt="Feature 2"
                  className="w-18 h-18"
                  animate={{
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />{" "}
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
              </motion.div>{" "}
            </motion.div>{" "}
          </motion.div>{" "}
        </div>{" "}
      </motion.section>{" "}
      {/* Section: Hướng dẫn học 1-1 */}{" "}
      <motion.section
        className="bg-white pb-10 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {" "}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6">
          {" "}
          {/* Nội dung bên trái */}{" "}
          <motion.div
            className="flex-1"
            {...fadeInLeft}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {" "}
            <motion.h2
              className="text-4xl font-bold leading-normal mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {" "}
              Hướng Dẫn{" "}
              <span className="text-orange-500">
                Học Ngôn Ngữ 1-1
              </span> <br /> Với Các Mentor{" "}
              <span className="text-orange-500">Chất Lượng</span>{" "}
            </motion.h2>{" "}
            <motion.p
              className="text-gray-500 mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {" "}
              Muốn học tiếng Anh để đi làm ở nước ngoài? Cần giúp đỡ chuẩn bị
              cho buổi phỏng vấn visa Trung Quốc?{" "}
            </motion.p>{" "}
            <motion.ul
              className="space-y-3 text-gray-700"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {" "}
              <motion.li
                className="flex items-center gap-3 text-lg font-semibold"
                variants={scaleIn}
              >
                {" "}
                Đặt buổi học 1-1 với các mentor giàu kinh nghiệm:{" "}
              </motion.li>{" "}
              <motion.li
                className="flex items-center gap-3 text-lg font-semibold"
                variants={scaleIn}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Check />
                </motion.div>
                Có kinh nghiệm thực tế{" "}
              </motion.li>{" "}
              <motion.li
                className="flex items-center gap-3 text-lg font-semibold"
                variants={scaleIn}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Check />
                </motion.div>
                Lịch học linh hoạt – học mọi lúc, mọi nơi{" "}
              </motion.li>{" "}
              <motion.li
                className="flex items-center gap-3 text-lg font-semibold"
                variants={scaleIn}
                whileHover={{ x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Check />
                </motion.div>
                Chỉ từ 100.000 VNĐ/giờ hoặc miễn phí{" "}
              </motion.li>{" "}
            </motion.ul>{" "}
            <motion.button
              className="mt-12 bg-purple-950 hover:bg-purple-900 text-white px-8 py-3 rounded-full font-medium shadow-md text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#581c87",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {" "}
              Ghép Với Mentor Của Bạn{" "}
            </motion.button>{" "}
          </motion.div>{" "}
          {/* Hình minh họa bên phải */}{" "}
          <motion.div
            className="flex-1"
            {...fadeInRight}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {" "}
            <motion.img
              src={s4}
              alt="Học với Mentor"
              className="w-full max-w-md mx-auto"
              animate={{
                y: [0, -20, 0],
                rotate: [0, -3, 3, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />{" "}
          </motion.div>{" "}
        </div>{" "}
      </motion.section>{" "}
      <UserFeedback />
      {/* Section: Mentor Được Đề Xuất */}
      <div className="bg-[#FFF8F2] w-full py-1">
        <motion.section
          className="max-w-6xl mx-auto px-4 mt-15 mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Các Mentor Được{" "}
            <span className="text-orange-500">Đề Xuất Cho Bạn</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {mentors.map((mentor, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] transition-shadow duration-300"
                variants={scaleIn}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Ảnh có padding và bo góc */}
                <div className="p-5">
                  <motion.img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-45 object-cover rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Nội dung */}
                <motion.div
                  className="px-5 pb-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.title}</p>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {mentor.desc}
                  </p>
                  <motion.p
                    className="text-orange-500 font-medium mt-3"
                    animate={{
                      color: ["#f97316", "#ea580c", "#f97316"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {mentor.lang}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <NewBlog />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <SubscribeSection />
      </motion.div>
    </div>
  );
};
export default HomePage;
