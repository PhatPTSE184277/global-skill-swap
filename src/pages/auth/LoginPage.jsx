import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Illustration from '../../img/svg/Illustration.svg'
import GoogleIcon from '../../img/svg/icons8-google.svg';
import authService from '../../services/authService';
import userService from '../../services/userService';
import { addAuth } from '../../reduxs/reducers/AuthReducer';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const res = response.data;

      if (res.success) {
        const token = res.data.access_token;
        localStorage.setItem('authData', JSON.stringify({ token }));

        const userRes = await userService.getCurrentUser();
        if (userRes?.success && userRes?.data) {
          dispatch(addAuth({ user: userRes.data, token }));
        }

        toast.success('Đăng nhập thành công');
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-[#4D2C5E] font-bold text-sm">{ }</span>
                  </div>
                  <span className="text-white text-xl font-medium">Global Skill</span>
                </div>
                <div className="text-center relative z-10">
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
                    Cộng đồng học ngôn ngữ trực tuyến<br />cùng Mentor
                  </motion.h2>
                  <motion.p
                    className="text-white/80 text-lg max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >Tham gia cộng đồng để học hỏi, chia sẻ và phát triển kỹ năng cùng các Mentor!
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-8 text-left leading-tight">
                    Chào mừng bạn trở lại cộng đồng Global Skill
                  </h1>
                  <motion.button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3 mb-6 bg-white border border-gray-200 shadow-[0_4px_24px_0_rgba(77,44,94,0.08)] hover:bg-gray-50 transition cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                    <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
                  </motion.button>
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc tên đăng nhập</label>
                      <input
                        type="text"
                        name="usernameOrEmail"
                        placeholder="Nhập email hoặc tên đăng nhập"
                        className="w-full h-12 px-4 bg-transparent border-b border-gray-300 focus:border-[#4D2C5E] outline-none text-base placeholder-gray-400 transition"
                        value={formData.usernameOrEmail}
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
                        <div className="flex justify-end mt-2">
                          <Link
                            to="/forgot-password"
                            className="text-sm text-[#4D2C5E] hover:underline font-semibold"
                          >
                            Quên mật khẩu?
                          </Link>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <motion.div
                      className="flex justify-end mt-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold px-8 py-2 rounded-full shadow-[0_8px_32px_0_rgba(77,44,94,0.16)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                          </>
                        ) : (
                          'ĐĂNG NHẬP'
                        )}
                      </button>
                    </motion.div>
                  </motion.form>
                  <div className="text-center mt-10">
                    <span className="text-gray-500">Chưa có tài khoản? </span>
                    <Link to="/register" className="text-[#4D2C5E] font-semibold hover:underline">
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;