export interface PublicMessage {
  id: string
  jobId: string
  userId: string
  userName: string
  userType: "employer" | "candidate"
  content: string
  createdAt: Date
}

export interface PrivateMessage {
  id: string
  jobId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  content: string
  createdAt: Date
  isRead: boolean
}

export interface ChatContextType {
  publicMessages: PublicMessage[]
  privateMessages: PrivateMessage[]
  sendPublicMessage: (jobId: string, content: string) => Promise<boolean>
  sendPrivateMessage: (jobId: string, receiverId: string, receiverName: string, content: string) => Promise<boolean>
  getPublicMessagesForJob: (jobId: string) => PublicMessage[]
  getPrivateMessagesForJob: (jobId: string, otherUserId: string) => PrivateMessage[]
  markMessagesAsRead: (jobId: string, otherUserId: string) => void
  isLoading: boolean
}
