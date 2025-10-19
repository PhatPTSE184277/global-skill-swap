import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  X,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import AIIcon from "../../img/AI.png";

// Custom Dropdown Component
const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.value === value) || {
      label: placeholder,
      value: "",
    }
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer flex items-center justify-between group"
      >
        <span
          className={selectedOption.value ? "text-gray-900" : "text-gray-500"}
        >
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                    selectedOption.value === option.value
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Component cho Top Giảng viên tương tự RightSidebar
const TopMentor = ({ avatar, name, title, rating, specialties }) => {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
        <p className="text-xs text-gray-500 mb-1">{title}</p>
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
        <div className="flex gap-1">
          {specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-md"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock data cho mentors
const mentorsData = [
  {
    id: 1,
    name: "Nguyễn Minh Hải",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    title: "Giảng viên Tiếng Anh tại Đại học Ngoại thương",
    language: "english",
    languages: ["Tiếng Anh", "Tiếng Việt"],
    experience: 8,
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 450000,
    location: "Hà Nội",
    specialties: ["IELTS", "Giao tiếp", "Kinh doanh"],
    totalStudents: 234,
    responseTime: "2 giờ",
    description:
      "Chuyên gia giảng dạy tiếng Anh với hơn 8 năm kinh nghiệm. Đã giúp hàng trăm học viên đạt điểm IELTS mong muốn và giao tiếp tự tin.",
    availability: "Sáng, Chiều",
    certificates: ["IELTS 8.5", "Chứng chỉ TESOL quốc tế"],
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    title: "Chuyên gia Tiếng Trung tại Viện Khổng Tử",
    language: "chinese",
    languages: ["Tiếng Trung", "Tiếng Việt"],
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    hourlyRate: 650000,
    location: "TP.HCM",
    specialties: ["HSK", "Kinh doanh", "Du lịch"],
    totalStudents: 187,
    responseTime: "1 giờ",
    description:
      "Thạc sĩ Ngôn ngữ Trung Quốc với 12 năm kinh nghiệm. Chuyên đào tạo HSK và tiếng Trung thương mại cho doanh nghiệp.",
    availability: "Tối",
    certificates: ["HSK Level 6", "Chứng chỉ giảng dạy Hanban"],
    isOnline: true,
  },
  {
    id: 3,
    name: "Lê Văn Đức",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    title: "Chuyên gia Tiếng Anh Giao tiếp",
    language: "english",
    languages: ["Tiếng Anh", "Tiếng Việt"],
    experience: 6,
    rating: 4.7,
    reviewCount: 89,
    hourlyRate: 380000,
    location: "Đà Nẵng",
    specialties: ["Giao tiếp", "Phát âm", "Từ vựng"],
    totalStudents: 145,
    responseTime: "3 giờ",
    description:
      "Giảng viên năng động với phương pháp giảng dạy sáng tạo. Chuyên giúp học viên cải thiện kỹ năng giao tiếp tiếng Anh tự nhiên.",
    availability: "Chiều, Tối",
    certificates: ["IELTS 7.5", "Chứng chỉ TESOL"],
    isOnline: false,
  },
  {
    id: 4,
    name: "Phạm Thị Lan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    title: "Chuyên gia Tiếng Trung Kinh doanh",
    language: "chinese",
    languages: ["Tiếng Trung", "Tiếng Việt"],
    experience: 15,
    rating: 4.9,
    reviewCount: 267,
    hourlyRate: 750000,
    location: "Hà Nội",
    specialties: ["Tiếng Trung Kinh doanh", "Thuyết trình", "Đàm phán"],
    totalStudents: 312,
    responseTime: "30 phút",
    description:
      "Cựu Giám đốc kinh doanh tại công ty Trung Quốc, giờ là chuyên gia đào tạo tiếng Trung kinh doanh hàng đầu. Chuyên coaching thuyết trình và đàm phán.",
    availability: "Sáng",
    certificates: ["MBA", "Chứng chỉ Tiếng Trung Kinh doanh"],
    isOnline: true,
  },
  {
    id: 5,
    name: "Hoàng Thị Thu",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    title: "Giáo viên Tiếng Anh trẻ em",
    language: "english",
    languages: ["Tiếng Anh", "Tiếng Việt"],
    experience: 4,
    rating: 4.6,
    reviewCount: 67,
    hourlyRate: 320000,
    location: "TP.HCM",
    specialties: ["Tiếng Anh trẻ em", "Cơ bản", "Phát âm"],
    totalStudents: 98,
    responseTime: "4 giờ",
    description:
      "Chuyên giảng dạy tiếng Anh cho trẻ em và người mới bắt đầu. Phương pháp giảng dạy sinh động, tương tác cao.",
    availability: "Sáng, Chiều",
    certificates: ["Chứng chỉ giảng dạy trẻ em", "IELTS 7.0"],
    isOnline: true,
  },
  {
    id: 6,
    name: "Vũ Minh Châu",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
    title: "Chuyên gia HSK & Tiếng Trung học thuật",
    language: "chinese",
    languages: ["Tiếng Trung", "Tiếng Việt"],
    experience: 9,
    rating: 4.8,
    reviewCount: 134,
    hourlyRate: 580000,
    location: "Trực tuyến",
    specialties: ["HSK", "Viết học thuật", "Nói"],
    totalStudents: 178,
    responseTime: "1.5 giờ",
    description:
      "Chuyên gia HSK với tỷ lệ học viên đạt HSK 5-6 cao nhất. Kinh nghiệm giảng dạy tại các trường đại học và viện Khổng Tử.",
    availability: "Chiều, Tối",
    certificates: ["HSK Level 6", "Chứng chỉ giảng dạy Hanban"],
    isOnline: true,
  },
];

const FindingMentor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Minimal setup
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800);
    document.title = "Find Your Perfect Mentor";
  }, []);

  // Tất cả specialties từ data
  const allSpecialties = [
    ...new Set(mentorsData.flatMap((mentor) => mentor.specialties)),
  ];

  // Dropdown options
  const languageOptions = [
    { value: "all", label: "Tất cả ngôn ngữ" },
    { value: "english", label: "Tiếng Anh" },
    { value: "chinese", label: "Tiếng Trung" },
  ];

  const experienceOptions = [
    { value: "all", label: "Mọi kinh nghiệm" },
    { value: "junior", label: "Mới (< 3 năm)" },
    { value: "mid", label: "Trung bình (3-7 năm)" },
    { value: "senior", label: "Chuyên gia (> 7 năm)" },
  ];

  const sortOptions = [
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "experience", label: "Kinh nghiệm nhiều" },
    { value: "students", label: "Học viên nhiều" },
    { value: "price_low", label: "Giá thấp nhất" },
    { value: "price_high", label: "Giá cao nhất" },
  ];

  const specialtyOptions = [
    { value: "all", label: "Tất cả chuyên môn" },
    ...allSpecialties.map((specialty) => ({
      value: specialty,
      label: specialty,
    })),
  ];

  const availabilityOptions = [
    { value: "all", label: "Mọi thời gian" },
    { value: "Sáng", label: "Buổi sáng" },
    { value: "Chiều", label: "Buổi chiều" },
    { value: "Tối", label: "Buổi tối" },
  ];

  // Filter và sort mentors
  const filteredMentors = useMemo(() => {
    let filtered = mentorsData.filter((mentor) => {
      // Filter theo search term
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filter theo ngôn ngữ
      const matchesLanguage =
        selectedLanguage === "all" || mentor.language === selectedLanguage;

      // Filter theo kinh nghiệm
      const matchesExperience =
        selectedExperience === "all" ||
        (selectedExperience === "junior" && mentor.experience < 3) ||
        (selectedExperience === "mid" &&
          mentor.experience >= 3 &&
          mentor.experience <= 7) ||
        (selectedExperience === "senior" && mentor.experience > 7);

      // Filter theo specialty
      const matchesSpecialty =
        selectedSpecialty === "all" ||
        mentor.specialties.includes(selectedSpecialty);

      // Filter theo availability
      const matchesAvailability =
        selectedAvailability === "all" ||
        mentor.availability.includes(selectedAvailability);

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesExperience &&
        matchesSpecialty &&
        matchesAvailability
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price_low":
          return a.hourlyRate - b.hourlyRate;
        case "price_high":
          return b.hourlyRate - a.hourlyRate;
        case "experience":
          return b.experience - a.experience;
        case "students":
          return b.totalStudents - a.totalStudents;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    searchTerm,
    selectedLanguage,
    selectedExperience,
    selectedSpecialty,
    selectedAvailability,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLanguage("all");
    setSelectedExperience("all");
    setSelectedSpecialty("all");
    setSelectedAvailability("all");
    setSortBy("rating");
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Đang tải mentor...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <motion.div
        className="  pt-16 pb-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="block mb-6 text-5xl font-bold bg-clip-text  mt-2">
            Mentor <span className="text-orange-600">phù hợp</span> với bạn
          </span>
          <span></span>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto pb-8">
            Kết nối với các chuyên gia giảng dạy ngôn ngữ
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Search & Filter Section - Clean Minimalist Design */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Main Search Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm mentor theo tên, chuyên môn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2 flex-wrap"
            >
              {/* Language Filter */}
              <CustomDropdown
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={languageOptions}
                placeholder="Chọn ngôn ngữ"
                className="min-w-[160px]"
              />

              {/* Experience Filter */}
              <CustomDropdown
                value={selectedExperience}
                onChange={setSelectedExperience}
                options={experienceOptions}
                placeholder="Chọn kinh nghiệm"
                className="min-w-[160px]"
              />

              {/* Sort Filter */}
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Sắp xếp theo"
                className="min-w-[160px]"
              />

              {/* More Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  showFilters ||
                  selectedSpecialty !== "all" ||
                  selectedAvailability !== "all"
                    ? "bg-purple-900 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                Thêm bộ lọc
                {(selectedSpecialty !== "all" ||
                  selectedAvailability !== "all") && (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </button>
            </motion.div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Specialty */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <CustomDropdown
                    value={selectedSpecialty}
                    onChange={setSelectedSpecialty}
                    options={specialtyOptions}
                    placeholder="Chọn chuyên môn"
                  />
                </motion.div>

                {/* Availability */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian rảnh
                  </label>
                  <CustomDropdown
                    value={selectedAvailability}
                    onChange={setSelectedAvailability}
                    options={availabilityOptions}
                    placeholder="Chọn thời gian"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          <AnimatePresence>
            {(searchTerm ||
              selectedLanguage !== "all" ||
              selectedExperience !== "all" ||
              selectedSpecialty !== "all" ||
              selectedAvailability !== "all" ||
              sortBy !== "rating") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Đang lọc:</span>

                  <AnimatePresence>
                    {searchTerm && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md"
                      >
                        "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="hover:text-orange-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}

                    {selectedLanguage !== "all" && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                      >
                        {
                          languageOptions.find(
                            (opt) => opt.value === selectedLanguage
                          )?.label
                        }
                        <button
                          onClick={() => setSelectedLanguage("all")}
                          className="hover:text-blue-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}

                    {selectedExperience !== "all" && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                      >
                        {
                          experienceOptions.find(
                            (opt) => opt.value === selectedExperience
                          )?.label
                        }
                        <button
                          onClick={() => setSelectedExperience("all")}
                          className="hover:text-purple-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}

                    {selectedSpecialty !== "all" && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md"
                      >
                        {selectedSpecialty}
                        <button
                          onClick={() => setSelectedSpecialty("all")}
                          className="hover:text-green-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}

                    {selectedAvailability !== "all" && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md"
                      >
                        {
                          availabilityOptions.find(
                            (opt) => opt.value === selectedAvailability
                          )?.label
                        }
                        <button
                          onClick={() => setSelectedAvailability("all")}
                          className="hover:text-yellow-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    Xóa tất cả
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Main Content */}
          <div>
            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="text-gray-500 text-sm font-medium">
                Tìm thấy {filteredMentors.length} mentor
              </p>
            </motion.div>

            {/* Mentor Cards */}
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {filteredMentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  variants={{
                    hidden: { y: 50, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group bg-white border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-purple-100">
                          <img
                            src={mentor.avatar}
                            alt={mentor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {mentor.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {mentor.title}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {mentor.rating}
                                </span>
                              </span>
                              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                              <span>{mentor.reviewCount} đánh giá</span>
                              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                              <span>{mentor.experience} năm KN</span>
                              <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                              <span>{mentor.totalStudents} học viên</span>
                            </div>
                          </div>
                        </div>

                        {/* Languages & Specialties */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              Ngôn ngữ:
                            </span>
                            <div className="flex gap-1">
                              {mentor.languages.map((lang) => (
                                <span
                                  key={lang}
                                  className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-md font-medium"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              Chuyên môn:
                            </span>
                            <div className="flex gap-1">
                              {mentor.specialties
                                .slice(0, 2)
                                .map((specialty) => (
                                  <span
                                    key={specialty}
                                    className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-md font-medium"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {mentor.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
                          >
                            Đặt lịch ngay
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Xem hồ sơ
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredMentors.length === 0 && (
              <motion.div
                className="text-center py-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-orange-300 mb-8">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Không tìm thấy mentor nào
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thử điều chỉnh các tiêu chí tìm kiếm để tìm mentor phù hợp với
                  nhu cầu của bạn
                </p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                >
                  Đặt lại bộ lọc
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto"
          >
            {/* Top Giảng viên */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-orange-600 mb-4">
                Top Giảng viên
              </h3>
              <div className="space-y-4">
                {mentorsData.slice(0, 3).map((mentor) => (
                  <TopMentor
                    key={mentor.id}
                    avatar={mentor.avatar}
                    name={mentor.name}
                    title={mentor.title}
                    rating={mentor.rating}
                    specialties={mentor.specialties}
                  />
                ))}
              </div>
            </div>

            {/* Chat AI */}
            <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl shadow-sm border border-purple-100 overflow-hidden">
              {/* Header */}
              <div className="bg-white/80 backdrop-blur-sm pl-4 border-b border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={AIIcon} alt="AI" className="w-20 h-20" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">
                      GS Assistant
                    </h3>
                    <p className="text-xs text-gray-500">
                      Luôn sẵn sàng hỗ trợ
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* AI Message */}
                <div className="bg-white rounded-lg py-4 px-3  shadow-sm">
                  <div className="flex gap-3">
                    <img src={AIIcon} alt="AI" className="w-12 h-12" />
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Chào bạn! Tôi có thể giúp bạn tìm mentor phù hợp nhất.
                        Hãy cho tôi biết mục tiêu học tập của bạn nhé! ✨
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick suggestions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Gợi ý nhanh:
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-white hover:bg-purple-50 border border-purple-200 text-left text-sm text-gray-700 p-3 rounded-lg transition-all hover:border-purple-300 hover:shadow-sm">
                      "Tôi muốn đạt IELTS 7.0+"
                    </button>
                    <button className="w-full bg-white hover:bg-purple-50 border border-purple-200 text-left text-sm text-gray-700 p-3 rounded-lg transition-all hover:border-purple-300 hover:shadow-sm">
                      "Học tiếng Trung cho công việc"
                    </button>
                    <button className="w-full bg-white hover:bg-purple-50 border border-purple-200 text-left text-sm text-gray-700 p-3 rounded-lg transition-all hover:border-purple-300 hover:shadow-sm">
                      "Mentor tốt cho người mới bắt đầu"
                    </button>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    className="w-full bg-white border border-purple-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 pr-12"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-lg flex items-center justify-center hover:from-orange-600 hover:to-purple-700 transition-all">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default FindingMentor;
