import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmModal from "../admin/ConfirmModal";
import "../../styles/datepicker-custom.css";

const UserEditForm = ({ user, onSubmit, loading }) => {
  const [form, setForm] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : null
  );
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirm = () => {
    onSubmit({
      ...form,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : "",
    });
    setShowModal(false);
  };

  return (
    <form
      className="max-w-xl mx-auto bg-white rounded-3xl border border-purple-100 shadow-2xl p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-[#4D2C5E] mb-4 text-center">Cập nhật thông tin cá nhân</h2>
      <div className="flex flex-col gap-4">
        {/* Tên đăng nhập - không cho sửa */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tên đăng nhập</label>
          <input
            name="username"
            value={form.username}
            disabled
            className="w-full border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
            placeholder="Tên đăng nhập"
          />
        </div>
        {/* Email - không cho sửa */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
            placeholder="Email"
          />
        </div>
        {/* Các trường được sửa */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Họ tên</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#4D2C5E] bg-transparent transition-all"
            placeholder="Họ tên"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#4D2C5E] bg-transparent transition-all"
            placeholder="Số điện thoại"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
          <DatePicker
            selected={dateOfBirth}
            onChange={date => setDateOfBirth(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày sinh"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#4D2C5E] bg-white transition-all"
            disabled={loading}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Avatar URL</label>
          <div className="flex items-center gap-4 mb-2">
            <img
              src={form.avatarUrl || "https://ui-avatars.com/api/?name=User"}
              alt="Avatar"
              className="w-16 h-16 rounded-full border border-gray-200 object-cover bg-gray-100"
            />
            <span className="text-gray-500 text-sm">Xem trước</span>
          </div>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 font-medium text-gray-900 placeholder-gray-400 outline-none focus:border-[#4D2C5E] bg-transparent transition-all"
            placeholder="Link ảnh đại diện"
            disabled={loading}
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-[#4D2C5E] hover:bg-[#3c204a] text-white font-semibold py-3 rounded-full transition disabled:opacity-50 flex items-center justify-center cursor-pointer text-lg"
        disabled={loading}
      >
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>
      <ConfirmModal
        open={showModal}
        title="Xác nhận cập nhật"
        message="Bạn có chắc muốn thay đổi thông tin cá nhân?"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </form>
  );
};

export default UserEditForm;