import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiUser,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiFileText,
} from "react-icons/fi";
import userService from "../../services/userService";
import { message } from "antd";

const MentorRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentUserData, setCurrentUserData] = useState(null); // Lưu data user hiện tại
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    location: "",

    // Professional Info
    expertise: "",
    customExpertise: "", // Thêm field cho lĩnh vực tự nhập
    languages: [], // Đổi experience thành languages array để chọn nhiều
    bio: "",
    hourlyRate: "",

    // Documents
    cv: null,
    certificates: [],

    // Payment
    paymentMethod: "zalopay",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Load thông tin user hiện tại khi component mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        if (userData) {
          setCurrentUserData(userData);
          // Tự động điền các field đã có
          setFormData((prev) => ({
            ...prev,
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            // Không tự động điền password vì bảo mật
            languages: userData.languageNames || [],
            expertise: userData.domainNames?.[0] || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadCurrentUser();
  }, []);

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: FiUser },
    { id: 2, title: "Tài liệu & CV", icon: FiFileText },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler cho checkbox ngôn ngữ
  const handleLanguageChange = (language) => {
    setFormData((prev) => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const handleFileUpload = (files, type) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          if (type === "cv") {
            setFormData((prev) => ({ ...prev, cv: files[0] }));
          } else {
            setFormData((prev) => ({
              ...prev,
              certificates: [...prev.certificates, ...files],
            }));
          }
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, "cv");
    }
  };

  const nextStep = async () => {
    if (currentStep === 2) {
      // Validate required fields before going to payment
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.expertise ||
        !formData.cv
      ) {
        message.error(
          "Vui lòng điền đầy đủ thông tin và tải lên CV trước khi tiếp tục."
        );
        return;
      }

      // Validate ngôn ngữ dạy
      if (formData.languages.length === 0) {
        message.error("Vui lòng chọn ít nhất một ngôn ngữ dạy.");
        return;
      }

      // Validate lĩnh vực tự nhập nếu chọn "Khác"
      if (formData.expertise === "other" && !formData.customExpertise) {
        message.error("Vui lòng nhập lĩnh vực chuyên môn của bạn.");
        return;
      }

      try {
        setLoading(true);

        // Chuẩn bị data để gửi API
        const updateData = {
          ...currentUserData, // Giữ nguyên các field khác
          username: currentUserData?.username, // Giữ nguyên username
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          languageNames: formData.languages,
          domainNames: [
            formData.expertise === "other"
              ? formData.customExpertise
              : formData.expertise,
          ],
          // KHÔNG gửi password nếu không thay đổi
        };

        // Gọi API update user
        await userService.updateCurrentUser(updateData);

        // Upload CV nếu có
        if (formData.cv) {
          await userService.uploadCV(formData.cv);
        }

        message.success("Cập nhật thông tin thành công!");

        // Chuyển đến trang thanh toán
        navigate("/mentor/package", {
          state: {
            registrationData: formData,
          },
        });
      } catch (error) {
        console.error("Error updating user:", error);
        message.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại."
        );
      } finally {
        setLoading(false);
      }
    } else if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-purple-900 mb-4">
            Đăng ký trở thành Mentor
          </h1>
          <p className="text-gray-600 text-lg">
            Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="">
          <div className="flex justify-center items-center max-w-lg mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                  {currentStep > step.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-purple-900 rounded-full"
                    >
                      <FiCheck className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                <div className="ml-3 mr-6">
                  <p
                    className={`text-sm font-medium ${
                      currentStep > step.id
                        ? "text-purple-900"
                        : currentStep === step.id
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mr-6 ${
                      currentStep > steps[index + 1].id
                        ? "bg-purple-900"
                        : currentStep > step.id
                        ? "bg-orange-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FiUser className="mr-3 text-orange-500" />
                  Thông tin cá nhân
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="TP. Hồ Chí Minh"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lĩnh vực chuyên môn *
                    </label>
                    <select
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn lĩnh vực</option>
                      <option value="technology">Công nghệ thông tin</option>
                      <option value="business">Kinh doanh</option>
                      <option value="design">Thiết kế</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Tài chính</option>
                      <option value="education">Giáo dục</option>
                      <option value="other">Khác (Tự nhập)</option>
                    </select>

                    {/* Input field xuất hiện khi chọn "Khác" */}
                    {formData.expertise === "other" && (
                      <input
                        type="text"
                        name="customExpertise"
                        value={formData.customExpertise}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all mt-3"
                        placeholder="Nhập lĩnh vực chuyên môn của bạn"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ngôn ngữ dạy * (Có thể chọn nhiều)
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes("chinese")}
                          onChange={() => handleLanguageChange("chinese")}
                          className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700 font-medium">
                          Tiếng Trung
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes("english")}
                          onChange={() => handleLanguageChange("english")}
                          className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-gray-700 font-medium">
                          Tiếng Anh
                        </span>
                      </label>
                    </div>
                    {formData.languages.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        Đã chọn:{" "}
                        {formData.languages
                          .map((lang) =>
                            lang === "chinese" ? "Tiếng Trung" : "Tiếng Anh"
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Documents Upload */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FiFileText className="mr-3 text-purple-700" />
                  Tài liệu & CV
                </h2>

                {/* CV Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV/Resume (PDF) *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300 hover:border-orange-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {isUploading ? (
                      <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-orange-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          Đang tải lên... {uploadProgress}%
                        </p>
                      </div>
                    ) : formData.cv ? (
                      <div className="space-y-2">
                        <FiCheck className="w-12 h-12 text-green-500 mx-auto" />
                        <p className="text-green-600 font-medium">
                          {formData.cv.name}
                        </p>
                        <button
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, cv: null }))
                          }
                          className="text-red-500 text-sm hover:underline"
                        >
                          Xóa file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Kéo thả file CV của bạn vào đây
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            hoặc{" "}
                            <label className="text-orange-500 hover:text-orange-600 cursor-pointer font-medium">
                              chọn file
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e.target.files, "cv")
                                }
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Chỉ hỗ trợ file PDF (tối đa 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certificates Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chứng chỉ/Bằng cấp (tùy chọn)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all">
                    <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Tải lên chứng chỉ, bằng cấp
                    </p>
                    <label className="text-purple-700 hover:text-purple-800 cursor-pointer font-medium text-sm">
                      Chọn files
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e.target.files, "certificates")
                        }
                      />
                    </label>
                  </div>

                  {formData.certificates.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.certificates.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <button
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                certificates: prev.certificates.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <span className="text-sm">Xóa</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiArrowLeft className="mr-2" />
              Quay lại
            </button>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={nextStep}
              disabled={loading}
              className={`flex items-center px-8 py-3 font-medium rounded-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
              } text-white`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  {currentStep === 2 ? "Tiếp tục thanh toán" : "Tiếp tục"}
                  <FiArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorRegister;