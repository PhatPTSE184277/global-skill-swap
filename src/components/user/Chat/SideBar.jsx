// import React from "react";

// const Sidebar = ({ conversations, selected, setSelected }) => {
//   return (
//     <div className="chatting-sidebar">
//       <div className="chatting-search">
//         <input placeholder="Tìm kiếm trên Messenger" />
//       </div>
//       <div className="chatting-list">
//         {conversations.map((conv, idx) => (
//           <div
//             key={conv.id}
//             className={`chatting-list-item ${selected === idx ? "active" : ""}`}
//             onClick={() => setSelected(idx)}
//           >
//             <img src={conv.avatar} alt={conv.name} className="avatar" />
//             <div>
//               <div className="name">{conv.name}</div>
//               <div className="last">{conv.lastActive}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
