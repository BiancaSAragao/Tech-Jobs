"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { PublicMessage, PrivateMessage, ChatContextType } from "@/types/chat"
import { useAuth } from "@/contexts/auth-context"

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [publicMessages, setPublicMessages] = useState<PublicMessage[]>([])
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedPublicMessages = localStorage.getItem("techJobs_publicMessages")
    const storedPrivateMessages = localStorage.getItem("techJobs_privateMessages")

    if (storedPublicMessages) {
      const parsedMessages = JSON.parse(storedPublicMessages).map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      }))
      setPublicMessages(parsedMessages)
    }

    if (storedPrivateMessages) {
      const parsedMessages = JSON.parse(storedPrivateMessages).map((msg: any) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      }))
      setPrivateMessages(parsedMessages)
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (publicMessages.length > 0) {
      localStorage.setItem("techJobs_publicMessages", JSON.stringify(publicMessages))
    }
  }, [publicMessages])

  useEffect(() => {
    if (privateMessages.length > 0) {
      localStorage.setItem("techJobs_privateMessages", JSON.stringify(privateMessages))
    }
  }, [privateMessages])

  const sendPublicMessage = async (jobId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) {
      return false
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newMessage: PublicMessage = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      userId: user.id,
      userName: user.name,
      userType: user.type,
      content: content.trim(),
      createdAt: new Date(),
    }

    setPublicMessages((prev) => [...prev, newMessage])
    setIsLoading(false)
    return true
  }

  const sendPrivateMessage = async (
    jobId: string,
    receiverId: string,
    receiverName: string,
    content: string,
  ): Promise<boolean> => {
    if (!user || !content.trim()) {
      return false
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newMessage: PrivateMessage = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      receiverName,
      content: content.trim(),
      createdAt: new Date(),
      isRead: false,
    }

    setPrivateMessages((prev) => [...prev, newMessage])
    setIsLoading(false)
    return true
  }

  const getPublicMessagesForJob = (jobId: string): PublicMessage[] => {
    return publicMessages
      .filter((msg) => msg.jobId === jobId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  const getPrivateMessagesForJob = (jobId: string, otherUserId: string): PrivateMessage[] => {
    return privateMessages
      .filter(
        (msg) =>
          msg.jobId === jobId &&
          ((msg.senderId === user?.id && msg.receiverId === otherUserId) ||
            (msg.senderId === otherUserId && msg.receiverId === user?.id)),
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  const markMessagesAsRead = (jobId: string, otherUserId: string) => {
    setPrivateMessages((prev) =>
      prev.map((msg) =>
        msg.jobId === jobId && msg.senderId === otherUserId && msg.receiverId === user?.id
          ? { ...msg, isRead: true }
          : msg,
      ),
    )
  }

  return (
    <ChatContext.Provider
      value={{
        publicMessages,
        privateMessages,
        sendPublicMessage,
        sendPrivateMessage,
        getPublicMessagesForJob,
        getPrivateMessagesForJob,
        markMessagesAsRead,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
