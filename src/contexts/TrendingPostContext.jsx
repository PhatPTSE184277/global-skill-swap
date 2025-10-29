import { createContext, useState, useCallback } from "react";
import { 
  fetchTrendingPosts, 
  interactPost, 
  checkPostLiked,
  deletePostInteraction 
} from "../services/postService";
import {
  fetchCommentsByForumPost,
  fetchRepliesByParentComment,
  createComment,
  updateComment,
} from "../services/commentService";

const TrendingPostContext = createContext();

export const TrendingPostProvider = ({ children }) => {
  // Post states
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Like states
  const [likedMap, setLikedMap] = useState({});
  const [loadingLikeMap, setLoadingLikeMap] = useState({});
  
  // Comment states
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  // Fetch trending posts
  const getTrendingPosts = useCallback(async ({ page = 0, size = 10, sortBy = "id", sortDir = "desc" } = {}) => {
    setLoading(true);
    try {
      const res = await fetchTrendingPosts({ page, size, sortBy, sortDir });
      setTrendingPosts(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
      setTotalElements(res?.data?.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching trending posts:", err);
      setTrendingPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if post is liked
  const checkLiked = useCallback(async (postId) => {
    setLoadingLikeMap((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await checkPostLiked(postId);
      setLikedMap((prev) => ({ ...prev, [postId]: res?.data === true }));
    } catch {
      setLikedMap((prev) => ({ ...prev, [postId]: false }));
    } finally {
      setLoadingLikeMap((prev) => ({ ...prev, [postId]: false }));
    }
  }, []);

  // Like post
  const likePost = useCallback(async (postId) => {
    setLoadingLikeMap((prev) => ({ ...prev, [postId]: true }));
    try {
      await interactPost(postId, "LIKE");
      setLikedMap((prev) => ({ ...prev, [postId]: true }));
      
      // Update like count in trending posts
      setTrendingPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likeCount: (post.likeCount || 0) + 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLoadingLikeMap((prev) => ({ ...prev, [postId]: false }));
    }
  }, []);

  // Unlike post
  const unlikePost = useCallback(async (postId) => {
    setLoadingLikeMap((prev) => ({ ...prev, [postId]: true }));
    try {
      const likeData = likedMap[postId];
      if (likeData?.interactionId) {
        await deletePostInteraction(likeData.interactionId);
      }
      setLikedMap((prev) => ({ ...prev, [postId]: false }));
      
      // Update like count in trending posts
      setTrendingPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, likeCount: Math.max((post.likeCount || 0) - 1, 0) }
            : post
        )
      );
    } catch (err) {
      console.error("Error unliking post:", err);
    } finally {
      setLoadingLikeMap((prev) => ({ ...prev, [postId]: false }));
    }
  }, [likedMap]);

  // Get comments by post
  const getCommentsByPost = useCallback(async ({ forumPostId, page = 0, size = 10 }) => {
    setLoadingComments((prev) => ({ ...prev, [forumPostId]: true }));
    try {
      const res = await fetchCommentsByForumPost({ forumPostId, page, size });
      setComments((prev) => ({
        ...prev,
        [forumPostId]: {
          content: res?.data?.content || [],
          totalElements: res?.data?.totalElements || 0,
          totalPages: res?.data?.totalPages || 1,
          currentPage: page,
        },
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments((prev) => ({
        ...prev,
        [forumPostId]: {
          content: [],
          totalElements: 0,
          totalPages: 1,
          currentPage: 0,
        },
      }));
    } finally {
      setLoadingComments((prev) => ({ ...prev, [forumPostId]: false }));
    }
  }, []);

  // Get replies by comment
  const getRepliesByComment = useCallback(async ({ parentCommentId, page = 0, size = 10 }) => {
    try {
      const res = await fetchRepliesByParentComment({ parentCommentId, page, size });
      setReplies((prev) => ({
        ...prev,
        [parentCommentId]: {
          content: res?.data?.content || [],
          totalElements: res?.data?.totalElements || 0,
          totalPages: res?.data?.totalPages || 1,
          currentPage: page,
        },
      }));
    } catch (err) {
      console.error("Error fetching replies:", err);
      setReplies((prev) => ({
        ...prev,
        [parentCommentId]: {
          content: [],
          totalElements: 0,
          totalPages: 1,
          currentPage: 0,
        },
      }));
    }
  }, []);

  // Add comment
  const addComment = useCallback(async ({ postId, content, replyCommentId }) => {
    try {
      const res = await createComment({ postId, content, replyCommentId });
      
      // Update comment count in trending posts
      setTrendingPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
      
      return res;
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err;
    }
  }, []);

  // Edit comment
  const editComment = useCallback(async ({ commentId, content }) => {
    try {
      const res = await updateComment({ commentId, content });
      
      // Update comment in state
      setComments((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((postId) => {
          if (updated[postId]?.content) {
            updated[postId] = {
              ...updated[postId],
              content: updated[postId].content.map((comment) =>
                comment.id === commentId
                  ? { ...comment, content, updatedAt: new Date().toISOString() }
                  : comment
              ),
            };
          }
        });
        return updated;
      });
      
      // Update reply in state
      setReplies((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((parentId) => {
          if (updated[parentId]?.content) {
            updated[parentId] = {
              ...updated[parentId],
              content: updated[parentId].content.map((reply) =>
                reply.id === commentId
                  ? { ...reply, content, updatedAt: new Date().toISOString() }
                  : reply
              ),
            };
          }
        });
        return updated;
      });
      
      return res;
    } catch (err) {
      console.error("Error editing comment:", err);
      throw err;
    }
  }, []);

  const value = {
    // Post data
    trendingPosts,
    loading,
    totalPages,
    totalElements,
    currentPage,
    getTrendingPosts,
    
    // Like data
    likedMap,
    loadingLikeMap,
    checkLiked,
    likePost,
    unlikePost,
    
    // Comment data
    comments,
    replies,
    loadingComments,
    getCommentsByPost,
    getRepliesByComment,
    addComment,
    editComment,
  };

  return (
    <TrendingPostContext.Provider value={value}>
      {children}
    </TrendingPostContext.Provider>
  );
};

export default TrendingPostContext;