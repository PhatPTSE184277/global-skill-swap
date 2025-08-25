
import { Header } from "../../components/client";
import { Footer } from "../../components/client";
import { Outlet } from "react-router-dom";

const HomePageLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default HomePageLayout;