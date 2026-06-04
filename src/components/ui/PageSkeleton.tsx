export default function PageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-200 h-64 md:h-80" />

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        {/* Title block */}
        <div className="space-y-3 max-w-xl">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-100 rounded-lg w-full" />
          <div className="h-4 bg-gray-100 rounded-lg w-5/6" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <div className="h-12 w-12 bg-gray-200 rounded-xl" />
              <div className="h-5 bg-gray-200 rounded-lg w-2/3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>

        {/* Text block */}
        <div className="space-y-3 max-w-3xl mt-8">
          <div className="h-4 bg-gray-100 rounded-lg w-full" />
          <div className="h-4 bg-gray-100 rounded-lg w-11/12" />
          <div className="h-4 bg-gray-100 rounded-lg w-4/5" />
          <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  );
}
