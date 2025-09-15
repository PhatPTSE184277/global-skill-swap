import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AdminAccountPage from "../../pages/admin/AdminAccountPage";

const AdminPageRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboardPage />,
      },
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