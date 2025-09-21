import { LoadingCard } from '@/components/ui/loading'

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>

        {/* Filters skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="flex flex-wrap gap-4 justify-center">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
            ))}
          </div>
        </div>

        {/* Projects grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}