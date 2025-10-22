import React, { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Modal, Input, message } from "antd";
import feedbackService from "../../../services/feedbackService";
import userService from "../../../services/userService";
import { getUserById } from "../../../services/admin/userService";

const { TextArea } = Input;

const FeedbackManagementPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = React.useRef(null);
  const [filterModule, setFilterModule] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRatingChart, setShowRatingChart] = useState(false);
  const [ratingDistribution, setRatingDistribution] = useState(null);

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
    { value: "pending", label: "Chờ xử lý" },
    { value: "responded", label: "Đã phản hồi" },
  ];

  useEffect(() => {
    fetchCurrentUser();
    // load first page or reset when filters change
    setFeedbacks([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchData(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterModule, filterStatus]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // debug log when sentinel intersects
          console.log(
            "IntersectionObserver entry:",
            entry.isIntersecting,
            "hasMore=",
            hasMore,
            "loadingMore=",
            loadingMore,
            "currentPage=",
            currentPage
          );
          if (entry.isIntersecting && hasMore && !loadingMore) {
            const nextPage = currentPage + 1;
            console.log("Loading next page", nextPage);
            setCurrentPage(nextPage);
            fetchData(nextPage, true);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, hasMore, loadingMore, currentPage]);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      console.log("📌 User response:", response);

      // Xử lý cả 2 trường hợp: response.data hoặc trực tiếp response
      const userData = response?.data || response;

      if (userData) {
        console.log("✅ Current user loaded:", userData);
        setCurrentUser(userData);
      } else {
        console.warn("⚠️ No user data found");
      }
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      message.error("Không thể lấy thông tin admin!");
    }
  };

  /**
   * fetchData(page, append = false)
   * - page: page number to fetch
   * - append: whether to append results to existing feedbacks (true for infinite scroll)
   */
  const fetchData = async (page = 1, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await feedbackService.getAllFeedbacks(page, pageSize);
      if (res.success) {
        let items = res.data.feedbacks || [];
        if (filterModule !== "all")
          items = items.filter((f) => f.module_type === filterModule);
        if (filterStatus !== "all")
          items = items.filter((f) => f.status === filterStatus);

        // Fetch user emails for each new feedback
        const feedbacksWithEmails = await Promise.all(
          items.map(async (feedback) => {
            try {
              const userResponse = await getUserById(feedback.user_id);
              const userData = userResponse?.data || userResponse;
              return {
                ...feedback,
                userEmail: userData?.email || `User ${feedback.user_id}`,
              };
            } catch (error) {
              console.error(`Error fetching user ${feedback.user_id}:`, error);
              return {
                ...feedback,
                userEmail: `User ${feedback.user_id}`,
              };
            }
          })
        );

        if (append) {
          setFeedbacks((prev) => [...prev, ...feedbacksWithEmails]);
        } else {
          setFeedbacks(feedbacksWithEmails);
        }

        setHasMore(page < (res.data.pagination?.totalPages || 1));
      }

      const stats = await feedbackService.getStatistics(
        filterModule !== "all" ? filterModule : null
      );
      if (stats.success) {
        setStatistics(stats.data);
        if (stats.data.ratingCounts) {
          setRatingDistribution(stats.data.ratingCounts);
        }
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      // Handle error silently
    } finally {
      if (!append) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleRespond = (feedback) => {
    setSelectedFeedback(feedback);
    setAdminResponse("");
    setShowModal(true);
  };

  const submitResponse = async () => {
    if (!adminResponse.trim()) {
      message.warning("Vui lòng nhập phản hồi!");
      return;
    }

    console.log("📌 Current user state:", currentUser);

    // Kiểm tra các trường có thể chứa ID
    const userId =
      currentUser?.id || currentUser?.user_id || currentUser?.userId;

    if (!userId) {
      message.error("Không tìm thấy thông tin admin! Vui lòng đăng nhập lại.");
      console.error("❌ No user ID found. Current user:", currentUser);
      return;
    }

    console.log("✅ Sending response with user ID:", userId);

    try {
      const payload = {
        admin_response: adminResponse,
        responded_by: userId,
        status: "responded",
      };

      console.log("📤 Payload:", payload);

      const res = await feedbackService.respondToFeedback(
        selectedFeedback.id,
        payload
      );

      console.log("📥 Response:", res);

      if (res.success) {
        message.success("Phản hồi thành công!");
        setShowModal(false);
        setAdminResponse("");
        fetchData();
      } else {
        message.error(res.message || "Không thể gửi phản hồi!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi phản hồi!");
      console.error("❌ Error responding to feedback:", error);
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
      responded: { label: "Đã phản hồi", color: "bg-blue-100 text-blue-800" },
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
            <div
              onClick={() => setShowRatingChart(true)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all border-l-4 border-orange-500 cursor-pointer transform hover:scale-105"
            >
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
                    {(statistics.responded || 0) + (statistics.resolved || 0)}
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
                          <span className="font-medium">Email:</span>{" "}
                          {fb.userEmail || `User ${fb.user_id}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Module ID:</span>{" "}
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
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Pagination */}
          {/* Infinite scroll sentinel and loading indicator */}
          <div className="py-4 flex items-center justify-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-900"></div>
                <span>Đang tải thêm...</span>
              </div>
            )}
            {/* Manual load more fallback */}
            {!loadingMore && hasMore && (
              <button
                onClick={() => {
                  const nextPage = currentPage + 1;
                  setCurrentPage(nextPage);
                  fetchData(nextPage, true);
                }}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                Tải thêm
              </button>
            )}
          </div>
          <div ref={sentinelRef} className="w-full h-6" />
        </div>
      </div>

      {/* Ant Design Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-lg font-bold text-purple-900">
              Phản Hồi Feedback
            </span>
          </div>
        }
        open={showModal}
        onOk={submitResponse}
        onCancel={() => {
          setShowModal(false);
          setAdminResponse("");
        }}
        width={700}
        okText={
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Gửi Phản Hồi
          </span>
        }
        cancelText="Hủy"
        okButtonProps={{
          className: "bg-purple-900 hover:bg-purple-800",
          style: { height: "40px" },
        }}
        cancelButtonProps={{
          style: { height: "40px" },
        }}
      >
        {selectedFeedback && (
          <div className="space-y-4">
            {/* Feedback Info */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
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
              <p className="text-gray-700 leading-relaxed mb-3">
                {selectedFeedback.comment || (
                  <span className="italic text-gray-400">
                    Không có nhận xét
                  </span>
                )}
              </p>
              <div className="pt-3 border-t border-purple-200 flex items-center gap-4 text-xs text-gray-600">
                <span>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedFeedback.userEmail ||
                    `User ${selectedFeedback.user_id}`}
                </span>
                <span>
                  <span className="font-medium">Module ID:</span>{" "}
                  {selectedFeedback.module_id}
                </span>
                <span>
                  {new Date(selectedFeedback.created_at).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Response Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phản hồi của bạn
              </label>
              <TextArea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Nhập phản hồi cho người dùng..."
                rows={5}
                className="rounded-lg"
                style={{
                  fontSize: "14px",
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                {adminResponse.length} ký tự
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Rating Chart Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-lg font-bold text-orange-900">
              Biểu Đồ Đánh Giá
            </span>
          </div>
        }
        open={showRatingChart}
        onCancel={() => setShowRatingChart(false)}
        footer={null}
        width={600}
      >
        {!statistics || !ratingDistribution ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Average Rating Display */}
            <div className="text-center py-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Điểm trung bình</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-5xl font-bold text-orange-600">
                  {statistics.averageRating.toFixed(1)}
                </p>
                <div className="flex flex-col items-start">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(statistics.averageRating)
                            ? "fill-orange-400 text-orange-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statistics.total} đánh giá
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Phân bố đánh giá
              </h3>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[`${rating}_star`] || 0;
                const percentage =
                  statistics.total > 0 ? (count / statistics.total) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">
                        {rating}
                      </span>
                      <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    </div>

                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2 w-24 justify-end">
                      <span className="text-sm font-semibold text-gray-700">
                        {count}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tích cực</p>
                <p className="text-lg font-bold text-green-600">
                  {(ratingDistribution["5_star"] || 0) +
                    (ratingDistribution["4_star"] || 0)}
                </p>
                <p className="text-xs text-gray-500">≥ 4 sao</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Trung bình</p>
                <p className="text-lg font-bold text-yellow-600">
                  {ratingDistribution["3_star"] || 0}
                </p>
                <p className="text-xs text-gray-500">3 sao</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Tiêu cực</p>
                <p className="text-lg font-bold text-red-600">
                  {(ratingDistribution["2_star"] || 0) +
                    (ratingDistribution["1_star"] || 0)}
                </p>
                <p className="text-xs text-gray-500">≤ 2 sao</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackManagementPage;
