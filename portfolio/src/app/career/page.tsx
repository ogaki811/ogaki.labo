import { getCareer } from "@/lib/data"
import { generateMetadata } from "@/lib/seo"
import { sortByOrder, formatDateRange, calculateDuration, getCategoryColor } from "@/lib/utils"

export const metadata = generateMetadata({
  title: "キャリア",
  description: "これまでの職歴と経験をご紹介します。デザインからエンジニアリング、そしてマネジメントへと発展してきたキャリアの詳細をご覧いただけます。",
  path: "/career"
})

export default async function CareerPage() {
  const career = await getCareer()
  const sortedCareer = sortByOrder(career)

  // Calculate total experience
  const totalMonths = career.reduce((total, job) => {
    const start = new Date(job.period.start)
    const end = job.period.end ? new Date(job.period.end) : new Date()
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    return total + months
  }, 0)

  const totalYears = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'development': return '開発'
      case 'design': return 'デザイン'
      case 'management': return 'マネジメント'
      default: return category
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            キャリア
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            これまでの職歴と経験をご紹介します。
            デザインからエンジニアリング、そしてマネジメントへと発展してきたキャリアの詳細をご覧いただけます。
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <span className="text-blue-600 font-medium">
              総職歴: {totalYears}年{remainingMonths > 0 ? `${remainingMonths}ヶ月` : ''}
            </span>
          </div>
        </div>

        {/* Career Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-12">
            {sortedCareer.map((job, index) => (
              <div key={job.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 border-white shadow-lg ${
                  job.category === 'development' ? 'bg-blue-500' :
                  job.category === 'design' ? 'bg-purple-500' :
                  job.category === 'management' ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 ml-8">
                  <div className="bg-white p-8 rounded-lg shadow-md border">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {job.position}
                        </h3>
                        <div className="text-lg text-gray-700 mb-2">
                          {job.company}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">
                            {formatDateRange(job.period.start, job.period.end)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({calculateDuration(job.period.start, job.period.end)})
                          </span>
                          <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(job.category)}`}>
                            {getCategoryLabel(job.category)}
                          </span>
                        </div>
                      </div>
                      {!job.period.end && (
                        <div className="mt-4 md:mt-0">
                          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
                            現職
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    {/* Achievements */}
                    {job.achievements && job.achievements.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          主な実績・成果
                        </h4>
                        <ul className="space-y-3">
                          {job.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="flex items-start">
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                              <span className="text-gray-700">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">キャリアサマリー</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* By Category */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">分野別経験</h3>
              <div className="space-y-3">
                {['design', 'development', 'management'].map((category) => {
                  const categoryJobs = career.filter(job => job.category === category)
                  const categoryMonths = categoryJobs.reduce((total, job) => {
                    const start = new Date(job.period.start)
                    const end = job.period.end ? new Date(job.period.end) : new Date()
                    return total + ((end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()))
                  }, 0)
                  const years = Math.floor(categoryMonths / 12)
                  const months = categoryMonths % 12

                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(category)}`}>
                        {getCategoryLabel(category)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {years > 0 && `${years}年`}{months > 0 && `${months}ヶ月`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Key Skills Developed */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">習得スキル</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">• チームマネジメント</div>
                <div className="text-sm text-gray-700">• プロダクト開発</div>
                <div className="text-sm text-gray-700">• フロントエンド開発</div>
                <div className="text-sm text-gray-700">• UI/UXデザイン</div>
                <div className="text-sm text-gray-700">• アジャイル開発</div>
                <div className="text-sm text-gray-700">• プロジェクト管理</div>
              </div>
            </div>

            {/* Growth Trajectory */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">キャリアの軌跡</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">デザイナー</span>
                </div>
                <div className="ml-6 border-l-2 border-gray-200 h-4"></div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">エンジニア</span>
                </div>
                <div className="ml-6 border-l-2 border-gray-200 h-4"></div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">マネージャー</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Webデザイナーとしてキャリアをスタートし、フロントエンド開発の技術を身につけ、
              現在はエンジニアリングマネージャーとしてチーム全体の成長と成果創出に取り組んでいます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/projects"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                プロジェクト実績を見る
              </a>
              <a
                href="/skills"
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                スキル詳細を見る
              </a>
              <a
                href="/contact"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}