import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      setIsConnected(true);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      socketRef.current.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (isConnected) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, sendMessage, isConnected };
};

export default useWebSocket;