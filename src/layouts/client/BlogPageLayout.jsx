import { Outlet } from "react-router-dom";
<<<<<<< Updated upstream
import { Footer } from "../../components/client";
=======
import { Footer, Header } from "../../components/client";
>>>>>>> Stashed changes
import { Navbar } from "../../components/client";

const BlogPageLayout = () => {
  return (
    <>
<<<<<<< Updated upstream
      <Navbar />
=======
      <Header />
>>>>>>> Stashed changes
      <Outlet />
      <Footer />
    </>
  );
};

export default BlogPageLayout;
