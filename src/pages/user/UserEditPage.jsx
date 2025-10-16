import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import UserEditForm from "../../components/user/UserEditForm";

const UserEditPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await userService.getCurrentUser();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleUpdate = async (formData) => {
    setLoading(true);
    await userService.updateCurrentUser(formData);
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto">
        {user && (
          <UserEditForm user={user} onSubmit={handleUpdate} loading={loading} />
        )}
        {success && (
          <div className="mt-6 text-center text-green-600 font-semibold">
            Cập nhật thành công!
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEditPage;