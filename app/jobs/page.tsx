"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useJobs } from "@/contexts/jobs-context"
import { Search, MapPin, Building, Clock, Briefcase } from "lucide-react"

export default function JobsPage() {
  const { jobs } = useJobs()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || job.type === typeFilter
      const matchesLevel = levelFilter === "all" || job.level === levelFilter

      return matchesSearch && matchesType && matchesLevel
    })
  }, [jobs, searchTerm, typeFilter, levelFilter])

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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hoje"
    if (diffDays === 2) return "Ontem"
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vagas em Tecnologia</h1>
          <p className="text-muted-foreground">Encontre as melhores oportunidades na área de computação</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vagas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de vaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="full-time">Tempo Integral</SelectItem>
                  <SelectItem value="part-time">Meio Período</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="internship">Estágio</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="junior">Júnior</SelectItem>
                  <SelectItem value="mid">Pleno</SelectItem>
                  <SelectItem value="senior">Sênior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                  setLevelFilter("all")
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredJobs.length} vaga{filteredJobs.length !== 1 ? "s" : ""} encontrada
            {filteredJobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">
                {jobs.length === 0
                  ? "Ainda não há vagas publicadas. Seja o primeiro a publicar!"
                  : "Tente ajustar os filtros para encontrar mais oportunidades."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/jobs/${job.id}`}>
                          <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        <Badge variant="secondary">{getTypeLabel(job.type)}</Badge>
                        <Badge variant="outline">{getLevelLabel(job.level)}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                          {formatDate(job.createdAt)}
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description.substring(0, 200)}
                        {job.description.length > 200 && "..."}
                      </p>

                      {job.salary && (
                        <div className="mb-4">
                          <span className="text-sm font-medium text-green-600">{job.salary}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requirements.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Link href={`/jobs/${job.id}`}>
                        <Button>Ver Detalhes</Button>
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
  )
}
