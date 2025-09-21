export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumbs skeleton */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>

        {/* Images skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="relative aspect-video bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content skeleton */}
          <div className="lg:col-span-2 space-y-8 animate-pulse">
            {/* Section 1 */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Section 3 */}
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-8 animate-pulse">
            {/* Technologies */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}