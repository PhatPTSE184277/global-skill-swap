import { PostProvider } from "../contexts/PostContext";
import UserDetail from "../pages/user/UserDetail";
import UserEditPage from "../pages/user/UserEditPage";
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
      {
        path: "edit",
        element: <UserEditPage />,
      },
    ],
  },
];

export default UserPageRoutes;