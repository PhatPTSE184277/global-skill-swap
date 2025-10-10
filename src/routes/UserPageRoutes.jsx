import { PostProvider } from "../contexts/PostContext";
import UserDetail from "../pages/user/UserDetail";
import UserPageLayout from "../layouts/user/UserPageLayout";

const UserPageRoutes = [
  {
    path: "/profile",
    element: <UserPageLayout />,
    children: [
      {
        path: "",
        element: (
          <PostProvider>
            <UserDetail />
          </PostProvider>
        ),
      },
    ],
  },
];

export default UserPageRoutes;