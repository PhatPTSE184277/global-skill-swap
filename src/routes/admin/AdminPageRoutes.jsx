import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AdminAccountPage from "../../pages/admin/AccountPage/AdminAccountPage";

const AdminPageRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
       {
        path: "accounts",
        element: <AdminAccountPage />,
      }
    ],
  },
];

export default AdminPageRoutes;