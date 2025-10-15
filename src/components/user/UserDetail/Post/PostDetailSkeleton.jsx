const PostDetailSkeleton = () => (
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-auto relative overflow-y-auto max-h-[90vh] p-10 animate-pulse">
    <div className="w-full h-64 bg-gray-200 rounded-xl mb-8"></div>
    <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between my-6">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="flex gap-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </div>
    </div>
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="flex gap-3 mt-6">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  </div>
);

export default PostDetailSkeleton;