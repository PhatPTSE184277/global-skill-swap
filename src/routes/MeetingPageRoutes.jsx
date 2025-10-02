import { Navigate } from "react-router-dom";
import UserPageLayout from "../layouts/user/UserPageLayout";
import MeetingLobby from "../pages/user/MeetingLobby";
import MeetingPage from "../pages/user/MeetingPage";

const MeetingPageRoutes = [
  {
    path: "/",
    element: <UserPageLayout />,
    children: [
      {
        path: "/meeting-lobby",
        element: <MeetingLobby />,
      },
      {
        path: "/meeting/:roomId",
        element: <MeetingPage />,
      },
      // Redirect /meeting to /meeting-lobby
      {
        path: "/meeting",
        element: <Navigate to="/meeting-lobby" replace />,
      },
    ],
  },
];

export default MeetingPageRoutes;
