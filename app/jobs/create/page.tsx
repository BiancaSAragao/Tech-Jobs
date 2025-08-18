"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { useJobs } from "@/contexts/jobs-context"
import { useToast } from "@/hooks/use-toast"
import type { JobFormData } from "@/types/job"

export default function CreateJobPage() {
  const { user } = useAuth()
  const { createJob, isLoading } = useJobs()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: "",
    company: "",
    location: "",
    salary: "",
    type: "full-time",
    level: "mid",
  })

  // Redirect if not employer
  if (!user || user.type !== "employer") {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.requirements || !formData.company) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    try {
      const jobId = await createJob(formData)
      toast({
        title: "Vaga criada com sucesso!",
        description: "Sua vaga foi publicada e está disponível para candidatos.",
      })
      router.push(`/jobs/${jobId}`)
    } catch (error) {
      toast({
        title: "Erro ao criar vaga",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Publicar Nova Vaga</CardTitle>
              <CardDescription>Preencha as informações da vaga para atrair os melhores candidatos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Vaga *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Desenvolvedor React Sênior"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      placeholder="Nome da empresa"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo, SP"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Tempo Integral</SelectItem>
                        <SelectItem value="part-time">Meio Período</SelectItem>
                        <SelectItem value="contract">Contrato</SelectItem>
                        <SelectItem value="internship">Estágio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Nível</Label>
                    <Select value={formData.level} onValueChange={(value: any) => handleInputChange("level", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Júnior</SelectItem>
                        <SelectItem value="mid">Pleno</SelectItem>
                        <SelectItem value="senior">Sênior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salário (opcional)</Label>
                  <Input
                    id="salary"
                    placeholder="Ex: R$ 8.000 - R$ 12.000"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Vaga *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva as responsabilidades, benefícios e informações importantes sobre a vaga..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos *</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Liste os requisitos, um por linha:&#10;- React.js e TypeScript&#10;- 3+ anos de experiência&#10;- Conhecimento em Node.js"
                    rows={6}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Digite cada requisito em uma linha separada</p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Publicando..." : "Publicar Vaga"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
