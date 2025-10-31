import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/client";

const UserPageLayout = () => {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto pt-10">
        <Outlet />
      </main>
    </>
  );
};

export default UserPageLayout;
