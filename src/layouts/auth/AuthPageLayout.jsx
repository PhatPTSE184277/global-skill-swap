import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "../../components/client";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

const AuthPageLayout = () => {
  const user = useSelector(authSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      if (user.accountRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setChecked(true);
    }
  }, [user, navigate]);

  if (!checked) return null;

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </>
  );
};

export default AuthPageLayout;
