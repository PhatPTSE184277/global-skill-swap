import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Space } from "antd";
import { Video, Home, Plus } from "lucide-react";

const TestMeetingRoutes = () => {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <Card
        title="🎥 Meeting System Test"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <h3>Test các routes meeting:</h3>

          <Button type="primary" size="large" icon={<Video size={16} />} block>
            <Link to="/meeting-lobby" style={{ color: "inherit" }}>
              Go to Meeting Lobby
            </Link>
          </Button>

          <Button type="default" size="large" icon={<Home size={16} />} block>
            <Link to="/meeting" style={{ color: "inherit" }}>
              Go to Public Room
            </Link>
          </Button>

          <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
            <p>Routes được test:</p>
            <ul style={{ textAlign: "left" }}>
              <li>/meeting-lobby - Trang chính tạo/join room</li>
              <li>/meeting/:roomId - Trang video call</li>
              <li>/room - Trang public room hiện tại</li>
            </ul>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TestMeetingRoutes;
