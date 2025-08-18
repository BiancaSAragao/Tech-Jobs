export interface User {
  id: string
  email: string
  name: string
  type: "employer" | "candidate"
  createdAt: Date
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string, type: "employer" | "candidate") => Promise<boolean>
  register: (email: string, password: string, name: string, type: "employer" | "candidate") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
