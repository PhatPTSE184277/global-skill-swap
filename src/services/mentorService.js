import axiosClient from "../apis/axiosClient";

export const fetchLanguages = async () => {
  const response = await axiosClient.get("/user/languages");
  return response?.data;
};

export const fetchMentors = async ({
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc",
  language
} = {}) => {
  const params = { page, size, sortBy, sortDir };
  if (language) params.language = language;
  const response = await axiosClient.get("/user/mentors", { params });
  return response?.data;
};