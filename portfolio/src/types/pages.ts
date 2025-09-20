import type { Project, Skill } from './portfolio'

// Search and Filter Types
export interface SearchFilters {
  category?: 'design' | 'development' | 'management'
  tags?: string[]
  featured?: boolean
}

export interface SearchResults {
  query: string
  results: Project[]
  totalHits: number
  filters: SearchFilters
  suggestions?: string[]
}

// Overview Page Types
export interface OverviewStats {
  totalProjects: number
  projectsByCategory: {
    design: number
    development: number
    management: number
  }
  skillsByCategory: {
    design: number
    development: number
    management: number
  }
  topTechnologies: Array<{
    name: string
    count: number
    category: string
  }>
  totalYearsExperience: number
  featuredProjects: Project[]
}

// Project List Page Types
export interface ProjectListPageProps {
  projects: Project[]
  categories: string[]
  tags: string[]
  initialFilters?: SearchFilters
}

// Project Detail Page Types
export interface ProjectDetailPageProps {
  project: Project
  relatedProjects: Project[]
}

// Navigation Types
export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface NavigationItem {
  label: string
  href: string
  active?: boolean
  children?: NavigationItem[]
}

// Admin Page Types
export interface AdminDashboardStats {
  totalProjects: number
  totalSkills: number
  totalTags: number
  lastUpdated: string
  deploymentStatus: 'success' | 'error' | 'pending' | 'none'
}

export interface FormState<T> {
  data: T
  errors: Record<string, string>
  isSubmitting: boolean
  isDirty: boolean
}

// SEO and Meta Types
export interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}

// Error Types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

// Pagination Types
export interface PaginationState {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrevious: boolean
}

// Loading States
export interface LoadingState {
  isLoading: boolean
  error?: string
  data?: unknown
}

// Chart Data Types for Overview
export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }>
}

export interface SkillDistributionData {
  category: string
  count: number
  skills: Skill[]
}

export interface TechnologyUsageData {
  technology: string
  projectCount: number
  years: number
  category: string
}