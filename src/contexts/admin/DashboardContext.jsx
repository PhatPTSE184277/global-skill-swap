import { createContext, useState, useCallback } from "react";
import { 
  fetchDailyRevenue, 
  fetchTransactionStatistics, 
  fetchProductPerformance,
  fetchUserCountByRole
} from "../../services/admin/dashboardService";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [transactionStats, setTransactionStats] = useState(null);
  const [productPerformance, setProductPerformance] = useState([]);
  const [userCountByRole, setUserCountByRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const getDailyRevenue = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetchDailyRevenue(params);
      const data = response.data || {};
      setDailyRevenue(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTransactionStatistics();
      setTransactionStats(response.data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductPerformance = useCallback(async (params) => {
    setLoading(true);
    try {
      const response = await fetchProductPerformance(params);
      const data = response.data || {};
      setProductPerformance(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserCountByRole = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchUserCountByRole();
      setUserCountByRole(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    dailyRevenue,
    transactionStats,
    productPerformance,
    userCountByRole,
    loading,
    totalPages,
    totalElements,
    getDailyRevenue,
    getTransactionStatistics,
    getProductPerformance,
    getUserCountByRole,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;