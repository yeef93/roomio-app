export default function PropertyDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image carousel skeleton */}
      <div className="h-64 bg-gray-300 rounded-md mb-6"></div>

      {/* Property info skeleton */}
      <div className="px-4 lg:px-20 py-6 lg:py-12">
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded-md w-full"></div>
          <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
        </div>

        {/* Host details skeleton */}
        <div className="flex items-center mt-6">
          <div className="rounded-full bg-gray-300 w-12 h-12 mr-4"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
        </div>

        {/* Available Rooms skeleton */}
        <div className="mt-8">
          <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="border p-4 rounded-md bg-white shadow-md space-y-2">
                <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded-md w-full"></div>
                <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking details skeleton */}
        <div className="mt-8 space-y-2">
          <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
        </div>
      </div>
    </div>
  );
}