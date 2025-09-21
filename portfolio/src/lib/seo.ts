import type { Metadata } from 'next'
import { SITE_CONFIG, META_TAGS } from './constants'
import type { Project, Skill, Career } from '@/types/portfolio'

/**
 * Base SEO configuration
 */
const DEFAULT_METADATA: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  keywords: [
    '小川祐樹',
    'ポートフォリオ',
    'エンジニアリングマネージャー',
    'フロントエンド開発',
    'React',
    'Next.js',
    'TypeScript',
    'UI/UXデザイン',
    'チームマネジメント',
    'プロダクト開発',
    'アジャイル開発'
  ],
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: '/',
    languages: {
      'ja-JP': '/'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.author.twitter,
    images: [SITE_CONFIG.ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION
  }
}

/**
 * Generate metadata for pages
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  path = '/',
  images = [],
  noIndex = false
}: {
  title?: string
  description?: string
  keywords?: string[]
  path?: string
  images?: string[]
  noIndex?: boolean
}): Metadata {
  const pageUrl = new URL(path, SITE_CONFIG.url).toString()
  const pageImages = images.length > 0 ? images : [SITE_CONFIG.ogImage]

  return {
    ...DEFAULT_METADATA,
    title,
    description: description || DEFAULT_METADATA.description,
    keywords: [...(DEFAULT_METADATA.keywords as string[]), ...keywords],
    alternates: {
      canonical: path,
      languages: {
        'ja-JP': path
      }
    },
    openGraph: {
      ...DEFAULT_METADATA.openGraph,
      title: title || DEFAULT_METADATA.openGraph?.title,
      description: description || DEFAULT_METADATA.openGraph?.description,
      url: pageUrl,
      images: pageImages.map(image => ({
        url: image,
        width: 1200,
        height: 630,
        alt: title || SITE_CONFIG.title
      }))
    },
    twitter: {
      ...DEFAULT_METADATA.twitter,
      title: title || DEFAULT_METADATA.twitter?.title,
      description: description || DEFAULT_METADATA.twitter?.description,
      images: pageImages
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : DEFAULT_METADATA.robots
  }
}

/**
 * Generate metadata for project pages
 */
export function generateProjectMetadata(project: Project): Metadata {
  const keywords = [
    project.title,
    ...project.technologies,
    ...(project.tags || []),
    project.category
  ]

  const images = project.images && project.images.length > 0 
    ? project.images 
    : [SITE_CONFIG.ogImage]

  return generateMetadata({
    title: project.title,
    description: project.description,
    keywords,
    path: `/projects/${project.id}`,
    images
  })
}

/**
 * Generate metadata for skill pages
 */
export function generateSkillMetadata(skill: Skill): Metadata {
  return generateMetadata({
    title: `${skill.name} - スキル`,
    description: `${skill.name}の経験年数${skill.years}年、レベル${skill.level}のスキル詳細`,
    keywords: [skill.name, skill.category, 'スキル'],
    path: `/skills/${skill.id}`
  })
}

/**
 * Generate metadata for career pages
 */
