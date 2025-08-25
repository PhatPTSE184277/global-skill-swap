import { Outlet } from "react-router-dom";
import { Header } from "../../components/client";


const LoginPageLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default LoginPageLayout;