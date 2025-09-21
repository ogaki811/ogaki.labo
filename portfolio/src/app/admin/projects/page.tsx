'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProjects } from '@/lib/data'
import type { Project } from '@/types/portfolio'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    const email = localStorage.getItem('admin_email')
    
    if (!token || !email) {
      router.push('/admin/login' as any)
      return
    }

    setIsAuthenticated(true)
    loadProjects()
  }, [router])

  const loadProjects = async () => {
    try {
      const projectData = await getProjects()
      setProjects(projectData)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-100 text-blue-800'
      case 'design': return 'bg-purple-100 text-purple-800'
      case 'management': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('このプロジェクトを削除してもよろしいですか？')) {
      // In a real application, this would call an API to delete the project
      setProjects(projects.filter(p => p.id !== projectId))
      alert('プロジェクトを削除しました')
    }
  }

  const toggleFeatured = (projectId: string) => {
    // In a real application, this would call an API to update the project
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    ))
  }

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
              <h1 className="text-2xl font-bold text-gray-900">プロジェクト管理</h1>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              新規プロジェクト
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
                placeholder="プロジェクト名、説明で検索..."
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
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-600">総プロジェクト数</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.featured).length}
            </div>
            <div className="text-sm text-gray-600">注目プロジェクト</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {projects.filter(p => p.category === 'development').length}
            </div>
            <div className="text-sm text-gray-600">開発プロジェクト</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {filteredProjects.length}
            </div>
            <div className="text-sm text-gray-600">フィルター結果</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              プロジェクト一覧 ({filteredProjects.length}件)
            </h3>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                プロジェクトが見つかりません
              </h3>
              <p className="text-gray-600">
                検索条件を変更するか、新しいプロジェクトを作成してください。
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プロジェクト
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      技術
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-md truncate">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(project.category)}`}>
                          {getCategoryLabel(project.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {project.featured && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              注目
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleFeatured(project.id)}
                            className={`px-3 py-1 text-xs rounded ${
                              project.featured
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {project.featured ? '注目解除' : '注目設定'}
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            編集
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Link href={`/projects/${project.id}` as any} target="_blank">
                              表示
                            </Link>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
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
          )}
        </div>
      </div>
    </div>
  )
}