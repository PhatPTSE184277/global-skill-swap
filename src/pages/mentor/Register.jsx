import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUpload,
  FiUser,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiFileText,
  FiCreditCard,
  FiShield,
  FiDollarSign,
} from "react-icons/fi";

const MentorRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    location: "",

    // Professional Info
    expertise: "",
    experience: "",
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

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: FiUser },
    { id: 2, title: "Tài liệu & CV", icon: FiFileText },
    { id: 3, title: "Thanh toán", icon: FiCreditCard },
    { id: 4, title: "Xác nhận", icon: FiCheck },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = () => {
    // Handle final submission
    console.log("Submitting application:", formData);
    alert("Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ trong 24-48h.");
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
        <div className="mb-12">
          <div className="flex justify-between items-center">
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

                <div className="ml-3 hidden md:block">
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
                    className={`hidden md:block w-24 h-0.5 ml-4 ${
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
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số năm kinh nghiệm *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn kinh nghiệm</option>
                      <option value="1-2">1-2 năm</option>
                      <option value="3-5">3-5 năm</option>
                      <option value="5-10">5-10 năm</option>
                      <option value="10+">Trên 10 năm</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu bản thân *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Hãy chia sẻ về kinh nghiệm, kỹ năng và những gì bạn có thể mang lại cho học viên..."
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá 1 giờ mentoring (VNĐ) *
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="500000"
                  />
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

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FiCreditCard className="mr-3 text-orange-500" />
                  Thanh toán phí đăng ký
                </h2>

                <div
                  className="rounded-xl p-6 mb-6"
                  style={{ backgroundColor: "#FDF8EE" }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">
                        Phí đăng ký Mentor
                      </h3>
                      <p className="text-sm text-purple-900">
                        Một lần duy nhất
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">
                        100,000 VNĐ
                      </p>
                      <p className="text-sm line-through text-purple-900">
                        399,000 VNĐ
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phương thức thanh toán
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: "zalopay",
                          name: "ZaloPay",
                          icon: FiCreditCard,
                          color: "#0068FF",
                        },
                        {
                          id: "vnpay",
                          name: "VNPay",
                          icon: FiShield,
                          color: "#1E40AF",
                        },
                      ].map((method) => (
                        <div
                          key={method.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: method.id,
                            }))
                          }
                        >
                          <method.icon
                            className="w-6 h-6 mb-2"
                            style={{ color: method.color }}
                          />
                          <p className="font-medium text-gray-800">
                            {method.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ZaloPay Form */}
                  {formData.paymentMethod === "zalopay" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            Z
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800">
                            Thanh toán qua ZaloPay
                          </h4>
                          <p className="text-sm text-blue-600">
                            Nhanh chóng, an toàn và tiện lợi
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          • Quét mã QR hoặc mở ứng dụng ZaloPay
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          • Nhập số tiền: <strong>299,000 VNĐ</strong>
                        </p>
                        <p className="text-sm text-gray-700">
                          • Xác nhận thanh toán
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* VNPay Form */}
                  {formData.paymentMethod === "vnpay" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-indigo-50 border border-indigo-200 rounded-lg p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            VN
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-indigo-800">
                            Thanh toán qua VNPay
                          </h4>
                          <p className="text-sm text-indigo-600">
                            Hỗ trợ tất cả ngân hàng Việt Nam
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm text-gray-700 mb-2">
                          • Hỗ trợ thẻ ATM, Internet Banking
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          • Số tiền: <strong>299,000 VNĐ</strong>
                        </p>
                        <p className="text-sm text-gray-700">
                          • Bảo mật cao với công nghệ 3D Secure
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* E-wallet Info */}
                  {formData.paymentMethod === "e-wallet" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-green-800 mb-2">
                        Thanh toán qua ví điện tử
                      </h4>
                      <p className="text-sm text-green-700">
                        Bạn sẽ được chuyển hướng đến trang thanh toán của
                        MoMo/ZaloPay
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheck className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Thanh toán thành công!
                </h2>

                <p className="text-gray-600 mb-8">
                  Cảm ơn bạn đã đăng ký làm mentor. Chúng tôi sẽ xem xét hồ sơ
                  và liên hệ trong vòng 24-48 giờ.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Thông tin đăng ký
                  </h3>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Họ tên:</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chuyên môn:</span>
                      <span className="font-medium">{formData.expertise}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mức phí:</span>
                      <span className="font-medium">
                        {Number(formData.hourlyRate).toLocaleString()} VNĐ/giờ
                      </span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Phí đăng ký:</span>
                      <span className="text-green-600">299,000 VNĐ</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitApplication}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                  >
                    Hoàn thành đăng ký
                  </motion.button>

                  <button className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all">
                    Tải xuống biên lai
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                {currentStep === 3 ? "Thanh toán" : "Tiếp tục"}
                <FiArrowRight className="ml-2" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MentorRegister;
