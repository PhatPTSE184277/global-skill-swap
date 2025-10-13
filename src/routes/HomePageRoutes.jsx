import HomePageLayout from "../layouts/client/HomePageLayout ";
import { HomePage } from "../pages/client";
import PaymentCancel from "../pages/mentor/PaymentCancel";
import PaymentPage from "../pages/mentor/PaymentPage";
import PaymentSuccess from "../pages/mentor/PaymentSuccess";
import PaymentConfirm from "../pages/user/PaymentConfirm";

const HomePageRoutes = [
  {
    path: "/",
    element: <HomePageLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/paymentconfirmation",
        element: <PaymentConfirm />,
      },
      {
        path: "payment",
        element: <PaymentPage />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancel",
        element: <PaymentCancel />,
      },
    ],
  },
];

export default HomePageRoutes;
