import axiosClient from "../../apis/axiosClient";

export const fetchTotalInvoices = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc",
} = {}) => {
  const params = { page, size, sortBy, sortDir };
  const response = await axiosClient.get("/dashboard/total-invoice", { params });
  return response?.data;
};