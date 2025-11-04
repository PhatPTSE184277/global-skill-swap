import axiosClient from "../../apis/axiosClient";

export const fetchAllMentorCVs = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc",
  isActive,
  applicationStatus,
} = {}) => {
  const params = { page, size, sortBy, sortDir };
  if (isActive !== undefined) params.isActive = isActive;
  if (applicationStatus) params.applicationStatus = applicationStatus;
  const response = await axiosClient.get("/user/cv", { params });
  return response?.data;
};

export const approveMentorCVs = async (ids) => {
  const response = await axiosClient.put("/user/approvedCv", { id: ids });
  return response?.data;
};

export const rejectMentorCVs = async (ids) => {
  const response = await axiosClient.put("/user/rejectCv", { id: ids });
  return response?.data;
};
