import { createContext, useState, useCallback } from "react";
import { fetchTotalInvoices } from "../../services/admin/invoiceService";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const fetchInvoices = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetchTotalInvoices(params);
            const data = response.data || {};
            console.log("Fetched Invoices Data:", data);

            setInvoices(data.content || []);
            setTotalPages(data.totalPages || 1);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        invoices,
        loading,
        fetchInvoices,
        totalPages,
        totalElements,
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
};

export default InvoiceContext;