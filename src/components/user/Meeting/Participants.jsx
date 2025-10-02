import React, { useState, useEffect, useCallback } from "react";
import { MicOff, VideoOff, Mic, Video, RefreshCw } from "lucide-react";
import { Button, Avatar, Badge } from "antd";
import apiService from "../../../services/apiService";

export default function Participants({ roomId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadParticipants = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    try {
      const response = await apiService.getRoomParticipants(roomId);
      const members = response.data?.members || [];
      setParticipants(members);
    } catch (error) {
      console.error("Error loading participants:", error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      loadParticipants();

      // Auto refresh every 10 seconds
      const interval = setInterval(loadParticipants, 10000);
      return () => clearInterval(interval);
    }
  }, [roomId, loadParticipants]);

  const getAvatarUrl = (uid) => {
    return `https://i.pravatar.cc/40?u=${uid}`;
  };

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Participants ({participants.length})</h3>
        <Button
          type="text"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={loadParticipants}
          loading={loading}
          size="small"
        />
      </div>

      <ul className="space-y-3">
        {participants.map((participant) => (
          <li
            key={participant.uid}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Badge
                dot
                status={participant.isActive ? "success" : "default"}
                offset={[-2, 2]}
              >
                <Avatar src={getAvatarUrl(participant.uid)} size={32} />
              </Badge>
              <div>
                <span className="text-sm font-medium">
                  {participant.displayName || `User ${participant.uid}`}
                </span>
                <div className="text-xs text-gray-500">
                  {participant.isActive ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            <div className="flex gap-2 text-gray-500">
              {participant.isActive ? (
                <>
                  <Mic className="w-4 h-4 text-green-500" />
                  <Video className="w-4 h-4 text-green-500" />
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4" />
                  <VideoOff className="w-4 h-4" />
                </>
              )}
            </div>
          </li>
        ))}

        {participants.length === 0 && !loading && (
          <li className="text-center text-gray-500 py-4">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-sm">Chưa có người tham gia</p>
          </li>
        )}

        {loading && (
          <li className="text-center text-gray-500 py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm">Đang tải...</p>
          </li>
        )}
      </ul>
    </div>
  );
}
