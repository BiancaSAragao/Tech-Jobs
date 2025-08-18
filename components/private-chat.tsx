"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { Send, MessageSquare } from "lucide-react"

interface PrivateChatProps {
  jobId: string
  jobTitle: string
  otherUserId: string
  otherUserName: string
  otherUserType: "employer" | "candidate"
}

export function PrivateChat({ jobId, jobTitle, otherUserId, otherUserName, otherUserType }: PrivateChatProps) {
  const { user } = useAuth()
  const { getPrivateMessagesForJob, sendPrivateMessage, markMessagesAsRead, isLoading } = useChat()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(getPrivateMessagesForJob(jobId, otherUserId))
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Update messages when new ones are added and mark as read
  useEffect(() => {
    const newMessages = getPrivateMessagesForJob(jobId, otherUserId)
    setMessages(newMessages)
    markMessagesAsRead(jobId, otherUserId)
  }, [jobId, otherUserId, getPrivateMessagesForJob, markMessagesAsRead])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !message.trim()) {
      return
    }

    const success = await sendPrivateMessage(jobId, otherUserId, otherUserName, message)
    if (success) {
      setMessage("")
      setMessages(getPrivateMessagesForJob(jobId, otherUserId))
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Hoje"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  const getUserTypeLabel = (userType: "employer" | "candidate") => {
    return userType === "employer" ? "Empregador" : "Candidato"
  }

  if (!user) {
    return null
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversa com {otherUserName}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <Badge variant={otherUserType === "employer" ? "default" : "secondary"}>
              {getUserTypeLabel(otherUserType)}
            </Badge>
            <span>sobre a vaga: {jobTitle}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Inicie a conversa</h3>
                <p className="text-sm text-muted-foreground">Envie uma mensagem para {otherUserName} sobre esta vaga</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((msg, index) => {
                const showDate = index === 0 || formatDate(msg.createdAt) !== formatDate(messages[index - 1].createdAt)
                const isFromMe = msg.senderId === user.id

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-muted-foreground py-2">{formatDate(msg.createdAt)}</div>
                    )}
                    <div className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isFromMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{isFromMe ? "Você" : msg.senderName}</span>
                          <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder={`Mensagem para ${otherUserName}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !message.trim()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
