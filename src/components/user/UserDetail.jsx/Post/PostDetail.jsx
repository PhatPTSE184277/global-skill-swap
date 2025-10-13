import React, { useEffect, useContext, useState } from "react";
import { Heart, Navigation, Bookmark, ImagePlus, SendHorizontal, ChevronRight, ChevronLeft, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import PostContext from "../../../../contexts/PostContext";
import { toast } from "react-toastify";
import PostDetailSkeleton from "./PostDetailSkeleton";
import CommentSection from "../Comment/CommentSection";

const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 60 },
    transition: { duration: 0.3, ease: "easeOut" },
};

const mockPost = {
    id: 2,
    title: "Life In Japan: The Good, The Weird, And The Beautiful",
    author: "Joanna Wellick",
    date: "02 December 2022",
    readTime: "3 Min. To Read",
    views: "1.2K views",
    image: `https://picsum.photos/seed/2/800/400`,
    tags: ["Japan", "Life"],
    content: `
  ## The Good: Everyday Revelries
  One of the first things newcomers notice is how exceptionally well things work. Public transport is not only punctual but immaculately clean. Trains arrive on time to the second—and people actually form neat lines to board them.

  ## The Weird: Wonderfully Strange Moments
  Living in Japan means embracing its quirks, whether it's about buying hot ramen, umbrellas, or rice-filled lunch vending machines.

  ## The Beautiful: Nature, Rituals & Impermanence
  Japan is a country that has deeply respected aesthetics—it's about appreciating moments.

  ## Final Thoughts
  Living in Japan has taught me to slow down and pay attention—to savor tastes, to respect rituals, and to find joy in small things.
  `,
};

const mockComments = [
    {
        id: 1,
        author: "Brian Jackson",
        date: "December 14, 2017 at 5:13 pm",
        content: "I think you forgot to mention a very good one: Thrive architect from themeforest. This thing is pretty powerful.",
        replies: [
            {
                id: 2,
                author: "Joanna Wellick",
                date: "December 14, 2017 at 5:15 pm",
                content: "Thanks Brian! We have updated the above post. You are correct, their page builder has both a free and a premium version.",
            },
        ],
    },
];

const PostDetail = ({
    open,
    onClose,
    post = mockPost,
    posts = [mockPost],
}) => {
    const [currentIndex, setCurrentIndex] = useState(
        posts.findIndex((p) => p.id === post.id)
    );

    useEffect(() => {
        setCurrentIndex(posts.findIndex((p) => p.id === post.id));
    }, [post, posts]);

    const currentPostRaw = posts[currentIndex] || post || mockPost;
    const currentPost = {
        ...mockPost,
        ...currentPostRaw,
        title: currentPostRaw.title || mockPost.title,
        content: currentPostRaw.content || mockPost.content,
    };

    // Context quản lý like
    const {
        likedMap,
        loadingLikeMap,
        checkLiked,
        likePost,
        unlikePost,
    } = useContext(PostContext);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(false);
        if (currentPost.id) {
            checkLiked(currentPost.id).then(() => setIsReady(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPost.id]);

    const handleHeartClick = async () => {
        if (likedMap[currentPost.id]) {
            try {
                await unlikePost(currentPost.id);
            } catch (err) {
                toast.error("Không thể bỏ like bài viết này!");
            }
        } else {
            try {
                await likePost(currentPost.id);
            } catch (err) {
                toast.error("Không thể like bài viết này!");
            }
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goNext = () => {
        if (currentIndex < posts.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <button
                    onClick={onClose}
                    className="fixed top-6 right-8 text-gray-300 hover:text-white p-2 rounded-full transition-colors z-50 cursor-pointer"
                    aria-label="Đóng"
                >
                    <X size={32} />
                </button>
                {currentIndex > 0 && (
                    <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-40 cursor-pointer"
                        aria-label="Bài trước"
                    >
                        <ChevronLeft size={36} />
                    </button>
                )}
                {currentIndex < posts.length - 1 && (
                    <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-40 cursor-pointer"
                        aria-label="Bài sau"
                    >
                        <ChevronRight size={36} />
                    </button>
                )}
                <motion.div
                    {...fadeInUp}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto relative overflow-y-auto max-h-[90vh]"
                >
                    {!isReady ? (
                        <PostDetailSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <div className="lg:col-span-2">
                                <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <img
                                        src={`https://picsum.photos/seed/${currentPost.id}/1000/600`}
                                        alt={currentPost.title}
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                    <div className="p-10">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                            {currentPost.title}
                                        </h1>
                                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {currentPost.author}
                                                </h3>
                                                <div className="flex items-center text-xs text-gray-500 gap-2">
                                                    <span>{currentPost.date}</span>
                                                    <span>•</span>
                                                    <span>{currentPost.readTime}</span>
                                                    <span>•</span>
                                                    <span>{currentPost.views}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="prose prose-gray max-w-none mb-6">
                                            <ReactMarkdown>{currentPost.content}</ReactMarkdown>
                                        </div>
                                        <div className="flex justify-between my-6">
                                            <button
                                                onClick={handleHeartClick}
                                                className="flex items-center gap-2"
                                                title={likedMap[currentPost.id] ? "Bỏ like bài viết" : "Like bài viết"}
                                                disabled={loadingLikeMap[currentPost.id]}
                                            >
                                                <Heart
                                                    size={23}
                                                    color="#ef4444"
                                                    fill={likedMap[currentPost.id] ? "#ef4444" : "none"}
                                                    strokeWidth={2.5}
                                                    cursor="pointer"
                                                />
                                            </button>
                                            <div className="flex gap-6">
                                                <Navigation size={23} color="#4D2C5E" strokeWidth={2.5} cursor="pointer" />
                                                <Bookmark size={23} color="#4D2C5E" strokeWidth={2.5} cursor="pointer" />
                                            </div>
                                        </div>

                                        <CommentSection comments={mockComments} />
                                    </div>
                                </article>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostDetail;