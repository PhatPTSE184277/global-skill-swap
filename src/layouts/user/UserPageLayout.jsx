import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../../components/user/Header";
import Navbar from "../../components/client/Navbar";
const UserPageLayout = () => {
  return (
    <>
      <Navbar />
      <UserHeader />
      <main className="max-w-4xl mx-auto py-10">
        <Outlet />
      </main>
    </>
  );
};

export default UserPageLayout;
