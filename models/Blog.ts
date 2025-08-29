import type { ObjectId } from "mongodb"

export interface Blog {
  _id?: ObjectId
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  category: string
  tags: string[]
  image?: string
  featured: boolean
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  views: number
  readTime: string
}

export interface BlogCategory {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  count: number
}
