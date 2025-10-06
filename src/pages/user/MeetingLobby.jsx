import React, { useState, useEffect } from "react";
import { Button, Card, List, message, Space, Tag, Input } from "antd";
import { Plus, Video, User, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../../components/user/Meeting/CreateRoomModal";
import apiService from "../../services/apiService";

const MeetingLobby = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMeetingRooms();
      setRooms(response || []);
    } catch (error) {
      console.error("Error loading rooms:", error);
      message.error("Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = (roomData) => {
    setRooms((prev) => [roomData, ...prev]);
    setShowCreateModal(false);

    // Auto navigate to the created room
    setTimeout(() => {
      navigate(
        `/meeting/${roomData.id}?userName=${encodeURIComponent(
          roomData.userName
        )}`
      );
    }, 1000);
  };

  const joinRoom = (room) => {
    const userName = prompt("Nhập tên của bạn:");
    if (userName) {
      navigate(`/meeting/${room.id}?userName=${encodeURIComponent(userName)}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "blue",
      ongoing: "green",
      completed: "default",
      canceled: "red",
    };
    return colors[status] || "default";
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

  const filteredRooms = rooms.filter((room) =>
    room.room_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          🎥 Meeting Rooms
        </h1>
        <p style={{ color: "#666", fontSize: "16px" }}>
          Tạo phòng meeting mới hoặc tham gia phòng đã có
        </p>
      </div>

      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          size="large"
          icon={<Plus size={16} />}
          onClick={() => setShowCreateModal(true)}
        >
          Tạo Phòng Mới
        </Button>

        <Input
          placeholder="Tìm kiếm phòng..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
          size="large"
        />

        <Button
          icon={<Search size={16} />}
          onClick={loadRooms}
          loading={loading}
          size="large"
        >
          Refresh
        </Button>
      </div>

      <Card
        title={`📋 Danh sách phòng (${filteredRooms.length})`}
        loading={loading}
      >
        <List
          dataSource={filteredRooms}
          renderItem={(room) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  icon={<Video size={16} />}
                  onClick={() => joinRoom(room)}
                  disabled={
                    room.status === "completed" || room.status === "canceled"
                  }
                >
                  Tham gia
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{room.room_name}</span>
                    <Tag color={getStatusColor(room.status)}>
                      {getStatusText(room.status)}
                    </Tag>
                  </div>
                }
                description={
                  <Space direction="vertical" size={4}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Calendar size={16} style={{ color: "#666" }} />
                      <span>
                        Tạo lúc:{" "}
                        {new Date(room.start_time).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    {room.actual_start_time && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Video size={16} style={{ color: "#666" }} />
                        <span>
                          Bắt đầu:{" "}
                          {new Date(room.actual_start_time).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <User size={16} style={{ color: "#666" }} />
                      <span>Room ID: {room.id}</span>
                    </div>
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: searchText
              ? "Không tìm thấy phòng nào phù hợp"
              : "Chưa có phòng nào. Tạo phòng đầu tiên!",
          }}
        />
      </Card>

      <CreateRoomModal
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
};

export default MeetingLobby;
