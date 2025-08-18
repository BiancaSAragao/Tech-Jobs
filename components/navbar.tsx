"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Briefcase, User, LogOut, Plus, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">TechJobs</h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/jobs">
            <Button variant="ghost">Vagas</Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/conversations">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Conversas
                </Button>
              </Link>

              {user.type === "employer" && (
                <Link href="/jobs/create">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Vaga
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
