import React from "react";
import { Camera, CameraOff, Monitor, MonitorOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button, Tooltip } from "antd";
import useAgora from "../../../hooks/useAgora";

export default function MeetingControls({ 
  onLeave, 
  isLeaving,
  isCameraOn,
  isMicOn,
  isScreenSharing,
  remoteScreenUser,
  toggleCamera,
  toggleMicrophone,
  toggleScreenShare
}) {
  // Debug states
  console.log('🎮 MeetingControls states:', {
    isCameraOn,
    isMicOn,
    isScreenSharing,
    hasToggleCamera: !!toggleCamera,
    hasToggleMic: !!toggleMicrophone
  });

  // Handle camera toggle with debug
  const handleCameraToggle = () => {
    console.log('📹 Camera button clicked, current state:', isCameraOn);
    if (toggleCamera) {
      toggleCamera();
    } else {
      console.error('❌ toggleCamera function not available');
    }
  };

  // Handle mic toggle with debug
  const handleMicToggle = () => {
    console.log('🎤 Mic button clicked, current state:', isMicOn);
    if (toggleMicrophone) {
      toggleMicrophone();
    } else {
      console.error('❌ toggleMicrophone function not available');
    }
  };

  // Disable screen share button if someone else is sharing (like NEW project)
  const canShareScreen = !remoteScreenUser || isScreenSharing;

  return (
    <div className="flex justify-center gap-4 py-4 bg-white border-t">
      <Tooltip title={isCameraOn ? "Tắt camera" : "Bật camera"}>
        <Button
          type={isCameraOn ? "primary" : "default"}
          danger={!isCameraOn}
          shape="circle"
          size="large"
          icon={isCameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
          onClick={handleCameraToggle}
        />
      </Tooltip>

      <Tooltip title={isMicOn ? "Tắt mic" : "Bật mic"}>
        <Button
          type={isMicOn ? "primary" : "default"}
          danger={!isMicOn}
          shape="circle"
          size="large"
          icon={isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          onClick={handleMicToggle}
        />
      </Tooltip>

      <Tooltip title={
        !canShareScreen && remoteScreenUser 
          ? `User ${remoteScreenUser.uid} đang chia sẻ màn hình`
          : isScreenSharing 
          ? "Dừng chia sẻ màn hình" 
          : "Chia sẻ màn hình"
      }>
        <Button
          type={isScreenSharing ? "primary" : "default"}
          shape="circle"
          size="large"
          disabled={!canShareScreen} // NEW: Disable if someone else is sharing
          icon={isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          onClick={toggleScreenShare}
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
    </div>
  );
}
