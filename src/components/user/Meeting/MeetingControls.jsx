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
  Users,
  Info,
} from "lucide-react";

export default function MeetingControls({
  onLeave,
  isLeaving,
  isCameraOn,
  isMicOn,
  isScreenSharing,
  remoteScreenUser,
  toggleCamera,
  toggleMicrophone,
  toggleScreenShare,
  showChat,
  showParticipants,
  showRoomInfo,
  onToggleChat,
  onToggleParticipants,
  onToggleRoomInfo,
}) {
  const handleCameraToggle = async () => {
    try {
      await toggleCamera();
    } catch (error) {
      console.error("Error toggling camera:", error);
    }
  };

  const handleMicToggle = async () => {
    try {
      await toggleMicrophone();
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };

  // Disable screen share button if someone else is sharing
  const canShareScreen = !remoteScreenUser || isScreenSharing;

  const ControlButton = ({
    icon,
    active = false,
    danger = false,
    disabled = false,
    onClick,
    title,
    loading = false,
  }) => (
    <button
      className={`
        relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 
        ${
          disabled
            ? "bg-gray-600 cursor-not-allowed opacity-50"
            : active && !danger
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : danger
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-700 text-white hover:bg-gray-600"
        }
        ${loading ? "animate-pulse" : ""}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-gray-800 bg-opacity-90 rounded-full backdrop-blur-md">
      {/* Camera Control */}
      <ControlButton
        icon={isCameraOn ? <Camera size={20} /> : <CameraOff size={20} />}
        active={isCameraOn}
        danger={!isCameraOn}
        onClick={handleCameraToggle}
        title={isCameraOn ? "Tắt camera" : "Bật camera"}
      />

      {/* Microphone Control */}
      <ControlButton
        icon={isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        active={isMicOn}
        danger={!isMicOn}
        onClick={handleMicToggle}
        title={isMicOn ? "Tắt mic" : "Bật mic"}
      />

      {/* Screen Share Control */}
      <ControlButton
        icon={
          isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />
        }
        active={isScreenSharing}
        disabled={!canShareScreen}
        onClick={toggleScreenShare}
        title={isScreenSharing ? "Dừng chia sẻ màn hình" : "Chia sẻ màn hình"}
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600"></div>

      {/* Chat Toggle */}
      <ControlButton
        icon={<MessageSquare size={20} />}
        active={showChat}
        onClick={onToggleChat}
        title="Chat"
      />

      {/* Participants Toggle */}
      <ControlButton
        icon={<Users size={20} />}
        active={showParticipants}
        onClick={onToggleParticipants}
        title="Người tham gia"
      />

      {/* Room Info Toggle */}
      <ControlButton
        icon={<Info size={20} />}
        active={showRoomInfo}
        onClick={onToggleRoomInfo}
        title="Thông tin phòng"
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-600"></div>

      {/* Leave Meeting */}
      <ControlButton
        icon={<PhoneOff size={20} />}
        danger={true}
        onClick={onLeave}
        loading={isLeaving}
        title="Rời khỏi cuộc họp"
      />
    </div>
  );
}
