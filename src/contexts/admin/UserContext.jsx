import { createContext, useState, useCallback } from "react";
import { fetchAllUsers, deleteUserById, restoreUserById } from "../../services/admin/userService";

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
            const data = response.data || {};
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (userId) => {
        setLoading(true);
        try {
            await deleteUserById(userId);
            await fetchUsers();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const restoreUser = useCallback(async (userId) => {
        setLoading(true);
        try {
            await restoreUserById(userId);
            await fetchUsers();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const value = {
        users,
        loading,
        fetchUsers,
        deleteUser,
        restoreUser,
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