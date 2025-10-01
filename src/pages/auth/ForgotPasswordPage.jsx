import Illustration from '../../img/svg/Illustration.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.');
            setTimeout(() => {
                navigate('/verify-otp');
            }, 1500);
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err.message ||
                'Có lỗi xảy ra, vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100">
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
                <div className="max-w-6xl w-full">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
                        <div className="lg:flex">
                            {/* Left: Illustration */}
                            <div className="lg:w-1/2 bg-[#4D2C5E] p-8 lg:p-12 flex items-center justify-center text-white relative overflow-hidden">
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span className="text-[#4D2C5E] font-bold text-sm">{ }</span>
                                    </div>
                                    <span className="text-white text-xl font-medium">Global Skill</span>
                                </div>
                                <div className="text-center relative z-10 w-full">
                                    <img
                                        src={Illustration}
                                        alt="Illustration"
                                        className="relative mx-auto w-80 h-64 mb-6 object-contain mt-20"
                                    />
                                    <h2 className="text-3xl font-bold mb-4">
                                        Cộng đồng học ngôn ngữ trực tuyến<br />cùng Mentor
                                    </h2>
                                    <p className="text-white/80 text-lg max-w-md mx-auto">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                    </p>
                                </div>
                                <div className="absolute top-20 right-20 w-8 h-8 bg-white/10 rounded-lg transform rotate-45"></div>
                                <div className="absolute bottom-20 left-20 w-6 h-6 bg-white/10 rounded-full"></div>
                            </div>
                            {/* Right: Form */}
                            <div className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm mx-auto">
                                    <h2 className="text-2xl font-bold text-[#4D2C5E] mb-6 text-center">Quên mật khẩu</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nhập email của bạn
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email"
                                                className="w-full h-12 px-4 border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition disabled:opacity-50"
                                        >
                                            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                                        </button>
                                    </form>
                                    <div className="text-center mt-6">
                                        <Link to="/login" className="text-[#4D2C5E] hover:underline font-medium">
                                            Quay lại đăng nhập
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;