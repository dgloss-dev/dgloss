export const SkeletonLoader = () => (
  <div className="grid grid-cols-1 py-4 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:py-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="mb-2 bg-gray-300 rounded-lg aspect-video"></div>
        <div className="w-3/4 h-4 mb-2 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);
