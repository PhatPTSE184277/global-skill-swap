import AdminLayout from "../../layouts/admin/AdminLayout";
import AdminDashboardPage from "../../pages/admin/DashboardPage/AdminDashboardPage";
import AdminAccountPage from "../../pages/admin/AccountPage/AdminAccountPage";
import AdminProtectedRoute from "./AdminProtectedRoute";
import { UserProvider } from "../../contexts/admin/UserContext";
import { MentorProvider } from "../../contexts/admin/MentorContext";
import AdminMentorPage from "../../pages/admin/MentorPage/AdminMentorPage";
import FeedbackManagementPage from "../../pages/admin/FeedbackPage/FeedbackManagementPage";
import AdminProductPage from "../../pages/admin/ProductPage/AdminProductPage";
import { ProductProvider } from "../../contexts/admin/ProductContext";
import { DashboardProvider } from "../../contexts/admin/DashboardContext";

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
        element: (
          <DashboardProvider>
            <AdminDashboardPage />
          </DashboardProvider>
        ),
      },
      {
        path: "accounts",
        element: (
          <UserProvider>
            <AdminAccountPage />
          </UserProvider>
        ),
      },
      {
        path: "mentorcv",
        element: (
          <MentorProvider>
            <AdminMentorPage />
          </MentorProvider>
        ),
      },
       {
        path: "products",
        element: (
          <ProductProvider>
            <AdminProductPage />
          </ProductProvider>
        ),
      },
      {
        path: "feedbacks",
        element: <FeedbackManagementPage />,
      },
    ],
  },
];

export default AdminPageRoutes;
