
import { Header } from "../../components/client";
import { Footer } from "../../components/client";
import { Outlet } from "react-router-dom";

const ChatPageLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ChatPageLayout;