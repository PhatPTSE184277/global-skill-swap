import axiosClient from "../apis/axiosClient";

export const fetchPostsByUser = async ({ page = 0, size = 10, sortBy = "createdAt", sortDir = "desc" } = {}) => {
    const response = await axiosClient.get("/forum-post/user", {
        params: { page, size, sortBy, sortDir }
    });
    return response?.data;
};

export const fetchPostById = async (postId) => {
    const response = await axiosClient.get(`/forum-post/${postId}`);
    return response?.data;
}

export const createPost = async (postData) => {
    const response = await axiosClient.post("/forum-post", postData);
    return response?.data;
};

export const updatePost = async (postId, postData) => {
    const response = await axiosClient.put(`/forum-post/${postId}`, postData);
    return response?.data;
}