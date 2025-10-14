import { useSelector } from "react-redux";
import { authSelector } from "../../reduxs/reducers/AuthReducer";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const user = useSelector(authSelector);

    if (!user.token || user.accountRole !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRoute;