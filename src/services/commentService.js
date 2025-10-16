import axiosClient from "../apis/axiosClient";

/**
 * Tạo bình luận mới hoặc trả lời bình luận
 * @param {Object} commentData { postId, content }
 * @param {number} [replyCommentId] id bình luận cần trả lời (nếu có)
 */
export const createComment = async (commentData, replyCommentId) => {
    const response = await axiosClient.post(
        "/comment",
        commentData,
        replyCommentId ? { params: { replyCommentId } } : undefined
    );
    return response?.data;
};

/**
 * Lấy danh sách bình luận của một bài viết
 * @param {Object} params { page, size, sortBy, sortDir }
 * @param {number} forumPostId id bài viết
 */
export const fetchCommentsByPost = async (
    { page = 0, size = 10, sortBy = "id", sortDir = "desc" } = {},
    forumPostId
) => {
    const response = await axiosClient.get(
        `/comment/forum-post/${forumPostId}`,
        {
            params: { page, size, sortBy, sortDir }
        }
    );
    return response?.data;
};

/**
 * Lấy danh sách reply của một bình luận cha
 * @param {Object} params { page, size, sortBy, sortDir }
 * @param {number} parentCommentId id bình luận cha
 */
export const fetchRepliesByParentComment = async (
    { page = 0, size = 10, sortBy = "id", sortDir = "desc" } = {},
    parentCommentId
) => {
    const response = await axiosClient.get(
        `/comment/parent/${parentCommentId}`,
        {
            params: { page, size, sortBy, sortDir }
        }
    );
    return response?.data;
};

/**
 * Sửa bình luận
 * @param {number} id id bình luận
 * @param {Object} commentData { postId, content }
 */
export const updateComment = async (id, commentData) => {
    const response = await axiosClient.put(`/comment/${id}`, commentData);
    return response?.data;
};