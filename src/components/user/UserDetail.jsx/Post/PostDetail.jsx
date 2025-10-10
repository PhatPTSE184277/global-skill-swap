import React, { useEffect, useState } from "react";
import { Heart, Navigation, Bookmark, ImagePlus, SendHorizontal, ChevronRight, ChevronLeft, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

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
    likes: "1.6K likes",
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
                                                <span>•</span>
                                                <span>{currentPost.likes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="prose prose-gray max-w-none mb-6">
                                        <ReactMarkdown>{currentPost.content}</ReactMarkdown>
                                    </div>
                                    <div className="flex justify-between my-6">
                                        <Heart size={23} color="#fb5607" strokeWidth={2.5} cursor="pointer" />
                                        <div className="flex gap-6">
                                            <Navigation size={23} color="#4D2C5E" strokeWidth={2.5} cursor="pointer" />
                                            <Bookmark size={23} color="#4D2C5E" strokeWidth={2.5} cursor="pointer" />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h2 className="text-xl font-bold mb-4">Bình luận</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Chính sách bình luận: Chúng tôi rất trân trọng các bình luận
                                            và thời gian mà độc giả dành để chia sẻ ý tưởng và phản hồi.
                                            Tuy nhiên, tất cả bình luận đều được kiểm duyệt thủ công và
                                            những bình luận được xem là spam hoặc chỉ mang tính quảng cáo
                                            sẽ bị xóa.
                                        </p>
                                        <div className="space-y-4">
                                            {mockComments.map((comment) => (
                                                <div key={comment.id} className="border-b border-gray-100 pb-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-sm text-gray-900">
                                                                    {comment.author}
                                                                </h3>
                                                                <span className="text-xs text-gray-500">
                                                                    {comment.date}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {comment.content}
                                                            </p>
                                                            {comment.replies &&
                                                                comment.replies.map((reply) => (
                                                                    <div
                                                                        key={reply.id}
                                                                        className="mt-5 ml-6 pl-4 border-l-2 border-gray-200 flex gap-3"
                                                                    >
                                                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className="font-semibold text-sm text-gray-900">
                                                                                    {reply.author}
                                                                                </h4>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {reply.date}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-600">
                                                                                {reply.content}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <a
                                                href="#"
                                                className="text-xs text-gray-500 underline hover:text-gray-700"
                                            >
                                                View All...
                                            </a>
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                                    <button type="button" className="text-gray-400 hover:text-gray-600">
                                                        <ImagePlus size={20} />
                                                    </button>
                                                    <button type="button" className="text-gray-400 hover:text-orange-500">
                                                        <SendHorizontal size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostDetail;