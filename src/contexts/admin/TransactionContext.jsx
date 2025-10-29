import { createContext, useState, useCallback } from "react";
import { fetchTotalTransactions } from "../../services/admin/transactionService";

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchTransactions = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetchTotalTransactions(params);
            const data = response.data || {};
            console.log("Fetched Transactions Data:", data);

            setTransactions(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        transactions,
        loading,
        fetchTransactions,
        totalPages,
        totalElements,
    };

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );  
};

export default TransactionContext;