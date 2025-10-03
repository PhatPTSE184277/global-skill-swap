import { Outlet } from "react-router-dom";
import { Footer, Header } from "../../components/client";
import { Navbar } from "../../components/client";

const BlogPageLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default BlogPageLayout;
