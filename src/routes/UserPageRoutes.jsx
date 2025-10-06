import UserPageLayout from "../layouts/user/UserPageLayout";
import UserDetail from "../pages/user/UserDetail";

const UserPageRoutes = [
  {
<<<<<<< Updated upstream
    path: "/user",
=======
    path: "/profile",
>>>>>>> Stashed changes
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
