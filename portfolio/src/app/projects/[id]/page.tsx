import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProjectById, getRelatedProjects, getProjects } from "@/lib/data"
import { generateProjectMetadata, generateProjectStructuredData, generateJSONLD } from "@/lib/seo"
import { generateBreadcrumbs } from "@/lib/utils"

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    id: project.id
  }))
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) {
    return {
      title: "プロジェクトが見つかりません"
    }
  }
  return generateProjectMetadata(project)
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project, 3)
  const breadcrumbs = generateBreadcrumbs(`/projects/${project.id}`)
  const structuredData = generateProjectStructuredData(project)

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'development': return '開発'
      case 'design': return 'デザイン'
      case 'management': return 'マネジメント'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-100 text-blue-800'
      case 'design': return 'bg-purple-100 text-purple-800'
      case 'management': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJSONLD(structuredData)
        }}
      />
      
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href || index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href as any} className="text-blue-600 hover:text-blue-800">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-500">{crumb.label}</span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(project.category)}`}>
                {getCategoryLabel(project.category)}
              </span>
              {project.featured && (
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">
                  注目プロジェクト
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`${project.title} - 画像 ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Detailed Description */}
              {project.detailDescription && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">プロジェクト詳細</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {project.detailDescription.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Role */}
              {project.role && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">担当役割</h2>
                  <p className="text-lg text-gray-700">{project.role}</p>
                </section>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">課題と解決策</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.challenges && (
                      <div className="bg-red-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-red-800 mb-3">課題</h3>
                        <p className="text-red-700">{project.challenges}</p>
                      </div>
                    )}
                    {project.solutions && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-3">解決策</h3>
                        <p className="text-green-700">{project.solutions}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Outcome */}
              {project.outcome && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">成果・結果</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-blue-800 text-lg font-medium">{project.outcome}</p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">使用技術</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/projects?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Links */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">リンク</h3>
                <div className="space-y-3">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      プロジェクトを見る
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHubで見る
                    </a>
                  )}
                </div>
              </section>

              {/* Navigation */}
              <section>
                <div className="border-t pt-6">
                  <Link
                    href="/projects"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    プロジェクト一覧に戻る
                  </Link>
                </div>
              </section>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">関連プロジェクト</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="block bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {relatedProject.images && relatedProject.images[0] && (
                      <div className="relative h-48">
                        <Image
                          src={relatedProject.images[0]}
                          alt={relatedProject.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(relatedProject.category)}`}>
                          {getCategoryLabel(relatedProject.category)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {relatedProject.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedProject.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {relatedProject.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {relatedProject.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{relatedProject.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}