// components/Skeleton/PropertyCardSkeleton.tsx
import React from 'react';

const PropertyCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm p-4 border border-gray-200 rounded-lg shadow-md animate-pulse">
      <div className="h-48 bg-gray-300 rounded-md"></div>
      <div className="mt-4">
        <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded-md mt-2 w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded-md mt-2 w-1/3"></div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
