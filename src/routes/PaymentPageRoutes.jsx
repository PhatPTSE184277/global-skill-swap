import PaymentPage from "../pages/PaymentPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";

const PaymentPageRoutes = [
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment-cancel",
    element: <PaymentCancel />,
  },
];

export default PaymentPageRoutes;
