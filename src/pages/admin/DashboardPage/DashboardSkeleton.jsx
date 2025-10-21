import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`}></div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <SkeletonBox className="h-64" />
      <SkeletonBox className="h-64" />
      <SkeletonBox className="h-64" />
      <SkeletonBox className="h-64" />
    </div>
  </div>
);

export default DashboardSkeleton;