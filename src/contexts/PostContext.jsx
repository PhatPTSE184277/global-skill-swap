import { createContext, useState, useCallback } from "react";
import { fetchPostsByUser, createPost as createPostService, updatePost as updatePostService } from "../services/postService";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetchPostsByUser(params);
            console.log(response.data.content);
            setPosts(response.data.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPostById = useCallback(async (postId) => {
        setLoading(true);
        try {
            const response = await fetchPostById(postId);
            console.log(response.data);
            setPosts(response.data.content);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createPost = useCallback(async (postData) => {
        setLoading(true);
        try {
            const response = await createPostService(postData);
            setPosts((prevPosts) => [response, ...prevPosts]);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePost = useCallback(async (postId, postData) => {
        setLoading(true);
        try {
            const response = await updatePostService(postId, postData);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? response : post))
            );
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        posts,
        loading,
        fetchPosts,
        createPost,
        updatePost,
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;