import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  X,
  ChevronDown,
} from "lucide-react";
import { fetchLanguages, fetchMentors, fetchTopMentors } from "../../services/mentorService";
import { useNavigate } from "react-router-dom";

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
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-b-0 ${selectedOption.value === option.value
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

const FindingMentor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [totalMentors, setTotalMentors] = useState(0);
  const [topMentors, setTopMentors] = useState([]);

  const defaultAvatar =
    "https://i.pinimg.com/736x/b3/c2/77/b3c2779d6b6195793b72bf73e284b3e8.jpg";

  useEffect(() => {
    document.title = "Find Your Perfect Mentor";

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowSearchModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Dropdown options
  const [languageOptions, setLanguageOptions] = useState([
    { value: "all", label: "Tất cả ngôn ngữ" },
  ]);

  useEffect(() => {
    fetchLanguages().then((res) => {
      if (res?.data) {
        setLanguageOptions([
          { value: "all", label: "Tất cả ngôn ngữ" },
          ...res.data.map((lang) => ({
            value: lang.name.toLowerCase(),
            label:
              lang.name.toLowerCase() === "chinese"
                ? "Tiếng Trung"
                : lang.name.toLowerCase() === "english"
                  ? "Tiếng Anh"
                  : "Khác",
          })),
        ]);
      }
    });

    const fetchTopMentorsData = async () => {
      try {
        const res = await fetchTopMentors(10);
        if (res?.data) {
          setTopMentors(res.data);
        }
      } catch (error) {
        setTopMentors([]);
        console.error("Lỗi lấy top mentor:", error);
      }
    };
    fetchTopMentorsData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchMentors({
      page: 0,
      size: 12,
      language: selectedLanguage !== "all" ? selectedLanguage : undefined,
    }).then((res) => {
      if (res?.data?.content) {
        // Flatten mentors from all languages
        let apiMentors = [];
        if (Array.isArray(res.data.content)) {
          res.data.content.forEach((langGroup) => {
            if (Array.isArray(langGroup.mentors)) {
              apiMentors = [
                ...apiMentors,
                ...langGroup.mentors.map((mentor) => ({
                  ...mentor,
                  language: langGroup.languageName,
                })),
              ];
            }
          });
        }
        setMentors(apiMentors);
        setTotalMentors(res.data.totalElements || apiMentors.length);
      } else {
        setMentors([]);
        setTotalMentors(0);
      }
      setIsLoading(false);
    });
  }, [selectedLanguage]);

  const availabilityOptions = [
    { value: "all", label: "Mọi thời gian" },
    { value: "Sáng", label: "Buổi sáng" },
    { value: "Chiều", label: "Buổi chiều" },
    { value: "Tối", label: "Buổi tối" },
  ];

  const filteredMentors = useMemo(() => {
    let filtered = mentors.filter((mentor) => {
      // Filter theo search term
      const matchesSearch =
        mentor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.username?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter theo ngôn ngữ
      const matchesLanguage =
        selectedLanguage === "all" || mentor.language === selectedLanguage;

      return matchesSearch && matchesLanguage;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.fullName || "").localeCompare(b.fullName || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [mentors, searchTerm, selectedLanguage, sortBy]);

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
      {/* Hero Section & Filters Row */}
      <motion.div
        className="pt-8 pb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Hero Text */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                Tìm kiếm mentor <span className="text-orange-600">phù hợp</span>
              </h1>
              <p className="text-sm text-gray-500">
                Kết nối với các chuyên gia giảng dạy ngôn ngữ
              </p>
            </div>

            {/* Right: Search & Filters */}
            <div className="flex gap-2 items-center flex-shrink-0">
              {/* Compact Search Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-all flex items-center gap-2 min-w-[180px]"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Tìm kiếm...</span>
              </button>

              <CustomDropdown
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={languageOptions}
                placeholder="Tất cả ngôn ngữ"
                className="min-w-[140px]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="relative p-6 border-b border-gray-100">
                  <Search className="absolute left-9 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm mentor theo tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-12 py-3.5 text-base focus:outline-none placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="absolute right-9 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Search Results / Suggestions */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  {searchTerm ? (
                    // Show filtered results
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 font-medium mb-4">
                        Kết quả tìm kiếm cho "{searchTerm}"
                      </p>
                      {filteredMentors.slice(0, 5).map((mentor) => (
                        <motion.div
                          key={mentor.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => {
                            setShowSearchModal(false);
                          }}
                        >
                          <img
                            src={mentor.avatarUrl || defaultAvatar}
                            alt={mentor.fullName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = defaultAvatar;
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {mentor.fullName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              @{mentor.username}
                            </p>
                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded mt-1 inline-block">
                              {mentor.language === "english"
                                ? "Tiếng Anh"
                                : mentor.language === "chinese"
                                  ? "Tiếng Trung"
                                  : mentor.language}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      {filteredMentors.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-sm">
                            Không tìm thấy kết quả phù hợp
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Show suggestions
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500 font-medium">
                        Gợi ý tìm kiếm
                      </p>
                      <div className="space-y-2">
                        {[
                          "IELTS",
                          "Tiếng Anh giao tiếp",
                          "HSK",
                          "Tiếng Trung kinh doanh",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => {
                              setSearchTerm(suggestion);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                          >
                            <Search className="w-4 h-4 inline mr-2 text-gray-400" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2 text-xs text-gray-500">
                    <kbd className="px-2 py-1 bg-white border border-gray-200 rounded">
                      ESC
                    </kbd>
                    <span>để đóng</span>
                  </div>
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Xem tất cả kết quả
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
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
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">Đang lọc:</span>

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

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Main Content */}
          <div>
            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <p className="text-gray-500 text-xs font-medium">
                Hiện thị {filteredMentors.length} / {totalMentors} mentor
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
                            src={mentor.avatarUrl || defaultAvatar}
                            alt={mentor.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = defaultAvatar;
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {mentor.fullName}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              @{mentor.username}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <span className="font-medium">
                                  {mentor.language === "english"
                                    ? "Tiếng Anh"
                                    : mentor.language === "chinese"
                                      ? "Tiếng Trung"
                                      : mentor.language}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Language Badge */}
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              Ngôn ngữ:
                            </span>
                            <div className="flex gap-1">
                              <span className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded-md font-medium">
                                {mentor.language === "english"
                                  ? "Tiếng Anh"
                                  : mentor.language === "chinese"
                                    ? "Tiếng Trung"
                                    : mentor.language}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
                            onClick={() => navigate(`/profile/${mentor.id}`)}
                          >
                            Đặt lịch ngay
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => navigate(`/profile/${mentor.id}`)}
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
            {/* Top Giảng viên - Using API data */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-orange-600 mb-4">
                Top Giảng viên
              </h3>
              <div className="space-y-4">
                {topMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    onClick={() => navigate(`/profile/${mentor.id}`)}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <img
                      src={mentor.avatarUrl || defaultAvatar}
                      alt={mentor.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {mentor.fullName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        @{mentor.username}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                          {mentor.confirmedCount} buổi học
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default FindingMentor;