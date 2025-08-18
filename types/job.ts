export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  company: string
  location: string
  salary?: string
  type: "full-time" | "part-time" | "contract" | "internship"
  level: "junior" | "mid" | "senior" | "lead"
  employerId: string
  employerName: string
  createdAt: Date
  updatedAt: Date
}

export interface JobFormData {
  title: string
  description: string
  requirements: string
  company: string
  location: string
  salary?: string
  type: "full-time" | "part-time" | "contract" | "internship"
  level: "junior" | "mid" | "senior" | "lead"
}
