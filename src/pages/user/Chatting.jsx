// import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/user/Chat/SideBar";
// import ChatWindow from "../../components/user/Chat/ChatWindow";
// import InfoPanel from "../../components/user/Chat/InfoPanel";
// import MessageInput from "../../components/user/Chat/MessageInput";
// import useWebSocket from "../../hooks/useWebSocket";

// export default function Chatting() {
//   const [selected, setSelected] = useState(0);
//   const [messages, setMessages] = useState([]);
//   const { sendMessage, messages: wsMessages } = useWebSocket(
//     "ws://your-websocket-url"
//   );

//   useEffect(() => {
//     if (wsMessages.length > 0) {
//       setMessages((prevMessages) => [...prevMessages, ...wsMessages]);
//     }
//   }, [wsMessages]);

//   const handleSend = (text) => {
//     if (text.trim()) {
//       sendMessage(text);
//       setMessages((prevMessages) => [...prevMessages, { fromMe: true, text }]);
//     }
//   };

//   return (
//     <div className="chatting-container">
//       <Sidebar selected={selected} setSelected={setSelected} />
//       <ChatWindow messages={messages} />
//       <InfoPanel selected={selected} />
//       <MessageInput onSend={handleSend} />
//     </div>
//   );
// }
