import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAuth, removeAuth } from "../reduxs/reducers/AuthReducer";
import userService from "../services/userService";

const useAuthInit = () => {
    const dispatch = useDispatch();
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const authRaw = localStorage.getItem("authData");
            if (!authRaw) {
                dispatch(removeAuth());
                setLoadingUser(false);
                return;
            }
            let authData;
            try {
                authData = JSON.parse(authRaw);
            } catch {
                dispatch(removeAuth());
                setLoadingUser(false);
                return;
            }
            const token = authData?.token;
            if (token) {
                try {
                    const userRes = await userService.getCurrentUser();
                    if (userRes?.success && userRes?.data) {
                        dispatch(addAuth({ user: userRes.data, token }));
                    } else {
                        dispatch(removeAuth());
                    }
                } catch {
                    dispatch(removeAuth());
                }
            } else {
                dispatch(removeAuth());
            }
            setLoadingUser(false);
        };
        fetchUser();
    }, [dispatch]);

    return loadingUser;
};

export default useAuthInit;