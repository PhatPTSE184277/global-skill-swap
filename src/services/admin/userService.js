import axiosClient from "../../apis/axiosClient";

export const fetchAllUsers = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc",
  isActive,
} = {}) => {
  const params = { page, size, sortBy, sortDir };
  if (isActive !== undefined) params.isActive = isActive;
  const response = await axiosClient.get("/user", { params });
  return response?.data;
};