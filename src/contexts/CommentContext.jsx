import { createContext, useState, useCallback } from "react";
import {
  fetchCommentsByForumPost,
  fetchRepliesByParentComment,
  createComment,
  updateComment,
} from "../services/commentService";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getCommentsByPost = useCallback(async ({ forumPostId, page = 0, size = 10 }) => {
    setLoading(true);
    try {
      const res = await fetchCommentsByForumPost({ forumPostId, page, size });
      setComments(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
      setTotalElements(res?.data?.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRepliesByComment = useCallback(async ({ parentCommentId, page = 0, size = 10 }) => {
    try {
      const res = await fetchRepliesByParentComment({ parentCommentId, page, size });
      setReplies(prev => ({
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
      setReplies(prev => ({
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

  const addComment = useCallback(async ({ postId, content, replyCommentId }) => {
    setLoading(true);
    try {
      const res = await createComment({ postId, content, replyCommentId });
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const editComment = useCallback(async ({ commentId, content }) => {
    setLoading(true);
    try {
      const res = await updateComment({ commentId, content });
      
      // Cập nhật comment trong state
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content, updatedAt: new Date().toISOString() }
            : comment
        )
      );
      
      // Cập nhật reply nếu là reply comment
      setReplies(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(parentId => {
          if (updated[parentId]?.content) {
            updated[parentId] = {
              ...updated[parentId],
              content: updated[parentId].content.map(reply =>
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
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    comments,
    replies,
    loading,
    totalPages,
    totalElements,
    currentPage,
    getCommentsByPost,
    getRepliesByComment,
    addComment,
    editComment,
    setComments,
    setReplies,
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentContext;