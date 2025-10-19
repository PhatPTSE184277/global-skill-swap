import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import feedbackService from "../../../services/feedbackService";

const FeedbackManagementPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [showModal, setShowModal] = useState(false);

  const modules = [
    { value: "all", label: "Tất cả" },
    { value: "meeting_room", label: "Phòng Họp" },
    { value: "mentor", label: "Mentor" },
    { value: "course", label: "Khóa Học" },
    { value: "chatbot", label: "Chatbot" },
    { value: "system", label: "Hệ Thống" },
    { value: "other", label: "Khác" },
  ];

  const statuses = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ" },
    { value: "responded", label: "Đã phản hồi" },
  ];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterModule, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await feedbackService.getAllFeedbacks(currentPage, 8);
      if (res.success) {
        let filtered = res.data.feedbacks;
        if (filterModule !== "all")
          filtered = filtered.filter((f) => f.module_type === filterModule);
        if (filterStatus !== "all")
          filtered = filtered.filter((f) => f.status === filterStatus);
        setFeedbacks(filtered);
        setTotalPages(res.data.pagination.totalPages);
      }

      const stats = await feedbackService.getStatistics(
        filterModule !== "all" ? filterModule : null
      );
      if (stats.success) setStatistics(stats.data);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (feedback) => {
    setSelectedFeedback(feedback);
    setAdminResponse("");
    setShowModal(true);
  };

  const submitResponse = async () => {
    if (!adminResponse.trim()) return;
    try {
      const res = await feedbackService.respondToFeedback(selectedFeedback.id, {
        admin_response: adminResponse,
        admin_id: "admin01",
      });
      if (res.success) {
        setShowModal(false);
        fetchData();
      }
    } catch {
      alert("Có lỗi xảy ra");
    }
  };

  const handleArchive = async (id) => {
    try {
      await feedbackService.updateFeedback(id, { status: "archived" });
      fetchData();
    } catch {
      // Handle error
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: "Chờ", color: "bg-orange-100 text-orange-800" },
      responded: { label: "Đã phản hồi", color: "bg-green-100 text-green-800" },
      archived: { label: "Lưu trữ", color: "bg-gray-100 text-gray-800" },
    };
    const { label, color } = config[status] || config.pending;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  if (loading && !statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-900 mb-1">
            Quản Lý Feedback
          </h1>
          <p className="text-sm text-gray-600">
            Theo dõi và phản hồi đánh giá từ người dùng
          </p>
        </div>

        {/* Stats */}
        {statistics && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Tổng Feedback
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {statistics.total}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Điểm Trung Bình
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statistics.averageRating.toFixed(1)}/5
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Chờ Xử Lý
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {statistics.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Đã Phản Hồi
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.responded}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Module:
              </label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                {modules.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Trạng thái:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-900 mx-auto"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có feedback nào</p>
            </div>
          ) : (
            <>
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {fb.module_type}
                        </span>
                        {getStatusBadge(fb.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(fb.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(fb.rating)}
                        <span className="text-sm font-semibold text-gray-700">
                          {fb.rating.toFixed(1)}/5
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {fb.comment || (
                          <span className="italic text-gray-400">
                            Không có nhận xét
                          </span>
                        )}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">User:</span>{" "}
                          {fb.user_id}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">ID:</span>{" "}
                          {fb.module_id}
                        </span>
                      </div>

                      {fb.admin_response && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <p className="text-xs font-semibold text-purple-900 mb-1">
                            Phản hồi của Admin:
                          </p>
                          <p className="text-sm text-gray-700">
                            {fb.admin_response}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {fb.status === "pending" && (
                        <button
                          onClick={() => handleRespond(fb)}
                          className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors text-sm font-medium shadow-sm"
                        >
                          Phản hồi
                        </button>
                      )}
                      {fb.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(fb.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Lưu trữ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Trang <span className="font-semibold">{currentPage}</span> /{" "}
                  {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl transform transition-all">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-purple-900">
                Phản Hồi Feedback
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-5 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-semibold">
                  {selectedFeedback.module_type}
                </span>
                <div className="flex items-center gap-2">
                  {renderStars(selectedFeedback.rating)}
                  <span className="text-sm font-bold text-purple-900">
                    {selectedFeedback.rating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {selectedFeedback.comment}
              </p>
              <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-4 text-xs text-gray-600">
                <span>
                  User:{" "}
                  <span className="font-medium">
                    {selectedFeedback.user_id}
                  </span>
                </span>
                <span>
                  ID:{" "}
                  <span className="font-medium">
                    {selectedFeedback.module_id}
                  </span>
                </span>
                <span>
                  {new Date(selectedFeedback.created_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phản hồi của bạn
              </label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Nhập phản hồi cho người dùng..."
                rows={4}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={submitResponse}
                className="px-6 py-2.5 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Send className="w-4 h-4" />
                Gửi Phản Hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagementPage;
