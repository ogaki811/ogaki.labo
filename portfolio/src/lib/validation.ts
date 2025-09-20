import { z } from 'zod'

// Contact Info Schema
export const ContactInfoSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
})

// Profile Schema
export const ProfileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  image: z.string().optional(),
  contact: ContactInfoSchema,
})

// Career Schema
export const CareerSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string().min(1),
  period: z.object({
    start: z.string(),
    end: z.string().optional(),
  }),
  description: z.string().min(1),
  achievements: z.array(z.string()),
  category: z.enum(['design', 'development', 'management']),
  order: z.number(),
})

// Project Schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  detailDescription: z.string().optional(),
  category: z.enum(['design', 'development', 'management']),
  technologies: z.array(z.string()),
  tags: z.array(z.string()),
  role: z.string().min(1),
  outcome: z.string().min(1),
  images: z.array(z.string()),
  featured: z.boolean(),
  order: z.number(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
})

// Skill Schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['design', 'development', 'management']),
  level: z.number().min(1).max(5),
  years: z.number().min(0),
  order: z.number(),
})

// Tag Schema
export const TagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['technology', 'skill', 'domain']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i),
  count: z.number().min(0),
})

// Array Schemas for data files
export const CareersSchema = z.array(CareerSchema)
export const ProjectsSchema = z.array(ProjectSchema)
export const SkillsSchema = z.array(SkillSchema)
export const TagsSchema = z.array(TagSchema)

// Admin Schemas
export const AdminUserSchema = z.object({
  username: z.string().min(1),
})

export const MediaSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalName: z.string(),
  path: z.string(),
  size: z.number(),
  mimeType: z.string(),
  uploadedAt: z.string(),
})

export const ContentVersionSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  changes: z.string(),
  author: z.string(),
})

export const DeploymentLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  status: z.enum(['success', 'error', 'pending']),
  buildResult: z.string().optional(),
  errorMessage: z.string().optional(),
})

// Type guards for runtime validation
export function validateProfile(data: unknown) {
  return ProfileSchema.parse(data)
}

export function validateCareers(data: unknown) {
  return CareersSchema.parse(data)
}

export function validateProjects(data: unknown) {
  return ProjectsSchema.parse(data)
}

export function validateSkills(data: unknown) {
  return SkillsSchema.parse(data)
}

export function validateTags(data: unknown) {
  return TagsSchema.parse(data)
}