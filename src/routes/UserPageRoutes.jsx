import UserPageLayout from "../layouts/user/UserPageLayout";
import UserDetail from "../pages/user/UserDetail";

const UserPageRoutes = [
  {
    path: "/user",
    element: <UserPageLayout />,
    children: [
      {
        path: ":id",
        element: <UserDetail />,
      },
    ],
  },
];

export default UserPageRoutes;
