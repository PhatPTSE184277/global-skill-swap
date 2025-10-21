import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiCheck,
    FiStar,
    FiUsers,
    FiClock,
    FiTrendingUp,
    FiAward,
} from "react-icons/fi";
import { message } from "antd";
import { useLocation } from "react-router-dom";
import ProductContext from "../../contexts/ProductContext";

const MentorPackages = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const registrationData = location.state?.registrationData;
    const { products, loading, fetchProducts } = useContext(ProductContext);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        fetchProducts({ size: 10 });
    }, [fetchProducts]);

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        message.success(`Đã chọn gói ${pkg.name}`);
        navigate("/payment", {
            state: {
                selectedPackage: pkg,
                registrationData: registrationData,
            },
        });
    };

    const getPackageIcon = (index) => {
        const icons = [FiUsers, FiTrendingUp, FiAward, FiStar];
        return icons[index % icons.length];
    };

    const getPackageColor = (index) => {
        const colors = [
            { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-600" },
            {
                bg: "bg-purple-50",
                border: "border-purple-500",
                text: "text-purple-600",
            },
            {
                bg: "bg-orange-50",
                border: "border-orange-500",
                text: "text-orange-600",
            },
            { bg: "bg-pink-50", border: "border-pink-500", text: "text-pink-600" },
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải gói đăng ký...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Chọn Gói Đăng Ký{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
                            Mentor
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Chọn gói phù hợp với mục tiêu của bạn và bắt đầu hành trình chia sẻ
                        kiến thức
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {products.map((pkg, index) => {
                        const Icon = getPackageIcon(index);
                        const colors = getPackageColor(index);
                        const isPopular = index === 1;

                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 ${isPopular ? "border-orange-500 ring-4 ring-orange-200" : "border-gray-200"
                                    }`}
                            >
                                {isPopular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-bl-3xl font-bold flex items-center gap-2">
                                            <FiStar className="animate-pulse" />
                                            Phổ biến nhất
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    <div
                                        className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6`}
                                    >
                                        <Icon className={`w-8 h-8 ${colors.text}`} />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {pkg.name}
                                    </h3>

                                    <p className="text-gray-600 mb-6 min-h-[60px]">
                                        {pkg.description || "Gói đăng ký dành cho mentor"}
                                    </p>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-bold text-gray-900">
                                                {pkg.price?.toLocaleString("vi-VN")}đ
                                            </span>
                                            <span className="text-gray-500">/tháng</span>
                                        </div>
                                    </div>

    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start gap-3">
                                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">
                                                Không giới hạn số lượng học viên
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">
                                                Công cụ quản lý lịch học
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">
                                                Hỗ trợ video call 1-1
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">
                                                Dashboard thống kê chi tiết
                                            </span>
                                        </div>
                                        {isPopular && (
                                            <>
                                                <div className="flex items-start gap-3">
                                                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                    <span className="text-gray-700">
                                                        Ưu tiên hiển thị profile
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                                    <span className="text-gray-700">
                                                        Hỗ trợ 24/7
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSelectPackage(pkg)}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all cursor-po    ${isPopular
                                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl"
                                                : "bg-gray-900 text-white hover:bg-gray-800"
                                            }`}
                                    >
                                        Chọn gói này
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MentorPackages;