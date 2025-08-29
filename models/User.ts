import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "user" | "company" | "admin"
  companyName?: string
  googleId?: string
}
