import { Outlet } from "react-router-dom";
import { Footer } from "../../components/client";
import Navbar from "../../components/client/Navbar";

const BlogPageLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default BlogPageLayout;
