import BlogPageLayout from "../layouts/client/BlogPageLayout";
import BlogDetail from "../pages/client/Blog/BlogDetail";
import BlogHome from "../pages/client/Blog/BlogHome";
import BlogList from "../pages/client/Blog/BlogList";
import UserDetail from "../pages/user/UserDetail";

const BlogPageRoutes = [
  {
    path: "/blog",
    element: <BlogPageLayout />,
    children: [
      {
        path: "",
        element: <BlogHome />,
      },
      {
        path: "more",
        element: <BlogList />,
      },
      {
        path: ":id",
        element: <BlogDetail />,
      },
    ],
  },
];

export default BlogPageRoutes;
