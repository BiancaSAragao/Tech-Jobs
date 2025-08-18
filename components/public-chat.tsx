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

interface PublicChatProps {
  jobId: string
  jobTitle: string
}

export function PublicChat({ jobId, jobTitle }: PublicChatProps) {
  const { user } = useAuth()
  const { getPublicMessagesForJob, sendPublicMessage, isLoading } = useChat()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(getPublicMessagesForJob(jobId))
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Update messages when new ones are added
  useEffect(() => {
    setMessages(getPublicMessagesForJob(jobId))
  }, [jobId, getPublicMessagesForJob])

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

    const success = await sendPublicMessage(jobId, message)
    if (success) {
      setMessage("")
      setMessages(getPublicMessagesForJob(jobId))
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

  const getUserTypeBadgeVariant = (userType: "employer" | "candidate") => {
    return userType === "employer" ? "default" : "secondary"
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Público
        </CardTitle>
        <CardDescription>Discussão aberta sobre a vaga: {jobTitle}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma mensagem ainda</h3>
                <p className="text-sm text-muted-foreground">Seja o primeiro a iniciar a conversa sobre esta vaga!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((msg, index) => {
                const showDate = index === 0 || formatDate(msg.createdAt) !== formatDate(messages[index - 1].createdAt)

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-muted-foreground py-2">{formatDate(msg.createdAt)}</div>
                    )}
                    <div className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.userId === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.userName}</span>
                          <Badge variant={getUserTypeBadgeVariant(msg.userType)} className="text-xs px-1 py-0 h-4">
                            {getUserTypeLabel(msg.userType)}
                          </Badge>
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
          {user ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !message.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <p>Faça login para participar da conversa</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
