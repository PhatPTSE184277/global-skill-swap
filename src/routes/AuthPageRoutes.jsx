import AuthPageLayout from '../layouts/auth/AuthPageLayout';
import { LoginPage } from "../pages/auth";

const AuthRoutes = [
  {
    path: "/",
    element: <AuthPageLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      }
    ],
  },
];

export default AuthRoutes;