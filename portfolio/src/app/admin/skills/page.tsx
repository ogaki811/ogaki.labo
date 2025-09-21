'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSkills } from '@/lib/data'
import { getSkillLevelText, getSkillLevelColor, getCategoryColor } from '@/lib/utils'
import type { Skill } from '@/types/portfolio'

export default function AdminSkillsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [skills, setSkills] = useState<Skill[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    const email = localStorage.getItem('admin_email')
    
    if (!token || !email) {
      router.push('/admin/login' as any)
      return
    }

    setIsAuthenticated(true)
    loadSkills()
  }, [router])

  const loadSkills = async () => {
    try {
      const skillData = await getSkills()
      setSkills(skillData)
    } catch (error) {
      console.error('Error loading skills:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'development': return '開発'
      case 'design': return 'デザイン'
      case 'management': return 'マネジメント'
      default: return category
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill({ ...skill })
  }

  const handleSaveSkill = () => {
    if (!editingSkill) return

    // In a real application, this would call an API to update the skill
    setSkills(skills.map(s => 
      s.id === editingSkill.id ? editingSkill : s
    ))
    setEditingSkill(null)
    alert('スキルを更新しました')
  }

  const handleDeleteSkill = (skillId: string) => {
    if (confirm('このスキルを削除してもよろしいですか？')) {
      // In a real application, this would call an API to delete the skill
      setSkills(skills.filter(s => s.id !== skillId))
      alert('スキルを削除しました')
    }
  }

  const skillsByCategory = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href={"/admin" as any} className="text-blue-600 hover:text-blue-800 mr-4">
                ← ダッシュボード
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">スキル管理</h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              新規スキル
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                検索
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="スキル名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">すべて</option>
                <option value="development">開発</option>
                <option value="design">デザイン</option>
                <option value="management">マネジメント</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
            <div className="text-sm text-gray-600">総スキル数</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {(skills.reduce((sum, s) => sum + s.level, 0) / skills.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">平均レベル</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...skills.map(s => s.years))}
            </div>
            <div className="text-sm text-gray-600">最大経験年数</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {filteredSkills.length}
            </div>
            <div className="text-sm text-gray-600">フィルター結果</div>
          </div>
        </div>

        {/* Skills by Category */}
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getCategoryLabel(category)}
                  </h3>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getCategoryColor(category)}`}>
                    {categorySkills.length}スキル
                  </span>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        スキル名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        レベル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        経験年数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categorySkills.map((skill) => (
                      <tr key={skill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {skill.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(skill.level / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${getSkillLevelColor(skill.level)}`}>
                              {skill.level}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{skill.years}年</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSkill(skill)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              削除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(skillsByCategory).length === 0 && (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              スキルが見つかりません
            </h3>
            <p className="text-gray-600">
              検索条件を変更するか、新しいスキルを追加してください。
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                スキル編集
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    スキル名
                  </label>
                  <input
                    type="text"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    レベル (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    経験年数
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingSkill.years}
                    onChange={(e) => setEditingSkill({ ...editingSkill, years: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリ
                  </label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="development">開発</option>
                    <option value="design">デザイン</option>
                    <option value="management">マネジメント</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveSkill}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}