import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { JobsProvider } from "@/contexts/jobs-context"
import { ChatProvider } from "@/contexts/chat-context"

export const metadata: Metadata = {
  title: "TechJobs - Vagas em Tecnologia",
  description: "Plataforma de vagas de emprego para área de computação",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <JobsProvider>
            <ChatProvider>{children}</ChatProvider>
          </JobsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
