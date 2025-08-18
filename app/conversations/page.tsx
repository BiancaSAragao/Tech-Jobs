"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { useJobs } from "@/contexts/jobs-context"
import { MessageSquare, Search, Briefcase } from "lucide-react"

export default function ConversationsPage() {
  const { user } = useAuth()
  const { privateMessages } = useChat()
  const { getJobById } = useJobs()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  // Group conversations by job and other user
  const conversations = useMemo(() => {
    const conversationMap = new Map<string, any>()

    privateMessages
      .filter((msg) => msg.senderId === user.id || msg.receiverId === user.id)
      .forEach((msg) => {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId
        const otherUserName = msg.senderId === user.id ? msg.receiverName : msg.senderName
        const key = `${msg.jobId}-${otherUserId}`

        if (!conversationMap.has(key)) {
          const job = getJobById(msg.jobId)
          conversationMap.set(key, {
            jobId: msg.jobId,
            jobTitle: job?.title || "Vaga não encontrada",
            otherUserId,
            otherUserName,
            otherUserType: msg.senderId === user.id ? "candidate" : "employer", // Infer type based on message direction
            lastMessage: msg,
            unreadCount: 0,
            messages: [],
          })
        }

        const conversation = conversationMap.get(key)
        conversation.messages.push(msg)

        // Update last message if this one is newer
        if (msg.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = msg
        }

        // Count unread messages (messages sent to me that are not read)
        if (msg.receiverId === user.id && !msg.isRead) {
          conversation.unreadCount++
        }
      })

    return Array.from(conversationMap.values()).sort(
      (a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime(),
    )
  }, [privateMessages, user.id, getJobById])

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [conversations, searchTerm])

  const formatLastMessageTime = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 2) {
      return "Ontem"
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  const getUserTypeLabel = (userType: "employer" | "candidate") => {
    return userType === "employer" ? "Empregador" : "Candidato"
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Minhas Conversas</h1>
            <p className="text-muted-foreground">Gerencie suas conversas privadas sobre vagas</p>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Conversations List */}
          {filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {conversations.length === 0 ? "Nenhuma conversa ainda" : "Nenhuma conversa encontrada"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {conversations.length === 0
                    ? "Inicie conversas com empregadores ou candidatos através das páginas de vagas"
                    : "Tente ajustar o termo de busca"}
                </p>
                <Link href="/jobs">
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Ver Vagas Disponíveis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <Card
                  key={`${conversation.jobId}-${conversation.otherUserId}`}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{conversation.otherUserName}</h3>
                          <Badge variant={conversation.otherUserType === "employer" ? "default" : "secondary"}>
                            {getUserTypeLabel(conversation.otherUserType)}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">Vaga: {conversation.jobTitle}</p>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground line-clamp-1 flex-1 mr-4">
                            {conversation.lastMessage.senderId === user.id ? "Você: " : ""}
                            {conversation.lastMessage.content}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatLastMessageTime(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Link href={`/jobs/${conversation.jobId}/chat/${conversation.otherUserId}`}>
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Abrir Chat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
