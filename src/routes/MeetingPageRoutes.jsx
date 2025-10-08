import MeetingPage from "../pages/user/MeetingPage";
import PublicRoom from "../pages/user/PublicRoom";
import BlogPageLayout from "../layouts/client/BlogPageLayout";

const MeetingPageRoutes = [
  {
    path: "/meeting",
    element: <BlogPageLayout />,
    children: [
      // {
      //   path: "/meeting-lobby",
      //   element: <MeetingLobby />,
      // },

      {
        path: "",
        element: <PublicRoom />,
      },
    ],
  },
  {
    path: "/meeting/:roomLink",
    element: <MeetingPage />,
  },
];

export default MeetingPageRoutes;
