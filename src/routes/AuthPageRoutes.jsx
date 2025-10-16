import AuthPageLayout from "../layouts/auth/AuthPageLayout";
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyOtpPage,
  ResetPasswordPage,
} from "../pages/auth";

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
        element: <RegisterPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
      {
        path: "/verify-otp/:token",
        element: <VerifyOtpPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
    ],
  },
];

export default AuthRoutes;
