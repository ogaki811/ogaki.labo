import fs from 'fs'
import path from 'path'
import type { Profile, Career, Project, Skill, Tag } from '@/types/portfolio'
import { validateProfile, validateCareer, validateProject, validateSkill, validateTag } from './validation'

const dataDirectory = path.join(process.cwd(), 'data')

// Cache for data to avoid multiple file reads in development
const cache = new Map<string, any>()

/**
 * Generic function to load and validate JSON data
 */
async function loadJsonData<T>(
  filename: string,
  validator: (data: unknown) => T
): Promise<T> {
  const cacheKey = filename
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  try {
    const filePath = path.join(dataDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(fileContents)
    const validatedData = validator(jsonData)
    
    cache.set(cacheKey, validatedData)
    return validatedData
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    throw new Error(`Failed to load ${filename}`)
  }
}

/**
 * Load profile data
 */
export async function getProfile(): Promise<Profile> {
  return loadJsonData('profile.json', validateProfile)
}

/**
 * Load career data
 */
export async function getCareer(): Promise<Career[]> {
  return loadJsonData('career.json', (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Career data must be an array')
    }
    return data.map(validateCareer)
  })
}

/**
 * Load projects data
 */
export async function getProjects(): Promise<Project[]> {
  return loadJsonData('projects.json', (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Projects data must be an array')
    }
    return data.map(validateProject)
  })
}

/**
 * Load skills data
 */
export async function getSkills(): Promise<Skill[]> {
  return loadJsonData('skills.json', (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Skills data must be an array')
    }
    return data.map(validateSkill)
  })
}

/**
 * Load tags data
 */
export async function getTags(): Promise<Tag[]> {
  return loadJsonData('tags.json', (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Tags data must be an array')
    }
    return data.map(validateTag)
  })
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects()
  return projects.find(project => project.id === id) || null
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.category === category)
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.featured)
}

/**
 * Get projects by tag
 */
export async function getProjectsByTag(tagName: string): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => 
    project.tags && project.tags.includes(tagName)
  )
}

/**
 * Get skills by category
 */
export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const skills = await getSkills()
  return skills.filter(skill => skill.category === category)
}

/**
 * Get tags by category
 */
export async function getTagsByCategory(category: string): Promise<Tag[]> {
  const tags = await getTags()
  return tags.filter(tag => tag.category === category)
}

/**
 * Search projects by query
 */
export async function searchProjects(query: string): Promise<Project[]> {
  const projects = await getProjects()
  const lowercaseQuery = query.toLowerCase()
  
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.detailDescription?.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery)) ||
    project.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * Get all unique categories from projects
 */
export async function getProjectCategories(): Promise<string[]> {
  const projects = await getProjects()
  const categories = [...new Set(projects.map(project => project.category))]
  return categories.sort()
}

/**
 * Get all unique tags from projects
 */
export async function getProjectTags(): Promise<string[]> {
  const projects = await getProjects()
  const allTags = projects.flatMap(project => project.tags || [])
  const uniqueTags = [...new Set(allTags)]
  return uniqueTags.sort()
}

/**
 * Get all unique technologies from projects
 */
export async function getProjectTechnologies(): Promise<string[]> {
  const projects = await getProjects()
  const allTechnologies = projects.flatMap(project => project.technologies)
  const uniqueTechnologies = [...new Set(allTechnologies)]
  return uniqueTechnologies.sort()
}

/**
 * Get related projects based on tags and technologies
 */
export async function getRelatedProjects(project: Project, limit: number = 3): Promise<Project[]> {
  const allProjects = await getProjects()
  const otherProjects = allProjects.filter(p => p.id !== project.id)
  
  // Score projects based on shared tags and technologies
  const scoredProjects = otherProjects.map(otherProject => {
    let score = 0
    
    // Score for shared tags
    if (project.tags && otherProject.tags) {
      const sharedTags = project.tags.filter(tag => otherProject.tags!.includes(tag))
      score += sharedTags.length * 3
    }
    
    // Score for shared technologies
    const sharedTechnologies = project.technologies.filter(tech => 
      otherProject.technologies.includes(tech)
    )
    score += sharedTechnologies.length * 2
    
    // Score for same category
    if (project.category === otherProject.category) {
      score += 1
    }
    
    return { project: otherProject, score }
  })
  
  // Sort by score and return top results
  return scoredProjects
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project)
}

/**
 * Get statistics for overview page
 */
export async function getOverviewStats() {
  const [projects, skills] = await Promise.all([
    getProjects(),
    getSkills()
  ])
  
  // Count projects by category
  const projectsByCategory = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Count skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Get top technologies
  const technologyCounts = projects.reduce((acc, project) => {
    project.technologies.forEach(tech => {
      acc[tech] = (acc[tech] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)
  
  const topTechnologies = Object.entries(technologyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      category: 'technology' // Could be enhanced with technology categorization
    }))
  
  // Calculate total years of experience (max from skills)
  const totalYearsExperience = Math.max(...skills.map(skill => skill.years))
  
  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured)
  
  return {
    totalProjects: projects.length,
    projectsByCategory: {
      design: projectsByCategory.design || 0,
      development: projectsByCategory.development || 0,
      management: projectsByCategory.management || 0
    },
    skillsByCategory: {
      design: skillsByCategory.design || 0,
      development: skillsByCategory.development || 0,
      management: skillsByCategory.management || 0
    },
    topTechnologies,
    totalYearsExperience,
    featuredProjects
  }
}

/**
 * Clear cache (useful for development)
 */
export function clearCache(): void {
  cache.clear()
}