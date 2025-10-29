import axiosClient from "../apis/axiosClient";

export const fetchCommentsByForumPost = async ({
  forumPostId,
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc"
}) => {
  const response = await axiosClient.get(`/comment/parent-comment/forum-post/${forumPostId}`, {
    params: { page, size, sortBy, sortDir }
  });
  return response?.data;
};

export const fetchRepliesByParentComment = async ({
  parentCommentId,
  page = 0,
  size = 10,
  sortBy = "id",
  sortDir = "desc"
}) => {
  const response = await axiosClient.get(`/comment/reply/parent-comment/${parentCommentId}`, {
    params: { page, size, sortBy, sortDir }
  });
  return response?.data;
};

export const fetchCommentById = async (commentId) => {
  const response = await axiosClient.get(`/comment/${commentId}`);
  return response?.data;
}

export const createComment = async ({ postId, content, replyCommentId }) => {
  const params = {};
  if (replyCommentId) params.replyCommentId = replyCommentId;
  const response = await axiosClient.post(
    `/comment/forum-post/${postId}`,
    { content },
    { params }
  );
  return response?.data;
};

export const updateComment = async ({ commentId, content }) => {
  const response = await axiosClient.put(
    `/comment/${commentId}`,
    { content }
  );
  return response?.data;
};