import React from "react";
import {
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Button, Tooltip } from "antd";
import useAgora from "../../../hooks/useAgora";

export default function MeetingControls({ onLeave, isLeaving }) {
  const {
    isCameraOn,
    isMicOn,
    isScreenSharing,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
  } = useAgora();

  const handleToggleCamera = async () => {
    try {
      await toggleCamera();
    } catch (error) {
      console.error("Error toggling camera:", error);
    }
  };

  const handleToggleMic = async () => {
    try {
      await toggleMicrophone();
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      await toggleScreenShare();
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  return (
    <div className="flex justify-center gap-4 py-4 bg-white border-t">
      <Tooltip title={isCameraOn ? "Tắt camera" : "Bật camera"}>
        <Button
          type={isCameraOn ? "primary" : "default"}
          danger={!isCameraOn}
          shape="circle"
          size="large"
          icon={
            isCameraOn ? (
              <Camera className="w-5 h-5" />
            ) : (
              <CameraOff className="w-5 h-5" />
            )
          }
          onClick={handleToggleCamera}
        />
      </Tooltip>

      <Tooltip title={isMicOn ? "Tắt mic" : "Bật mic"}>
        <Button
          type={isMicOn ? "primary" : "default"}
          danger={!isMicOn}
          shape="circle"
          size="large"
          icon={
            isMicOn ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )
          }
          onClick={handleToggleMic}
        />
      </Tooltip>

      <Tooltip
        title={isScreenSharing ? "Dừng chia sẻ màn hình" : "Chia sẻ màn hình"}
      >
        <Button
          type={isScreenSharing ? "primary" : "default"}
          shape="circle"
          size="large"
          icon={
            isScreenSharing ? (
              <MonitorOff className="w-5 h-5" />
            ) : (
              <Monitor className="w-5 h-5" />
            )
          }
          onClick={handleToggleScreenShare}
        />
      </Tooltip>

      <Tooltip title="Rời khỏi cuộc họp">
        <Button
          type="primary"
          danger
          shape="circle"
          size="large"
          icon={<PhoneOff className="w-5 h-5" />}
          onClick={onLeave}
          loading={isLeaving}
        />
      </Tooltip>

      <Tooltip title="Chat">
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<MessageSquare className="w-5 h-5" />}
          onClick={() => {
            // TODO: Toggle chat panel
            console.log("Chat toggle not implemented yet");
          }}
        />
      </Tooltip>

      <Tooltip title="Thêm">
        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<MoreHorizontal className="w-5 h-5" />}
          onClick={() => {
            // TODO: Show more options
            console.log("More options not implemented yet");
          }}
        />
      </Tooltip>
    </div>
  );
}
