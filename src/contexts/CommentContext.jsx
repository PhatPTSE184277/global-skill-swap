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

  const getCommentsByPost = useCallback(async ({ forumPostId, page = 0, size = 10 }) => {
    setLoading(true);
    try {
      const res = await fetchCommentsByForumPost({ forumPostId, page, size });
      setComments(res?.data?.content || []);
      setTotalPages(res?.data?.totalPages || 1);
      setTotalElements(res?.data?.totalElements || 0);
    } catch (err) {
      setComments([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRepliesByComment = useCallback(async ({ parentCommentId, page = 0, size = 10 }) => {
    setLoading(true);
    try {
      const res = await fetchRepliesByParentComment({ parentCommentId, page, size });
      setReplies(prev => ({
        ...prev,
        [parentCommentId]: res?.data?.content || [],
      }));
    } catch (err) {
      setReplies(prev => ({
        ...prev,
        [parentCommentId]: [],
      }));
    } finally {
      setLoading(false);
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