import BlogPageLayout from "../layouts/client/BlogPageLayout";
import MeetingPage from "../pages/user/MeetingPage";
import MeetingLobby from "../pages/user/MeetingLobby";
import PublicRoom from "../pages/user/PublicRoom";
import TestMeetingRoutes from "../components/TestMeetingRoutes";

const RoomPageRoutes = [
  {
    path: "/room",
    element: <BlogPageLayout />,
    children: [
      {
        path: "",
        element: <PublicRoom />,
      },
      {
        path: ":id",
        element: <MeetingPage />,
      },
    ],
  },
  // Meeting routes (standalone without layout)
  {
    path: "/meeting-lobby",
    element: <MeetingLobby />,
  },
  {
    path: "/meeting/:roomId",
    element: <MeetingPage />,
  },
  // Test route
  {
    path: "/test-meeting",
    element: <TestMeetingRoutes />,
  },
];

export default RoomPageRoutes;
