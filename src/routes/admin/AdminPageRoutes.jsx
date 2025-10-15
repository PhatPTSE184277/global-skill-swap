import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminDashboardPage from "../../pages/admin/AdminDashboardPage";
import AdminAccountPage from "../../pages/admin/AccountPage/AdminAccountPage";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { UserProvider } from "../../contexts/UserContext";

const AdminPageRoutes = [
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "accounts",
        element: <UserProvider><AdminAccountPage /></UserProvider>,
      }
    ],
  },
];

export default AdminPageRoutes;