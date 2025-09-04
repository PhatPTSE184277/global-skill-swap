import AuthPageLayout from '../layouts/auth/AuthPageLayout';
import { LoginPage, RegisterPage } from "../pages/auth";

const AuthRoutes = [
  {
    path: "/",
    element: <AuthPageLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />
      }
    ],
  },
];

export default AuthRoutes;