import Illustration from '../../img/svg/Illustration.svg';
import { useState, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const { token } = useParams();
    const location = useLocation();

    const userId = location.state?.userId || 1; // fallback tạm là 1

    const handleChange = (e, idx) => {
        const value = e.target.value.replace(/\D/, '');
        if (!value) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);
        if (idx < 5 && value) {
            inputRefs.current[idx + 1].focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            if (otp[idx]) {
                const newOtp = [...otp];
                newOtp[idx] = '';
                setOtp(newOtp);
            } else if (idx > 0) {
                inputRefs.current[idx - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            setOtp(paste.split(''));
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Mã OTP không hợp lệ');
            toast.error('Mã OTP không hợp lệ');
            return;
        }
        setLoading(true);
        try {
            // Nếu backend yêu cầu gửi token (từ URL) + OTP, bạn có thể sửa lại body cho phù hợp
            // Ở đây ví dụ gọi resetPassword với userId và token (token lấy từ URL)
            await authService.resetPassword(userId, token);
            toast.success('Xác thực OTP thành công! Vui lòng đặt lại mật khẩu.');
            navigate('/reset-password', { state: { userId, token } });
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err.message ||
                'Xác thực OTP thất bại. Vui lòng thử lại.'
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
                                    <h2 className="text-2xl font-bold text-[#4D2C5E] mb-6 text-center">Xác nhận OTP</h2>
                                    <p className="text-center text-gray-600 mb-4">
                                        Vui lòng nhập mã OTP đã được gửi đến email của bạn.
                                    </p>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div
                                            className="flex justify-center gap-2"
                                            onPaste={handlePaste}
                                        >
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={el => inputRefs.current[idx] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    className="w-12 h-12 text-center border-b-2 border-gray-300 focus:border-[#4D2C5E] outline-none text-2xl font-bold transition"
                                                    value={digit}
                                                    onChange={e => handleChange(e, idx)}
                                                    onKeyDown={e => handleKeyDown(e, idx)}
                                                />
                                            ))}
                                        </div>
                                        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition"
                                        >
                                            {loading ? "Đang xác thực..." : "Xác nhận"}
                                        </button>
                                    </form>
                                    <div className="text-center mt-6">
                                        <Link to="/forgot-password" className="text-[#4D2C5E] hover:underline font-medium">
                                            Gửi lại mã OTP
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

export default VerifyOtpPage;