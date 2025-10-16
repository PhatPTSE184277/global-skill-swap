const PostSkeleton = () => (
  <div className="bg-white rounded-xl shadow flex flex-col animate-pulse">
    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
  </div>
);

export default PostSkeleton;