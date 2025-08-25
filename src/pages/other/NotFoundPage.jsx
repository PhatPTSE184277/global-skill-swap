import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-12 relative">
                    <div className="inline-block relative">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-60"></div>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-purple-200 rounded-full opacity-60"></div>

                        <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center justify-center space-x-8">
                                <div className="relative">
                                    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-4xl">👨‍💻</span>
                                        </div>
                                    </div>
                                    {/* Laptop */}
                                    <div className="absolute -bottom-4 -right-6 w-16 h-12 bg-gray-800 rounded transform rotate-12">
                                        <div className="w-full h-8 bg-blue-500 rounded-t"></div>
                                    </div>
                                </div>

                                <div className="text-8xl font-bold text-gray-300">404</div>

                                <div className="relative">
                                    <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                            <span className="text-4xl">🤔</span>
                                        </div>
                                    </div>
                                    <div className="absolute -top-8 -right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
                                    <div className="absolute -top-12 -right-2 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                        Trang bạn tìm kiếm
                        <span className="text-orange-500">không tồn tại</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Trang này có thể đã bị xóa, di chuyển hoặc bạn đã nhập sai địa chỉ.
                        Hãy kiểm tra lại URL hoặc quay về trang chủ để tiếp tục khám phá.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Về Trang Chủ
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Quay Lại
                        </button>
                    </div>
                </div>


                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Cần hỗ trợ thêm?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 text-xl">🏠</span>
                            </div>
                            <p className="text-gray-600">Khám phá trang chủ</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-green-600 text-xl">📞</span>
                            </div>
                            <p className="text-gray-600">Liên hệ hỗ trợ</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-purple-600 text-xl">🔍</span>
                            </div>
                            <p className="text-gray-600">Tìm kiếm nội dung</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;