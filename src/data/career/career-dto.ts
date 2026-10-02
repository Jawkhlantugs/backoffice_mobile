import type { JobApplication, JobPosting } from './career-model'

export type JobPostingDto = {
  id: string
  title?: string
  department?: string
  location?: string
  employmentType?: string
  salary?: string
  status?: string
  position?: number
  createdAt?: number
}

export type JobApplicationDto = {
  id: string
  jobPostingId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  motivation?: string
  cvFileName?: string
  status?: string
  notes?: unknown[]
  createdAt?: number
}

export function toJobPosting(dto: JobPostingDto): JobPosting {
  return {
    id: dto.id,
    title: dto.title ?? '',
    department: dto.department ?? '',
    location: dto.location ?? '',
    employmentType: dto.employmentType ?? '',
    salary: dto.salary || undefined,
    status: dto.status ?? '',
    position: dto.position,
    createdAt: dto.createdAt,
  }
}

export function toJobApplication(dto: JobApplicationDto): JobApplication {
  return {
    id: dto.id,
    name: [dto.firstName, dto.lastName].filter(Boolean).join(' '),
    email: dto.email ?? '',
    phone: dto.phone ?? '',
    postingId: dto.jobPostingId ?? '',
    motivation: dto.motivation || undefined,
    cvFileName: dto.cvFileName || undefined,
    status: dto.status ?? '',
    notes: dto.notes?.length ?? 0,
    createdAt: dto.createdAt,
  }
}
