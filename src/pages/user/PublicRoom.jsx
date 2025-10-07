import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import TQ from "../../img/svg/tq.svg";
import CreateRoomModal from "../../components/user/Meeting/CreateRoomModal";
import apiService from "../../services/apiService";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Star,
  Search,
  Plus,
  Video,
  Calendar,
} from "lucide-react";

const avatars = [
  "https://i.pravatar.cc/100?img=5",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1464306076886-debede1a7c94?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=100&h=100",
  "https://images.unsplash.com/photo-1464306076886-debede1a7c94?auto=format&fit=facearea&w=100&h=100",
];

export default function PublicRoom() {
  const [page, setPage] = useState(1);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [creatorNames, setCreatorNames] = useState({});
  const [participantCounts, setParticipantCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadMeetingRooms();
  }, []);

  const loadMeetingRooms = async () => {
    setLoading(true);
    try {
      const rooms = await apiService.getMeetingRooms();
      console.log("API Response:", rooms); // Debug log

      setMeetingRooms(rooms);
      console.log("Meeting Rooms:", meetingRooms);

      // Load creator names and participant counts for all rooms
      const names = {};
      const counts = {};
      await Promise.all(
        rooms.map(async (room) => {
          if (room?.id) {
            try {
              const username = await apiService.getUsernameFromMeetingRoom(
                room?.id
              );
              console.log(room?.id);
              console.log("Meeting Room User:", username);
              names[room.id] = username;

              // Load participant count
              const participantsResponse = await apiService.getRoomParticipants(
                room.id
              );
              counts[room.id] = participantsResponse?.data?.count || 0;
            } catch (error) {
              console.error(`Error loading data for room ${room.id}:`, error);
              names[room.id] = "Mentor GSS";
              counts[room.id] = 0;
            }
          }
        })
      );
      setCreatorNames(names);
      setParticipantCounts(counts);
    } catch (error) {
      console.error("Error loading rooms:", error);
      message.error("Lỗi khi tải danh sách phòng học");
      setMeetingRooms([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => {
    try {
      const authData = localStorage.getItem("authData");
      if (authData) {
        const userData = JSON.parse(authData);
        return {
          id: userData.user?.id || userData.id,
          username: userData.user?.username || userData.username,
          fullName: userData.user?.fullName || userData.fullName,
          token: userData.token,
        };
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
    return null;
  };

  const handleJoinMeetingRoom = (room) => {
    const currentUser = getCurrentUser();

    // Prefer backend-provided meeting link/code
    const meetingLink =
      room?.meetingroomdetails?.[0]?.meeting_link ||
      room?.meetingroomdetails?.meeting_link;

    // Not logged in -> inform user to login first, then refresh to load link
    if (!currentUser) {
      Modal.info({
        title: "Vui lòng đăng nhập",
        content:
          "Bạn cần đăng nhập để vào lớp. Sau khi đăng nhập, hãy F5 (refresh) trang này để link được tải lại, rồi thử tham gia lại.",
        onOk() {},
      });
      return;
    }

    // If backend didn't provide link yet
    if (!meetingLink) {
      message.error("Link phòng không tồn tại");
      return;
    }

    // If meetingLink is a full URL, redirect browser; otherwise navigate in-app using code
    if (
      typeof meetingLink === "string" &&
      /^(https?:)?\/\//.test(meetingLink)
    ) {
      window.location.href = meetingLink;
    } else {
      navigate(
        `/meeting/${
          room?.meetingroomdetails?.meeting_link ||
          room?.meetingroomdetails?.[0]?.meeting_link
        }`
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "#1890ff",
      ongoing: "#52c41a",
      completed: "#d9d9d9",
      canceled: "#ff4d4f",
    };
    return colors[status] || "#d9d9d9";
  };

  const getStatusText = (status) => {
    const texts = {
      scheduled: "Đã lên lịch",
      ongoing: "Đang diễn ra",
      completed: "Đã kết thúc",
      canceled: "Đã hủy",
    };
    return texts[status] || status;
  };

  const getJoinedCount = (room) => {
    const count = participantCounts[room.id] || 0;
    return `${count}/5`;
  };

  const isRoomFull = (room) => {
    const count = participantCounts[room.id] || 0;
    return count >= 5;
  };

  const getCreatorName = (room) => {
    return creatorNames[room.id] || "Mentor GSS";
  };

  const filteredMeetingRooms = Array.isArray(meetingRooms)
    ? meetingRooms.filter((room) =>
        room?.room_name?.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col  gap-6">
        <div className="flex justify-start gap-8 ml-20">
          {avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="avatar"
              className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover"
              style={{ background: "#fff" }}
            />
          ))}
        </div>
        {/* Header */}
        <div className="flex justify-between items-center gap-6">
          <h1 className="text-xl font-bold mt-3">
            Phòng Học <span className="text-orange-500">Miễn Phí</span>
          </h1>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white w-50 py-2 rounded-full font-semibold transition"
            >
              <Plus size={16} />
              Tạo Phòng
            </button>

            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                placeholder="Tìm kiếm phòng học..."
                className="w-full rounded-full px-12 py-2 shadow focus:outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <p className="text-xs italic text-black mt-1">
            Tổng cộng{" "}
            <span className="font-bold text-orange-500">
              {filteredMeetingRooms.length}
            </span>{" "}
            phòng học
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {loading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải phòng học...</p>
          </div>
        ) : filteredMeetingRooms.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <Video size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchText
                ? "Không tìm thấy phòng nào phù hợp"
                : "Chưa có phòng học nào"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchText
                ? "Thử tìm kiếm với từ khóa khác"
                : "Tạo phòng học đầu tiên để bắt đầu!"}
            </p>
            {!searchText && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition"
              >
                <Plus size={16} className="inline mr-2" />
                Tạo Phòng Mới
              </button>
            )}
          </div>
        ) : (
          filteredMeetingRooms.map((room) => {
            const joinedCount = getJoinedCount(room);
            const creatorName = getCreatorName(room);
            const roomFull = isRoomFull(room);

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              >
                <img
                  src={TQ}
                  alt={room.room_name}
                  className="w-full h-35 rounded-2xl"
                />
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{creatorName}</p>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: getStatusColor(room.status) }}
                    >
                      {getStatusText(room.status)}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold mb-1 ">
                    {room.room_name}
                  </h2>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>
                        {" "}
                        {new Date(room.start_time).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span
                        className={`font-semibold ${
                          roomFull ? "text-red-500" : ""
                        }`}
                      >
                        {joinedCount}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`self-center px-8 py-1.5 rounded-full font-semibold transition ${
                      room.status === "completed" ||
                      room.status === "canceled" ||
                      roomFull
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                    onClick={() => handleJoinMeetingRoom(room)}
                    disabled={
                      room.status === "completed" ||
                      room.status === "canceled" ||
                      roomFull
                    }
                  >
                    {room.status === "completed"
                      ? "Đã kết thúc"
                      : room.status === "canceled"
                      ? "Đã hủy"
                      : roomFull
                      ? "Phòng đầy"
                      : "Tham gia"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end items-center gap-15 mt-10">
        <button
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white px-4 py-3 rounded-full shadow transition"
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          className="flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white px-4 py-3 rounded-full shadow transition"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
      />
    </div>
  );
}
