import axiosClient from "../../apis/axiosClient";

export const fetchDailyRevenue = async ({
  page = 0,
  size = 10,
} = {}) => {
  const params = { page, size };
  const response = await axiosClient.get("/dashboard/daily-revenue", { params });
  return response?.data;
};

export const fetchTransactionStatistics = async () => {
  const response = await axiosClient.get("/dashboard/transaction-statistics");
  return response?.data;
};

export const fetchProductPerformance = async ({
  page = 0,
  size = 10,
} = {}) => {
  const params = { page, size };
  const response = await axiosClient.get("/dashboard/product-performance", { params });
  return response?.data;
};

export const fetchUserCountByRole = async () => {
  const response = await axiosClient.get("/user/dashboard/user-count-by-role");
  return response?.data;
};