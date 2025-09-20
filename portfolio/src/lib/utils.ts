import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date strings for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long'
  })
}

/**
 * Format date range for career periods
 */
export function formatDateRange(start: string, end?: string): string {
  const startFormatted = formatDate(start)
  if (!end) {
    return `${startFormatted} - 現在`
  }
  const endFormatted = formatDate(end)
  return `${startFormatted} - ${endFormatted}`
}

/**
 * Calculate duration between dates
 */
export function calculateDuration(start: string, end?: string): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)) // Average month length
  
  const years = Math.floor(diffMonths / 12)
  const months = diffMonths % 12
  
  if (years === 0) {
    return `${months}ヶ月`
  } else if (months === 0) {
    return `${years}年`
  } else {
    return `${years}年${months}ヶ月`
  }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [
    { label: 'ホーム', href: '/' }
  ]
  
  let currentPath = ''
  for (const path of paths) {
    currentPath += `/${path}`
    let label = path
    
    // Customize labels for known paths
    switch (path) {
      case 'projects':
        label = 'プロジェクト'
        break
      case 'skills':
        label = 'スキル'
        break
      case 'career':
        label = 'キャリア'
        break
      case 'about':
        label = 'について'
        break
      case 'contact':
        label = 'お問い合わせ'
        break
      case 'admin':
        label = '管理画面'
        break
      default:
        // Capitalize first letter for other paths
        label = path.charAt(0).toUpperCase() + path.slice(1)
    }
    
    breadcrumbs.push({
      label,
      href: currentPath
    })
  }
  
  return breadcrumbs
}

/**
 * Get skill level text
 */
export function getSkillLevelText(level: number): string {
  switch (level) {
    case 1:
      return '基礎'
    case 2:
      return '初級'
    case 3:
      return '中級'
    case 4:
      return '上級'
    case 5:
      return 'エキスパート'
    default:
      return '未評価'
  }
}

/**
 * Get skill level color class
 */
export function getSkillLevelColor(level: number): string {
  switch (level) {
    case 1:
      return 'bg-gray-200'
    case 2:
      return 'bg-blue-200'
    case 3:
      return 'bg-green-200'
    case 4:
      return 'bg-orange-200'
    case 5:
      return 'bg-red-200'
    default:
      return 'bg-gray-100'
  }
}

/**
 * Get category color class
 */
export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'design':
      return 'bg-purple-100 text-purple-800'
    case 'development':
      return 'bg-blue-100 text-blue-800'
    case 'management':
      return 'bg-green-100 text-green-800'
    case 'devops':
      return 'bg-orange-100 text-orange-800'
    case 'infrastructure':
      return 'bg-gray-100 text-gray-800'
    case 'business':
      return 'bg-indigo-100 text-indigo-800'
    case 'optimization':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Sort array by order property
 */
export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order)
}

/**
 * Group array by property
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Escape HTML characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Get contrast color (black or white) for background color
 */
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}