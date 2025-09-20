// Site Configuration
export const SITE_CONFIG = {
  name: 'ogaki.labo',
  title: '小川祐樹 - ポートフォリオ',
  description: 'デザインからアプリケーション開発を経て、現在はマネジメント職に従事。技術とビジネスの両面からプロダクト開発をリード。',
  url: 'https://ogaki.labo',
  ogImage: '/og-image.jpg',
  author: {
    name: '小川祐樹',
    email: 'contact@ogaki.labo',
    twitter: '@ogaki811',
    github: 'ogaki811',
    linkedin: 'ogaki'
  }
} as const

// Navigation Menu Items
export const NAVIGATION_ITEMS = [
  {
    label: 'ホーム',
    href: '/',
    description: 'トップページ'
  },
  {
    label: 'プロジェクト',
    href: '/projects',
    description: '実績・ポートフォリオ'
  },
  {
    label: 'スキル',
    href: '/skills', 
    description: '技術スキル・専門分野'
  },
  {
    label: 'キャリア',
    href: '/career',
    description: '職歴・経験'
  },
  {
    label: 'お問い合わせ',
    href: '/contact',
    description: 'ご連絡・お問い合わせ'
  }
] as const

// Social Links
export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/ogaki811',
    icon: 'github'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ogaki',
    icon: 'linkedin'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/ogaki811',
    icon: 'twitter'
  },
  {
    name: 'Email',
    url: 'mailto:contact@ogaki.labo',
    icon: 'email'
  }
] as const

// Categories
export const CATEGORIES = {
  DEVELOPMENT: 'development',
  DESIGN: 'design',
  MANAGEMENT: 'management'
} as const

export const CATEGORY_LABELS = {
  [CATEGORIES.DEVELOPMENT]: '開発',
  [CATEGORIES.DESIGN]: 'デザイン',
  [CATEGORIES.MANAGEMENT]: 'マネジメント'
} as const

export const CATEGORY_DESCRIPTIONS = {
  [CATEGORIES.DEVELOPMENT]: 'フロントエンド・バックエンド開発、アーキテクチャ設計',
  [CATEGORIES.DESIGN]: 'UI/UXデザイン、プロトタイピング、デザインシステム',
  [CATEGORIES.MANAGEMENT]: 'チームマネジメント、プロジェクト管理、プロダクト企画'
} as const

// Skill Levels
export const SKILL_LEVELS = {
  BASIC: 1,
  BEGINNER: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5
} as const

export const SKILL_LEVEL_LABELS = {
  [SKILL_LEVELS.BASIC]: '基礎',
  [SKILL_LEVELS.BEGINNER]: '初級',
  [SKILL_LEVELS.INTERMEDIATE]: '中級',
  [SKILL_LEVELS.ADVANCED]: '上級',
  [SKILL_LEVELS.EXPERT]: 'エキスパート'
} as const

// Tag Categories
export const TAG_CATEGORIES = {
  DEVELOPMENT: 'development',
  DESIGN: 'design',
  MANAGEMENT: 'management',
  DEVOPS: 'devops',
  INFRASTRUCTURE: 'infrastructure',
  BUSINESS: 'business',
  OPTIMIZATION: 'optimization'
} as const

export const TAG_CATEGORY_LABELS = {
  [TAG_CATEGORIES.DEVELOPMENT]: '開発',
  [TAG_CATEGORIES.DESIGN]: 'デザイン',
  [TAG_CATEGORIES.MANAGEMENT]: 'マネジメント',
  [TAG_CATEGORIES.DEVOPS]: 'DevOps',
  [TAG_CATEGORIES.INFRASTRUCTURE]: 'インフラ',
  [TAG_CATEGORIES.BUSINESS]: 'ビジネス',
  [TAG_CATEGORIES.OPTIMIZATION]: '最適化'
} as const

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  UPLOAD_DIR: '/uploads',
  THUMBNAIL_SIZES: {
    small: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    large: { width: 800, height: 600 }
  }
} as const

// API Routes
export const API_ROUTES = {
  PROJECTS: '/api/projects',
  SKILLS: '/api/skills',
  CAREER: '/api/career',
  PROFILE: '/api/profile',
  TAGS: '/api/tags',
  UPLOAD: '/api/upload',
  CONTACT: '/api/contact'
} as const

// Admin Configuration
export const ADMIN_CONFIG = {
  LOGIN_URL: '/admin/login',
  DASHBOARD_URL: '/admin',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  LOG_RETENTION_DAYS: 30
} as const

// Search Configuration
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_RESULTS: 50,
  DEBOUNCE_DELAY: 300,
  PLACEHOLDER: 'プロジェクト、スキル、技術を検索...',
  NO_RESULTS_MESSAGE: '検索結果が見つかりませんでした。',
  RESULT_TYPES: {
    PROJECT: 'project',
    SKILL: 'skill',
    TAG: 'tag'
  }
} as const

// Animation Configuration
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out'
  }
} as const

// Layout Configuration
export const LAYOUT_CONFIG = {
  CONTAINER_MAX_WIDTH: '1200px',
  SIDEBAR_WIDTH: '280px',
  HEADER_HEIGHT: '64px',
  FOOTER_HEIGHT: '120px',
  GRID_GAPS: {
    SMALL: '1rem',
    MEDIUM: '1.5rem',
    LARGE: '2rem'
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  }
} as const

// Color Palette
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a'
  },
  SECONDARY: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a'
  },
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6'
} as const

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILIES: {
    SANS: ['Inter', 'Noto Sans JP', 'sans-serif'],
    MONO: ['JetBrains Mono', 'Consolas', 'monospace']
  },
  FONT_SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem'
  },
  LINE_HEIGHTS: {
    TIGHT: '1.25',
    NORMAL: '1.5',
    RELAXED: '1.75'
  }
} as const

// Meta Tags
export const META_TAGS = {
  VIEWPORT: 'width=device-width, initial-scale=1',
  CHARSET: 'utf-8',
  THEME_COLOR: '#3b82f6',
  ROBOTS: 'index, follow',
  LANGUAGE: 'ja-JP'
} as const

// Contact Form Configuration
export const CONTACT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  REQUIRED_FIELDS: ['name', 'email', 'message'],
  EMAIL_TEMPLATES: {
    CONFIRMATION: 'confirmation',
    NOTIFICATION: 'notification'
  },
  SPAM_PROTECTION: {
    HONEYPOT_FIELD: 'hp_field',
    MIN_FORM_TIME: 3000, // 3 seconds
    MAX_FORM_TIME: 300000 // 5 minutes
  }
} as const

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'この項目は必須です',
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  INVALID_URL: '有効なURLを入力してください',
  FILE_TOO_LARGE: 'ファイルサイズが大きすぎます',
  INVALID_FILE_TYPE: 'サポートされていないファイル形式です',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  NOT_FOUND: 'ページが見つかりません',
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません'
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'フォームを送信しました',
  FILE_UPLOADED: 'ファイルをアップロードしました',
  DATA_SAVED: 'データを保存しました',
  EMAIL_SENT: 'メールを送信しました',
  PASSWORD_CHANGED: 'パスワードを変更しました',
  LOGOUT_SUCCESS: 'ログアウトしました'
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  ADMIN_TOKEN: 'admin_token',
  FORM_DRAFTS: 'form_drafts'
} as const

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  IMAGE_QUALITY: 85,
  LAZY_LOADING_THRESHOLD: '50px',
  CACHE_DURATION: {
    STATIC_ASSETS: 31536000, // 1 year
    API_RESPONSES: 300, // 5 minutes
    IMAGES: 2592000 // 30 days
  }
} as const