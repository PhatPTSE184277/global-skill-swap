import React from "react";

const AdminFooter = () => {
  return (
    <footer className="bg-white text-center py-5 shadow-md w-full border-l border-gray-200">
      <div className="text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Global Skill. All rights reserved.
      </div>
    </footer>
  );
};

export default AdminFooter;