"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useJobs } from "@/contexts/jobs-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, MoreVertical, Edit, Trash2, Eye, Briefcase } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const { myJobs, deleteJob, isLoading } = useJobs()
  const { toast } = useToast()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (confirm(`Tem certeza que deseja excluir a vaga "${jobTitle}"?`)) {
      try {
        await deleteJob(jobId)
        toast({
          title: "Vaga excluída",
          description: "A vaga foi removida com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir vaga",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {user.type === "employer" ? "Gerencie suas vagas publicadas" : "Acompanhe suas candidaturas"}
            </p>
          </div>

          {user.type === "employer" && (
            <Link href="/jobs/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Vaga
              </Button>
            </Link>
          )}
        </div>

        {user.type === "employer" ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{myJobs.length}</div>
                    <div className="text-sm text-muted-foreground">Vagas Publicadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Candidaturas Recebidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Conversas Ativas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Minhas Vagas</CardTitle>
                <CardDescription>Gerencie as vagas que você publicou</CardDescription>
              </CardHeader>
              <CardContent>
                {myJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma vaga publicada</h3>
                    <p className="text-muted-foreground mb-4">Comece publicando sua primeira vaga de emprego</p>
                    <Link href="/jobs/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Publicar Primeira Vaga
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{job.title}</h3>
                              <Badge variant="secondary">{getTypeLabel(job.type)}</Badge>
                              <Badge variant="outline">{getLevelLabel(job.level)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                            <p className="text-sm text-muted-foreground">
                              Publicada em {job.createdAt.toLocaleDateString("pt-BR")}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/jobs/${job.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Visualizar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/jobs/${job.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteJob(job.id, job.title)}
                                className="text-destructive"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Painel do Candidato</CardTitle>
              <CardDescription>Acompanhe suas candidaturas e conversas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Explore as vagas disponíveis</h3>
                <p className="text-muted-foreground mb-4">Encontre oportunidades incríveis na área de tecnologia</p>
                <Link href="/jobs">
                  <Button>Ver Vagas Disponíveis</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
