export interface ContactInfo {
  email: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Profile {
  name: string
  title: string
  bio: string
  image?: string
  contact: ContactInfo
}

export interface Career {
  id: string
  company: string
  position: string
  period: {
    start: string
    end?: string
  }
  description: string
  achievements: string[]
  category: 'design' | 'development' | 'management'
  order: number
}

export interface Project {
  id: string
  title: string
  description: string
  detailDescription?: string // 詳細ページ用の詳しい説明
  category: 'design' | 'development' | 'management'
  technologies: string[]
  tags: string[] // 検索・フィルタ用タグ
  role: string
  outcome: string
  images: string[]
  featured: boolean
  order: number
  url?: string // 公開URL
  github?: string // GitHubリポジトリ
  challenges?: string // 課題・困難
  solutions?: string // 解決方法
}

export interface Skill {
  id: string
  name: string
  category: 'design' | 'development' | 'management'
  level: number // 1-5
  years: number
  order: number
}

export interface Tag {
  id: string
  name: string
  category: 'development' | 'design' | 'management' | 'devops' | 'infrastructure' | 'business' | 'optimization'
  color: string // 表示色
  count: number // 使用回数
}

// ページ関連の型定義
export interface OverviewStats {
  totalProjects: number
  projectsByCategory: Record<string, number>
  skillsByCategory: Record<string, number>
  topTechnologies: Array<{ name: string; count: number }>
  totalYearsExperience: number
}

export interface SearchResults {
  query: string
  results: Project[]
  totalHits: number
  filters: {
    category?: string
    tags?: string[]
  }
}

// 管理画面用の型定義
export interface AdminUser {
  username: string
  // ローカル環境での簡易認証用
}

export interface Media {
  id: string
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  uploadedAt: string
}

export interface ContentVersion {
  id: string
  timestamp: string
  changes: string
  author: string
}

export interface DeploymentLog {
  id: string
  timestamp: string
  status: 'success' | 'error' | 'pending'
  buildResult?: string
  errorMessage?: string
}