export function generateCareerMetadata(career: Career): Metadata {
  return generateMetadata({
    title: `${career.company} - キャリア`,
    description: career.description,
    keywords: [career.company, career.position, career.category, 'キャリア'],
    path: `/career/${career.id}`
  })
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.author.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.author.email,
    sameAs: [
      `https://github.com/${SITE_CONFIG.author.github}`,
      `https://linkedin.com/in/${SITE_CONFIG.author.linkedin}`,
      `https://twitter.com/${SITE_CONFIG.author.twitter}`
    ],
    jobTitle: 'エンジニアリングマネージャー',
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}/uploads/profile-photo.jpg`,
    knowsAbout: [
      'Frontend Development',
      'React',
      'Next.js',
      'TypeScript',
      'UI/UX Design',
      'Team Management',
      'Product Development',
      'Agile Development'
    ]
  }
}


/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ label: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.label,
      item: `${SITE_CONFIG.url}${breadcrumb.href}`
    }))
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generate JSON-LD script tag
 */
export function generateJSONLD(data: object): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Get canonical URL for page
 */
export function getCanonicalUrl(path: string): string {
  return new URL(path, SITE_CONFIG.url).toString()
}

/**
 * Generate hreflang tags
 */
export function generateHreflangTags(path: string) {
  return [
    {
      rel: 'alternate',
      hrefLang: 'ja-JP',
      href: getCanonicalUrl(path)
    },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: getCanonicalUrl(path)
    }
  ]
}

/**
 * Generate meta tags for social sharing
 */
export function generateSocialMetaTags({
  title,
  description,
  image,
  url
}: {
  title: string
  description: string
  image?: string
  url: string
}) {
  const ogImage = image || SITE_CONFIG.ogImage
  
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_CONFIG.name },
    { property: 'og:locale', content: 'ja_JP' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:creator', content: SITE_CONFIG.author.twitter }
  ]
}

/**
 * Generate robots meta tag
 */
export function generateRobotsMeta(options: {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
  noimageindex?: boolean
} = {}) {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    noimageindex = false
  } = options

  const directives = []
  
  if (index) directives.push('index')
  else directives.push('noindex')
  
  if (follow) directives.push('follow')
  else directives.push('nofollow')
  
  if (noarchive) directives.push('noarchive')
  if (nosnippet) directives.push('nosnippet')
  if (noimageindex) directives.push('noimageindex')

  return directives.join(', ')
}

/**
 * Validate and clean metadata
 */
export function validateMetadata(metadata: Partial<Metadata>) {
  const cleaned: Partial<Metadata> = { ...metadata }

  // Validate title length
  if (typeof cleaned.title === 'string' && cleaned.title.length > 60) {
    console.warn('Title length exceeds recommended 60 characters')
  }

  // Validate description length
  if (cleaned.description && cleaned.description.length > 160) {
    console.warn('Description length exceeds recommended 160 characters')
  }

  // Ensure keywords is array
  if (cleaned.keywords && !Array.isArray(cleaned.keywords)) {
    cleaned.keywords = String(cleaned.keywords).split(',').map(k => k.trim())
  }

  return cleaned
}

/**
 * JSON-LD structured data generators
 */
export function generatePersonStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SITE_CONFIG.author.name,
    "jobTitle": "エンジニアリングマネージャー・フロントエンド開発者",
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "sameAs": [
      SITE_CONFIG.author.linkedin,
      SITE_CONFIG.author.github
    ],
    "knowsAbout": [
      "JavaScript",
      "TypeScript", 
      "React",
      "Next.js",
      "チームマネジメント",
      "プロダクト開発",
      "UI/UXデザイン"
    ]
  }
}

export function generateProjectStructuredData(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "url": project.url || `${SITE_CONFIG.url}/projects/${project.id}`,
    "author": {
      "@type": "Person",
      "name": SITE_CONFIG.author.name
    },
    "keywords": project.tags,
    "about": project.technologies,
    "workExample": project.outcome
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": SITE_CONFIG.name,
    "description": SITE_CONFIG.description,
    "url": SITE_CONFIG.url,
    "author": {
      "@type": "Person", 
      "name": SITE_CONFIG.author.name
    },
    "inLanguage": "ja-JP"
  }
}


/**
 * Generate Twitter Card metadata
 */
export function generateTwitterMetadata(title: string, description: string, image?: string): Metadata {
  return {
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: SITE_CONFIG.author.twitter,
      images: image ? [image] : [`${SITE_CONFIG.url}/og-image.jpg`],
    }
  }
}

/**
 * Generate Facebook/OG metadata  
 */
export function generateOGMetadata(title: string, description: string, image?: string, type: 'website' | 'article' = 'website'): Metadata {
  return {
    openGraph: {
      type,
      title,
      description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: 'ja_JP',
      images: [
        {
          url: image || `${SITE_CONFIG.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    }
  }
}

/**
 * Generate canonical URL metadata
 */
export function generateCanonicalMetadata(path: string): Metadata {
  return {
    alternates: {
      canonical: `${SITE_CONFIG.url}${path}`,
      languages: {
        'ja-JP': `${SITE_CONFIG.url}${path}`
      }
    }
  }
}

/**
 * Comprehensive metadata generator for pages
 */
export function generatePageMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  keywords,
  noIndex = false
}: {
  title: string
  description: string  
  path?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const fullTitle = path === '/' ? title : `${title} | ${SITE_CONFIG.name}`
  
  return {
    title: fullTitle,
    description,
    keywords: keywords || DEFAULT_METADATA.keywords,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    ...generateCanonicalMetadata(path),
    ...generateOGMetadata(fullTitle, description, image, type),
    ...generateTwitterMetadata(fullTitle, description, image)
  }
}

export { DEFAULT_METADATA }