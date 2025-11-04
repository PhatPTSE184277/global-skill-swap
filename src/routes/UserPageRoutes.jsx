import { PostProvider } from "../contexts/PostContext";
import UserDetail from "../pages/user/UserDetail";
import UserEditPage from "../pages/user/UserEditPage";
import UserPageLayout from "../layouts/user/UserPageLayout";
import { CommentProvider } from "../contexts/CommentContext";

const UserPageRoutes = [
  {
    path: "/profile",
    element: <UserPageLayout />,
    children: [
      {
        path: ":id",
        element: (
          <PostProvider>
            <CommentProvider>
              <UserDetail />
            </CommentProvider>
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