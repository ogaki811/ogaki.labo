import Image from "next/image"
import Link from "next/link"
import { getProfile, getFeaturedProjects, getOverviewStats } from "@/lib/data"
import { generateMetadata, generatePersonStructuredData, generateWebsiteStructuredData, generateJSONLD } from "@/lib/seo"
import { SOCIAL_LINKS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"

export const metadata = generateMetadata({
  title: "ホーム",
  description: "小川祐樹のポートフォリオサイト。デザインからアプリケーション開発を経て、現在はマネジメント職に従事。",
  path: "/"
})

export default async function Home() {
  const [profile, featuredProjects, stats] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getOverviewStats()
  ])

  const personData = generatePersonStructuredData()
  const websiteData = generateWebsiteStructuredData()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJSONLD(personData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJSONLD(websiteData)
        }}
      />
      
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src={profile.image || '/uploads/profile-photo.jpg'}
              alt={profile.name}
              width={120}
              height={120}
              className="rounded-full mx-auto mb-6"
              priority
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {profile.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {profile.title}
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {profile.bio}
            </p>
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                aria-label={social.name}
              >
                <span className="sr-only">{social.name}</span>
                {/* アイコンは後でアイコンライブラリで実装 */}
                <div className="w-5 h-5 bg-gray-400 rounded"></div>
              </a>
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              プロジェクトを見る
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            実績・スキル概要
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalProjects}
              </div>
              <div className="text-gray-600">プロジェクト</div>
              <div className="mt-4 text-sm text-gray-500">
                開発: {stats.projectsByCategory.development} / 
                デザイン: {stats.projectsByCategory.design} / 
                マネジメント: {stats.projectsByCategory.management}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.totalYearsExperience}
              </div>
              <div className="text-gray-600">年の経験</div>
              <div className="mt-4 text-sm text-gray-500">
                スキル数: {stats.skillsByCategory.development + stats.skillsByCategory.design + stats.skillsByCategory.management}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats.topTechnologies.length}
              </div>
              <div className="text-gray-600">主要技術</div>
              <div className="mt-4 text-sm text-gray-500">
                {stats.topTechnologies.slice(0, 3).map(tech => tech.name).join(', ')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              注目のプロジェクト
            </h2>
            <p className="text-gray-600">
              代表的なプロジェクトをご紹介します
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                {project.images && project.images[0] && (
                  <div className="relative h-48">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
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
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    詳細を見る →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              すべてのプロジェクトを見る
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            一緒にプロジェクトを進めませんか？
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            新しいチャレンジをお探しの方、お気軽にお声がけください。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
            >
              お問い合わせ
            </Link>
            <Link
              href="/career"
              className="px-6 py-3 border border-white text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              キャリア詳細
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
