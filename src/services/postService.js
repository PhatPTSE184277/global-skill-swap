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

export const createPost = async (postData, sharePostId) => {
    const config = sharePostId
        ? { params: { sharePostId } }
        : undefined;
    const response = await axiosClient.post("/forum-post", postData, config);
    return response?.data;
};

export const updatePost = async (postId, postData) => {
    const response = await axiosClient.put(`/forum-post/${postId}`, postData);
    return response?.data;
}

export const interactPost = async (forumPostId, typeInteraction = "LIKE") => {
    const response = await axiosClient.post(`/post-interaction/forum-post/${forumPostId}`, { typeInteraction });
    return response?.data;
};

export const getPostInteraction = async (interactionId) => {
    const response = await axiosClient.get(`/post-interaction/${interactionId}`);
    return response?.data;
};

export const deletePostInteraction = async (interactionId) => {
    const response = await axiosClient.delete(`/post-interaction/${interactionId}`);
    return response?.data;
};

export const checkPostLiked = async (postId) => {
    const response = await axiosClient.get(`/post-interaction/forum-post/${postId}/is-react`);
    return response?.data;
};

export const fetchTrendingPosts = async ({ page = 0, size = 10, sortBy = "id", sortDir = "desc" } = {}) => {
    const response = await axiosClient.get("/forum-post/trending-post", {
        params: { page, size, sortBy, sortDir }
    });
    return response?.data;
}