import { createContext, useState, useCallback } from "react";
import {
    fetchPostsByUser,
    createPost as createPostService,
    updatePost as updatePostService,
    interactPost,
    deletePostInteraction,
    checkPostLiked
} from "../services/postService";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likedMap, setLikedMap] = useState({});
    const [loadingLikeMap, setLoadingLikeMap] = useState({});

    const fetchPosts = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await fetchPostsByUser(params);
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

    const likePost = useCallback(async (postId) => {
        setLoadingLikeMap((prev) => ({ ...prev, [postId]: true }));
        try {
            await interactPost(postId, "LIKE");
            setLikedMap((prev) => ({ ...prev, [postId]: true }));
        } catch (err) {
            setLikedMap((prev) => ({ ...prev, [postId]: false }));
            throw err;
        } finally {
            setLoadingLikeMap((prev) => ({ ...prev, [postId]: false }));
        }
    }, []);

    const unlikePost = useCallback(async (postId) => {
        setLoadingLikeMap((prev) => ({ ...prev, [postId]: true }));
        try {
            await deletePostInteraction(postId);
            setLikedMap((prev) => ({ ...prev, [postId]: false }));
        } catch (err) {
            setLikedMap((prev) => ({ ...prev, [postId]: true }));
            throw err;
        } finally {
            setLoadingLikeMap((prev) => ({ ...prev, [postId]: false }));
        }
    }, []);

    const value = {
        posts,
        loading,
        fetchPosts,
        createPost,
        updatePost,
        likedMap,
        loadingLikeMap,
        checkLiked,
        likePost,
        unlikePost,
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContext;