import type { ObjectId } from "mongodb"

export interface Guide {
  _id?: ObjectId
  userId: ObjectId
  places: string[]
  availableDates: string[]
  // Profile Information
  name: string
  bio: string
  profileImage?: string
  experience: number // years of experience
  specialties: string[] // hiking, trekking, mountaineering, etc.
  languages: string[]
  certifications: string[]
  location: string
  contactInfo: {
    phone?: string
    email?: string
    whatsapp?: string
    website?: string
  }
  // Statistics
  totalHikes: number
  totalClients: number
  rating: number
  reviewCount: number
  // Pricing
  dailyRate: number
  currency: string
  // Status
  isActive: boolean
  isVerified: boolean
  joinedDate: Date
  lastActive: Date
}

export interface GuideStory {
  _id?: ObjectId
  guideId: ObjectId
  authorId: ObjectId // User who wrote the story
  authorName: string
  title: string
  content: string
  images?: string[]
  hikeName: string
  hikeDate: Date
  rating: number // 1-5 stars
  tags: string[]
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GuideHike {
  _id?: ObjectId
  guideId: ObjectId
  name: string
  description: string
  location: string
  difficulty: "Easy" | "Moderate" | "Challenging" | "Expert"
  duration: string
  distance: number
  elevation: number
  maxGroupSize: number
  price: number
  images: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
  }[]
  includedServices: string[]
  excludedServices: string[]
  requirements: string[]
  bestSeason: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GuideContact {
  _id?: ObjectId
  guideId: ObjectId
  clientName: string
  clientEmail: string
  clientPhone?: string
  message: string
  preferredDate?: Date
  groupSize: number
  hikeInterest?: string
  status: "pending" | "responded" | "booked" | "declined"
  createdAt: Date
  respondedAt?: Date
  response?: string
}
