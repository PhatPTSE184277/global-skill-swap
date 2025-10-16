import Illustration from '../../img/svg/Illustration.svg';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';

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

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.');
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
        <motion.div
            className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
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
                                        Quên mật khẩu?
                                    </motion.h2>
                                    <motion.p
                                        className="text-white/80 text-lg max-w-md mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        Nhập email để nhận liên kết đặt lại mật khẩu. Đừng lo, chúng tôi sẽ giúp bạn lấy lại quyền truy cập!
                                    </motion.p>
                                </div>
                                <div className="absolute top-20 right-20 w-8 h-8 bg-white/10 rounded-lg transform rotate-45"></div>
                                <div className="absolute bottom-20 left-20 w-6 h-6 bg-white/10 rounded-full"></div>
                            </motion.div>

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
                                        Quên mật khẩu
                                    </motion.h2>
                                    <motion.form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
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
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition disabled:opacity-50"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : "Gửi yêu cầu"}
                                        </motion.button>
                                    </motion.form>
                                    <motion.div
                                        className="text-center mt-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <Link to="/login" className="text-[#4D2C5E] hover:underline font-medium">
                                            Quay lại đăng nhập
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ForgotPasswordPage;