import { getSkills } from "@/lib/data"
import { generateMetadata } from "@/lib/seo"
import { sortByOrder, groupBy, getSkillLevelText, getSkillLevelColor, getCategoryColor } from "@/lib/utils"

export const metadata = generateMetadata({
  title: "スキル",
  description: "これまでに習得してきた技術スキルと専門分野をご紹介します。開発、デザイン、マネジメントの各領域での経験年数とレベルをご覧いただけます。",
  path: "/skills"
})

interface SearchParams {
  category?: string
}

interface SkillsPageProps {
  searchParams: SearchParams
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const skills = await getSkills()
  const { category } = searchParams

  // Filter skills by category if specified
  let filteredSkills = sortByOrder(skills)
  if (category) {
    filteredSkills = filteredSkills.filter(skill => skill.category === category)
  }

  const skillsByCategory = groupBy(filteredSkills, 'category')
  const categories = Object.keys(skillsByCategory)

  // Calculate statistics
  const totalSkills = filteredSkills.length
  const averageLevel = filteredSkills.reduce((sum, skill) => sum + skill.level, 0) / totalSkills
  const averageYears = filteredSkills.reduce((sum, skill) => sum + skill.years, 0) / totalSkills
  const maxLevel = Math.max(...filteredSkills.map(skill => skill.level))
  const maxYears = Math.max(...filteredSkills.map(skill => skill.years))

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
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            スキル
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            これまでに習得してきた技術スキルと専門分野をご紹介します。
            開発、デザイン、マネジメントの各領域での経験年数とレベルをご覧いただけます。
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalSkills}
            </div>
            <div className="text-gray-600 font-medium">総スキル数</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {averageLevel.toFixed(1)}
            </div>
            <div className="text-gray-600 font-medium">平均レベル</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {averageYears.toFixed(1)}
            </div>
            <div className="text-gray-600 font-medium">平均経験年数</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {maxYears}
            </div>
            <div className="text-gray-600 font-medium">最大経験年数</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href="/skills"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </a>
            {['development', 'design', 'management'].map((cat) => (
              <a
                key={cat}
                href={`/skills?category=${cat}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryLabel(cat)}
              </a>
            ))}
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-12">
          {categories.map((categoryKey) => {
            const categorySkills = skillsByCategory[categoryKey]
            
            return (
              <section key={categoryKey}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getCategoryLabel(categoryKey)}
                  </h2>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(categoryKey)}`}>
                    {categorySkills.length}スキル
                  </span>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {categorySkills.length}
                    </div>
                    <div className="text-sm text-gray-600">スキル数</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {(categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">平均レベル</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {(categorySkills.reduce((sum, skill) => sum + skill.years, 0) / categorySkills.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">平均経験年数</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {Math.max(...categorySkills.map(skill => skill.years))}
                    </div>
                    <div className="text-sm text-gray-600">最大経験年数</div>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {skill.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{skill.years}年経験</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSkillLevelColor(skill.level)}`}>
                              {getSkillLevelText(skill.level)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {skill.level}
                          </div>
                          <div className="text-xs text-gray-500">/ 5</div>
                        </div>
                      </div>

                      {/* Level Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>スキルレベル</span>
                          <span>{skill.level}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Years Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>経験年数</span>
                          <span>{skill.years}年</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((skill.years / maxYears) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Skill Level Legend */}
        <div className="mt-16 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">スキルレベルについて</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                  level === 1 ? 'bg-gray-400' :
                  level === 2 ? 'bg-blue-400' :
                  level === 3 ? 'bg-green-400' :
                  level === 4 ? 'bg-orange-400' : 'bg-red-400'
                }`}>
                  {level}
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {getSkillLevelText(level)}
                </div>
                <div className="text-sm text-gray-600">
                  {level === 1 && '基本的な理解'}
                  {level === 2 && '簡単なタスクが可能'}
                  {level === 3 && '実務レベル'}
                  {level === 4 && '高度な活用が可能'}
                  {level === 5 && '専門家レベル'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/projects"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              プロジェクト実績を見る
            </a>
            <a
              href="/career"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              キャリア詳細を見る
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
  )
}