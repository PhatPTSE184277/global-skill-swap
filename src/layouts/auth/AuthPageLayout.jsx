import { Outlet } from "react-router-dom";
import { Header } from "../../components/client";

const AuthPageLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default AuthPageLayout;