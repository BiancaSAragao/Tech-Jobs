"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Job, JobFormData } from "@/types/job"
import { useAuth } from "@/contexts/auth-context"

interface JobsContextType {
  jobs: Job[]
  myJobs: Job[]
  createJob: (jobData: JobFormData) => Promise<string>
  updateJob: (id: string, jobData: JobFormData) => Promise<boolean>
  deleteJob: (id: string) => Promise<boolean>
  getJobById: (id: string) => Job | undefined
  isLoading: boolean
}

const JobsContext = createContext<JobsContextType | undefined>(undefined)

export function JobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Load jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem("techJobs_jobs")
    if (storedJobs) {
      const parsedJobs = JSON.parse(storedJobs).map((job: any) => ({
        ...job,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt),
      }))
      setJobs(parsedJobs)
    }
  }, [])

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("techJobs_jobs", JSON.stringify(jobs))
    }
  }, [jobs])

  const createJob = async (jobData: JobFormData): Promise<string> => {
    if (!user || user.type !== "employer") {
      throw new Error("Only employers can create jobs")
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      ...jobData,
      requirements: jobData.requirements.split("\n").filter((req) => req.trim() !== ""),
      employerId: user.id,
      employerName: user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setJobs((prev) => [newJob, ...prev])
    setIsLoading(false)
    return newJob.id
  }

  const updateJob = async (id: string, jobData: JobFormData): Promise<boolean> => {
    if (!user || user.type !== "employer") {
      throw new Error("Only employers can update jobs")
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setJobs((prev) =>
      prev.map((job) =>
        job.id === id && job.employerId === user.id
          ? {
              ...job,
              ...jobData,
              requirements: jobData.requirements.split("\n").filter((req) => req.trim() !== ""),
              updatedAt: new Date(),
            }
          : job,
      ),
    )

    setIsLoading(false)
    return true
  }

  const deleteJob = async (id: string): Promise<boolean> => {
    if (!user || user.type !== "employer") {
      throw new Error("Only employers can delete jobs")
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setJobs((prev) => prev.filter((job) => !(job.id === id && job.employerId === user.id)))

    setIsLoading(false)
    return true
  }

  const getJobById = (id: string): Job | undefined => {
    return jobs.find((job) => job.id === id)
  }

  const myJobs = jobs.filter((job) => user && job.employerId === user.id)

  return (
    <JobsContext.Provider
      value={{
        jobs,
        myJobs,
        createJob,
        updateJob,
        deleteJob,
        getJobById,
        isLoading,
      }}
    >
      {children}
    </JobsContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobsContext)
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobsProvider")
  }
  return context
}
