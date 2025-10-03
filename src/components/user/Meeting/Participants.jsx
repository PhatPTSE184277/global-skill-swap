import React, { useState, useEffect } from "react";
import { MicOff, VideoOff, Mic, Video, RefreshCw, User, Monitor } from "lucide-react";
import { Button, Avatar, Badge, List, Typography } from "antd";
import socketService from "../../../services/socketService";
import useAgora from "../../../hooks/useAgora";

const { Text } = Typography;

export default function Participants({ roomId, userName, userId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { remoteUsers, isJoined, isCameraOn, isMicOn, isScreenSharing } = useAgora();

  // Debug logging
  useEffect(() => {
    console.log('👥 Participants debug:', {
      isJoined,
      userName,
      userId,
      isCameraOn,
      isMicOn,
      participantCount: participants.length,
      remoteUserCount: remoteUsers.length
    });
  }, [isJoined, userName, userId, isCameraOn, isMicOn, participants.length, remoteUsers.length]);

  // Ensure participants list shows current user when joined
  useEffect(() => {
    if (isJoined) {
      console.log('👥 User joined - updating participants');
      // Force re-render by triggering state update
      setParticipants(prev => [...prev]);
    }
  }, [isJoined]);

  // Combine socket participants with Agora remote users
  useEffect(() => {
    if (!roomId) return;

    console.log('👥 Setting up participants listeners for room:', roomId);

    // Ensure socket is connected
    const socket = socketService.connect('http://localhost:3000');

    // Listen for participant updates from socket
    const handleRoomParticipants = (participantList) => {
      console.log('👥 Room participants update:', participantList);
      setParticipants(participantList);
    };

    const handleUserJoined = (user) => {
      console.log('👥 User joined:', user);
      setParticipants(prev => {
        const exists = prev.find(p => p.socketId === user.socketId);
        if (!exists) {
          return [...prev, user];
        }
        return prev;
      });
    };

    const handleUserLeft = (user) => {
      console.log('👥 User left:', user);
      setParticipants(prev => prev.filter(p => p.socketId !== user.socketId));
    };

    const handleMediaStatusUpdate = (data) => {
      console.log('👥 Media status update:', data);
      setParticipants(prev => prev.map(p => 
        p.socketId === data.socketId 
          ? { ...p, isCameraOn: data.isCameraOn, isMicOn: data.isMicOn }
          : p
      ));
    };

    const handleScreenSharingUpdate = (data) => {
      console.log('👥 Screen sharing update:', data);
      setParticipants(prev => prev.map(p => 
        p.socketId === data.socketId 
          ? { ...p, isScreenSharing: data.isScreenSharing }
          : p
      ));
    };

    // Set up socket listeners
    const unsubscribeParticipants = socketService.onRoomParticipants(handleRoomParticipants);
    const unsubscribeJoined = socketService.onUserJoined(handleUserJoined);
    const unsubscribeLeft = socketService.onUserLeft(handleUserLeft);
    const unsubscribeMedia = socketService.onMediaStatusUpdate(handleMediaStatusUpdate);
    const unsubscribeScreen = socketService.onScreenSharingUpdate(handleScreenSharingUpdate);

    return () => {
      unsubscribeParticipants();
      unsubscribeJoined();
      unsubscribeLeft();
      unsubscribeMedia();
      unsubscribeScreen();
    };
  }, [roomId]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      // This could trigger a refresh of participants from the server
      // For now, we rely on socket events for real-time updates
      console.log('👥 Refreshing participants...');
      
      // You could call an API endpoint here if needed
      // const response = await apiService.getRoomParticipants(roomId);
      // setParticipants(response);
      
    } catch (error) {
      console.error("❌ Error loading participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (userName) => {
    const colors = ['#f56565', '#48bb78', '#ed8936', '#4299e1', '#9f7aea', '#38b2ac'];
    const hash = userName?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    return colors[Math.abs(hash) % colors.length];
  };

  const isUserInAgoraCall = (participant) => {
    return remoteUsers.some(user => user.uid.toString() === participant.userId?.toString());
  };

  // Calculate total participants including self and remote users
  const allParticipants = [
    // Add self as first participant if joined
    ...(isJoined ? [{
      id: 'self',
      userName: userName || 'Bạn',
      userId: userId || 'self',
      socketId: 'self',
      isCameraOn: isCameraOn,
      isMicOn: isMicOn,
      isScreenSharing: isScreenSharing,
      joinedAt: new Date(),
      isSelf: true
    }] : []),
    // Add socket participants (other users who joined via socket)
    ...participants,
    // Add any remote Agora users not in socket participants
    ...remoteUsers.map(user => ({
      id: `agora_${user.uid}`,
      userName: `User ${user.uid}`,
      userId: user.uid.toString(),
      socketId: `agora_${user.uid}`,
      isCameraOn: !!user.videoTrack,
      isMicOn: !!user.audioTrack,
      isScreenSharing: false,
      joinedAt: new Date(),
      isAgoraOnly: true
    })).filter(agoraUser => 
      // Don't duplicate if already in socket participants
      !participants.find(p => p.userId === agoraUser.userId)
    )
  ];

  const totalParticipants = allParticipants.length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <User size={18} className="text-blue-500" />
          <Text strong>Người tham gia</Text>
          <Badge count={totalParticipants} showZero />
        </div>
        <Button
          type="text"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={loadParticipants}
          loading={loading}
          size="small"
        />
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        <List
          size="small"
          dataSource={allParticipants}
          renderItem={(participant) => (
            <List.Item className="px-3 py-2">
              <div className="flex items-center justify-between w-full">
                {/* User Info */}
                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative">
                    <Avatar
                      size="small"
                      style={{ 
                        backgroundColor: getAvatarColor(participant.userName)
                      }}
                      icon={<User size={12} />}
                    >
                      {participant.userName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    
                    {/* Online indicator */}
                    {(participant.isSelf || isUserInAgoraCall(participant)) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <Text className="text-sm font-medium truncate">
                        {participant.userName}
                        {participant.isSelf && ' (Bạn)'}
                      </Text>
                      {participant.isScreenSharing && (
                        <Monitor size={12} className="text-blue-500" />
                      )}
                    </div>
                    <Text type="secondary" className="text-xs">
                      {participant.isSelf 
                        ? 'Đang tham gia' 
                        : isUserInAgoraCall(participant)
                          ? 'Trong cuộc gọi'
                          : 'Đang chờ'
                      }
                    </Text>
                  </div>
                </div>

                {/* Media Status */}
                <div className="flex items-center space-x-1">
                  {/* Microphone Status */}
                  <div className={`p-1 rounded ${
                    participant.isMicOn 
                      ? 'text-green-500 bg-green-50' 
                      : 'text-red-500 bg-red-50'
                  }`}>
                    {participant.isMicOn ? (
                      <Mic size={12} />
                    ) : (
                      <MicOff size={12} />
                    )}
                  </div>

                  {/* Camera Status */}
                  <div className={`p-1 rounded ${
                    participant.isCameraOn 
                      ? 'text-green-500 bg-green-50' 
                      : 'text-red-500 bg-red-50'
                  }`}>
                    {participant.isCameraOn ? (
                      <Video size={12} />
                    ) : (
                      <VideoOff size={12} />
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <User size={32} className="mx-auto mb-2 text-gray-400" />
                <Text type="secondary">Chưa có người tham gia</Text>
              </div>
            )
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t bg-gray-50">
        <Text type="secondary" className="text-xs">
          {allParticipants.filter(p => p.isSelf || isUserInAgoraCall(p)).length} trong cuộc gọi video
        </Text>
      </div>
    </div>
  );
}