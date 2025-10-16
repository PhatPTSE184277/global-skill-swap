import Illustration from '../../img/svg/Illustration.svg';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirm) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (password !== confirm) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            toast.success('Đổi mật khẩu thành công!');
            navigate('/login');
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err.message ||
                'Đổi mật khẩu thất bại. Vui lòng thử lại.'
            );
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center justify-center min-h-screen py-4 px-4 overflow-hidden">
                <div className="max-w-6xl w-full">
                    <motion.div
                        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="lg:flex">
                            <motion.div
                                className="lg:w-1/2 bg-[#4D2C5E] p-8 lg:p-12 flex items-center justify-center text-white relative overflow-hidden"
                                {...fadeInLeft}
                            >
                                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                        <span className="text-[#4D2C5E] font-bold text-sm">G</span>
                                    </div>
                                    <span className="text-white text-xl font-medium">Global Skill</span>
                                </div>
                                <div className="text-center relative z-10 w-full">
                                    <motion.img
                                        src={Illustration}
                                        alt="Illustration"
                                        className="relative mx-auto w-80 h-64 mb-6 object-contain mt-20"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <motion.h2
                                        className="text-3xl font-bold mb-4"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        Đặt lại mật khẩu<br />Global Skill
                                    </motion.h2>
                                    <motion.p
                                        className="text-white/80 text-lg max-w-md mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        Hãy nhập mật khẩu mới để tiếp tục sử dụng tài khoản của bạn một cách an toàn!
                                    </motion.p>
                                </div>
                                <div className="absolute top-20 right-20 w-8 h-8 bg-white/10 rounded-lg transform rotate-45"></div>
                                <div className="absolute bottom-20 left-20 w-6 h-6 bg-white/10 rounded-full"></div>
                            </motion.div>
                            {/* Form bên phải */}
                            <motion.div
                                className="lg:w-1/2 p-6 lg:p-8 flex items-center justify-center"
                                {...fadeInUp}
                            >
                                <div className="w-full max-w-sm mx-auto">
                                    <motion.h2
                                        className="text-2xl font-bold text-[#4D2C5E] mb-6 text-center"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        Đặt lại mật khẩu
                                    </motion.h2>
                                    <motion.form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        <div className="mb-4 relative flex items-center">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Mật khẩu mới
                                                </label>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="Nhập mật khẩu mới"
                                                    className="w-full h-12 px-4 border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition pr-10"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Xác nhận mật khẩu
                                                </label>
                                                <input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    name="confirm"
                                                    placeholder="Nhập lại mật khẩu"
                                                    className="w-full h-12 px-4 border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition pr-10"
                                                    value={confirm}
                                                    onChange={e => setConfirm(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Đặt lại mật khẩu"}
                                        </motion.button>
                                    </motion.form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResetPasswordPage;