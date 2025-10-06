import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "../../components/user/Header";
import Navbar from "../../components/client/Navbar";
<<<<<<< Updated upstream
const UserPageLayout = () => {
  return (
    <>
      <Navbar />
=======
import { Header } from "../../components/client";
const UserPageLayout = () => {
  return (
    <>
      <Header />
>>>>>>> Stashed changes
      <UserHeader />
      <main className="max-w-4xl mx-auto pt-10">
        <Outlet />
      </main>
    </>
  );
};

export default UserPageLayout;
