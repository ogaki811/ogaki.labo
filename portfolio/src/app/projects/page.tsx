import { Suspense } from "react"
import { getProjects, getProjectCategories, getProjectTags } from "@/lib/data"
import { generateMetadata } from "@/lib/seo"
import { sortByOrder, groupBy } from "@/lib/utils"
import ProjectsClient from "./projects-client"

export const metadata = generateMetadata({
  title: "プロジェクト",
  description: "これまでに手がけたプロジェクトの実績をご紹介します。開発、デザイン、マネジメントの各分野での取り組みをご覧いただけます。",
  path: "/projects"
})

export default async function ProjectsPage() {
  const [projects, categories, tags] = await Promise.all([
    getProjects(),
    getProjectCategories(),
    getProjectTags()
  ])

  // Sort projects by order
  const sortedProjects = sortByOrder(projects)
  const projectsByCategory = groupBy(sortedProjects, 'category')
  const featuredProjects = sortedProjects.filter(project => project.featured)

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            プロジェクト
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            これまでに手がけたプロジェクトの実績をご紹介します。
            開発、デザイン、マネジメントの各分野での取り組みをご覧いただけます。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {sortedProjects.length}
            </div>
            <div className="text-sm text-gray-600">
              総プロジェクト数
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {featuredProjects.length}
            </div>
            <div className="text-sm text-gray-600">注目プロジェクト</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">カテゴリー</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {tags.length}
            </div>
            <div className="text-sm text-gray-600">タグ</div>
          </div>
        </div>

        <Suspense fallback={<ProjectsLoading />}>
          <ProjectsClient
            projects={sortedProjects}
            categories={categories}
            tags={tags}
            initialFilters={{}}
          />
        </Suspense>
      </div>
    </div>
  )
}

function ProjectsLoading() {
  return (
    <div className="space-y-8">
      {/* Filter skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Projects grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}