import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Illustration from '../../img/svg/Illustration.svg'
import GoogleIcon from '../../img/svg/icons8-google.svg';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.register(formData);
            const res = response.data;
            if (res.success) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
            } else {
                toast.error(res.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err.message ||
                'Đăng ký thất bại. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

                                <div className="text-center relative z-10">
                                    <img
                                        src={Illustration}
                                        alt="Illustration"
                                        className="relative mx-auto w-80 h-64 mb-6 object-contain"
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

                            <div className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm mx-auto">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-left leading-tight">
                                        Đăng nhập
                                    </h1>

                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-center gap-2 rounded-full py-3 mb-8 bg-white border border-gray-200 shadow-[0_4px_24px_0_rgba(77,44,94,0.08)] hover:bg-gray-50 transition"
                                    >
                                        <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                                        <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
                                    </button>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="Nhập tên đăng nhập"
                                                className="w-full h-12 px-4 bg-transparent border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email"
                                                className="w-full h-12 px-4 bg-transparent border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 relative flex items-center">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="••••••••••••••••"
                                                    className="w-full h-12 px-4 bg-transparent border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition pr-10"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <div className="mb-4 relative flex items-center">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="••••••••••••••••"
                                                    className="w-full h-12 px-4 bg-transparent border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition pr-10"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                            </label>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold px-8 py-2 rounded-full shadow-[0_8px_32px_0_rgba(77,44,94,0.16)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2" size={20} />
                                                    </>
                                                ) : (
                                                    'ĐĂNG KÝ'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="text-center mt-10">
                                        <span className="text-gray-500">Đã có tài khoản? </span>
                                        <Link to="/login" className="text-[#4D2C5E] font-semibold hover:underline">
                                            Đăng nhập
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

export default RegisterPage;