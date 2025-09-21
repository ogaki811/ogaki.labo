import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/data'
import { SITE_CONFIG } from '@/lib/constants'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects()

  // Static pages
  const staticPages = [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/overview`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_CONFIG.url}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/career`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic project pages
  const projectPages = projects.map((project) => ({
    url: `${SITE_CONFIG.url}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.8 : 0.6,
  }))

  return [...staticPages, ...projectPages]
}