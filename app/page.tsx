import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MessageSquare, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">TechJobs</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Conectando Talentos em Tecnologia</h2>
          <p className="text-xl text-muted-foreground mb-8">
            A plataforma ideal para encontrar as melhores oportunidades em computação e conectar empregadores com
            candidatos qualificados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/jobs">
              <Button size="lg" className="w-full sm:w-auto">
                Ver Vagas Disponíveis
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Publicar Vaga
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">Como Funciona</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Briefcase className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Publique Vagas</CardTitle>
                <CardDescription>
                  Empregadores podem cadastrar vagas com descrição detalhada e requisitos específicos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Encontre Talentos</CardTitle>
                <CardDescription>
                  Candidatos podem navegar pelas oportunidades e se candidatar às vagas de interesse
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Converse Diretamente</CardTitle>
                <CardDescription>
                  Sistema de chat integrado para comunicação pública e privada entre partes interessadas
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 TechJobs. Conectando o futuro da tecnologia.</p>
        </div>
      </footer>
    </div>
  )
}
