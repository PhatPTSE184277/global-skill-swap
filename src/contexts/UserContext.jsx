import { createContext, useState, useCallback } from "react";
import { fetchAllUsers } from "../services/admin/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchUsers = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetchAllUsers(params);
            setUsers(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalElements(response.data.totalElements || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        users,
        loading,
        fetchUsers,
        totalPages,
        totalElements,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;