import HomePageLayout from "../layouts/client/HomePageLayout ";
import { HomePage } from "../pages/client";
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
    ],
  },
];

export default HomePageRoutes;
