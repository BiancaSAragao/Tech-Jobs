"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { PublicChat } from "@/components/public-chat"
import { useAuth } from "@/contexts/auth-context"
import { useJobs } from "@/contexts/jobs-context"
import { ArrowLeft, Building, MapPin, Clock, DollarSign, MessageSquare, Edit } from "lucide-react"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const { getJobById } = useJobs()
  const router = useRouter()

  const job = getJobById(params.id)

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Vaga não encontrada</h2>
              <p className="text-muted-foreground mb-4">A vaga que você está procurando não existe ou foi removida.</p>
              <Link href="/jobs">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar às Vagas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      "full-time": "Tempo Integral",
      "part-time": "Meio Período",
      contract: "Contrato",
      internship: "Estágio",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getLevelLabel = (level: string) => {
    const labels = {
      junior: "Júnior",
      mid: "Pleno",
      senior: "Sênior",
      lead: "Lead",
    }
    return labels[level as keyof typeof labels] || level
  }

  const isOwner = user && user.id === job.employerId

  const handleStartPrivateChat = () => {
    if (!user) return

    // For candidates chatting with employer, use employer's ID
    // For employers, this would need to be implemented differently (selecting which candidate)
    const otherUserId = user.type === "candidate" ? job.employerId : "candidate-id"
    router.push(`/jobs/${job.id}/chat/${otherUserId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar às Vagas
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{getTypeLabel(job.type)}</Badge>
                      <Badge variant="outline">{getLevelLabel(job.level)}</Badge>
                    </div>
                  </div>
                  {isOwner && (
                    <Link href={`/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Publicada em {job.createdAt.toLocaleDateString("pt-BR")}
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Tabs for Job Details and Chat */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalhes da Vaga</TabsTrigger>
                <TabsTrigger value="chat">Chat Público</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Descrição da Vaga</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requisitos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <PublicChat jobId={job.id} jobTitle={job.title} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Empresa</h4>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  {job.location && (
                    <div>
                      <h4 className="font-medium mb-1">Localização</h4>
                      <p className="text-muted-foreground">{job.location}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-1">Tipo de Contrato</h4>
                    <p className="text-muted-foreground">{getTypeLabel(job.type)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Nível</h4>
                    <p className="text-muted-foreground">{getLevelLabel(job.level)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Interessado na vaga?</CardTitle>
                  <CardDescription>Entre em contato com o empregador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user ? (
                    <>
                      <Button className="w-full" size="lg" onClick={handleStartPrivateChat}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Iniciar Conversa Privada
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Ou participe do chat público na aba ao lado
                      </p>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Faça login para entrar em contato com o empregador
                      </p>
                      <Link href="/login">
                        <Button className="w-full">Fazer Login</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Compartilhar Vaga</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    // You could add a toast here
                  }}
                >
                  Copiar Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
