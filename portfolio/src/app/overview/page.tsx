import { getOverviewStats, getProjects, getSkills } from "@/lib/data"
import { generateMetadata } from "@/lib/seo"
import { groupBy, sortByOrder } from "@/lib/utils"
import Link from "next/link"

export const metadata = generateMetadata({
  title: "概要",
  description: "プロジェクト、スキル、技術の概要統計とサマリー情報をご覧いただけます。",
  path: "/overview"
})

export default async function OverviewPage() {
  const [stats, projects, skills] = await Promise.all([
    getOverviewStats(),
    getProjects(),
    getSkills()
  ])

  const projectsByCategory = groupBy(projects, 'category')
  const skillsByCategory = groupBy(skills, 'category')

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ポートフォリオ概要
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            プロジェクト実績とスキルセットの統計情報をご覧いただけます。
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalProjects}
            </div>
            <div className="text-gray-600 font-medium">総プロジェクト数</div>
            <div className="text-sm text-gray-500 mt-2">
              実績として公開中
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalYearsExperience}
            </div>
            <div className="text-gray-600 font-medium">最大経験年数</div>
            <div className="text-sm text-gray-500 mt-2">
              最も長いスキル経験
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Object.keys(skillsByCategory).reduce((total, category) => 
                total + skillsByCategory[category].length, 0
              )}
            </div>
            <div className="text-gray-600 font-medium">スキル数</div>
            <div className="text-sm text-gray-500 mt-2">
              習得済み技術・能力
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.featuredProjects.length}
            </div>
            <div className="text-gray-600 font-medium">注目プロジェクト</div>
            <div className="text-sm text-gray-500 mt-2">
              特に重要な実績
            </div>
          </div>
        </div>

        {/* Project Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            プロジェクト分布
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category === 'development' ? '開発' :
                     category === 'design' ? 'デザイン' : 'マネジメント'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category === 'development' ? 'bg-blue-100 text-blue-800' :
                    category === 'design' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {categoryProjects.length}件
                  </span>
                </div>
                <div className="space-y-2">
                  {sortByOrder(categoryProjects).slice(0, 3).map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="block p-3 rounded border hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {project.description}
                      </div>
                    </Link>
                  ))}
                  {categoryProjects.length > 3 && (
                    <Link
                      href={`/projects?category=${category}`}
                      className="block text-center p-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      すべて見る ({categoryProjects.length - 3}件以上)
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Technologies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            主要技術スタック
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.topTechnologies.slice(0, 10).map((tech) => (
                <div key={tech.name} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {tech.count}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {tech.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    プロジェクト
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills by Category */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            スキル分布
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category === 'development' ? '開発' :
                     category === 'design' ? 'デザイン' : 'マネジメント'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    category === 'development' ? 'bg-blue-100 text-blue-800' :
                    category === 'design' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {categorySkills.length}スキル
                  </span>
                </div>
                <div className="space-y-3">
                  {sortByOrder(categorySkills).slice(0, 5).map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {skill.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {skill.years}年経験
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Lv.{skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                  {categorySkills.length > 5 && (
                    <Link
                      href={`/skills?category=${category}`}
                      className="block text-center p-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      すべて見る ({categorySkills.length - 5}件以上)
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            注目のプロジェクト
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.category === 'development' ? 'bg-blue-100 text-blue-800' :
                      project.category === 'design' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.category === 'development' ? '開発' :
                       project.category === 'design' ? 'デザイン' : 'マネジメント'}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      注目
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              すべてのプロジェクトを見る
            </Link>
            <Link
              href="/skills"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              スキル詳細を見る
            </Link>
            <Link
              href="/career"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              キャリア履歴を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}