import BlogPageLayout from "../layouts/client/BlogPageLayout";
import PublicRoom from "../pages/user/PublicRoom";

const RoomPageRoutes = [
  {
    path: "/room",
    element: <BlogPageLayout />,
    children: [
      {
        path: "",
        element: <PublicRoom />,
      },
    ],
  },
];

export default RoomPageRoutes;
