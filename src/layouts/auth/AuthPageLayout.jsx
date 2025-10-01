import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/client";
import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import { useEffect, useState } from "react";

const AuthPageLayout = () => {
    const user = useSelector(authSelector);
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (user && user.token) {
            navigate("/");
        } else {
            setChecked(true);
        }
    }, [user, navigate]);

    if (!checked) return null;

    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default AuthPageLayout;