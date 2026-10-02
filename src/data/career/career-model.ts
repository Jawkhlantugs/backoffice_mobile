/** `career.types.ts` — ажлын зар ба анкет. */
export const JOB_POSTING_STATUSES = ['ACTIVE', 'DRAFT', 'CLOSED'] as const
export const JOB_APPLICATION_STATUSES = [
  'NEW',
  'REVIEWED',
  'INTERVIEWING',
  'ACCEPTED',
  'REJECTED',
] as const
export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUSES)[number]

export type JobPosting = {
  id: string
  title: string
  department: string
  location: string
  employmentType: string
  salary?: string
  status: string
  position?: number
  createdAt?: number
}

export type JobApplication = {
  id: string
  name: string
  email: string
  phone: string
  postingId: string
  motivation?: string
  cvFileName?: string
  status: string
  notes: number
  createdAt?: number
}
