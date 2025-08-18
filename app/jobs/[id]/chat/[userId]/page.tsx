"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { PrivateChat } from "@/components/private-chat"
import { useAuth } from "@/contexts/auth-context"
import { useJobs } from "@/contexts/jobs-context"
import { ArrowLeft } from "lucide-react"

export default function PrivateChatPage({ params }: { params: { id: string; userId: string } }) {
  const { user } = useAuth()
  const { getJobById } = useJobs()
  const router = useRouter()

  const job = getJobById(params.id)

  if (!user) {
    router.push("/login")
    return null
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Vaga não encontrada</h2>
              <p className="text-muted-foreground mb-4">A vaga que você está procurando não existe ou foi removida.</p>
              <Link href="/conversations">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Conversas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Determine other user info (this would normally come from an API)
  const otherUserId = params.userId
  const isEmployerChat = user.type === "candidate"
  const otherUserName = isEmployerChat ? job.employerName : "Candidato"
  const otherUserType = isEmployerChat ? "employer" : "candidate"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/conversations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Conversas
              </Button>
            </Link>
            <Link href={`/jobs/${job.id}`}>
              <Button variant="outline" size="sm">
                Ver Vaga
              </Button>
            </Link>
          </div>

          <PrivateChat
            jobId={job.id}
            jobTitle={job.title}
            otherUserId={otherUserId}
            otherUserName={otherUserName}
            otherUserType={otherUserType}
          />
        </div>
      </div>
    </div>
  )
}
