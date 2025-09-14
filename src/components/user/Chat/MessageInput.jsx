// import React, { useState } from "react";

// export default function MessageInput({ onSend }) {
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (input.trim()) {
//       onSend(input);
//       setInput("");
//     }
//   };

//   return (
//     <div className="message-input">
//       <input
//         value={input}
//         onChange={e => setInput(e.target.value)}
//         placeholder="Type a message..."
//         onKeyDown={e => e.key === "Enter" && handleSend()}
//       />
//       <button onClick={handleSend}>Send</button>
//     </div>
//   );
// }