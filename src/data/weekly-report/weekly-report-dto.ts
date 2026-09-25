import {
  joinCompletedWork,
  splitCompletedWork,
  type ReportAuthor,
  type WeeklyReport,
  type WeeklyReportInput,
} from './weekly-report-model'

export type ReportAuthorDto = {
  id: string
  email?: string
  department?: string | null
}

export type WeeklyReportDto = {
  id: string
  adminUserId?: string
  adminUser?: ReportAuthorDto | null
  weekStart?: string
  weekEnd?: string
  title?: string
  summary?: string
  completedWork?: string
  nextPlan?: string
  blockers?: string
  status?: string
  submittedAt?: string | null
  created_at?: string
}

export function toAuthor(dto: ReportAuthorDto): ReportAuthor {
  return {
    id: dto.id,
    email: dto.email ?? dto.id,
    department: dto.department ?? undefined,
  }
}

export function toWeeklyReport(dto: WeeklyReportDto): WeeklyReport {
  return {
    id: dto.id,
    authorId: dto.adminUserId ?? '',
    author: dto.adminUser ? toAuthor(dto.adminUser) : undefined,
    weekStart: dto.weekStart ?? '',
    weekEnd: dto.weekEnd ?? '',
    title: dto.title ?? '',
    summary: dto.summary ?? '',
    completedWork: splitCompletedWork(dto.completedWork),
    nextPlan: dto.nextPlan ?? '',
    blockers: dto.blockers ?? '',
    status: dto.status === 'SUBMITTED' ? 'SUBMITTED' : 'DRAFT',
    submittedAt: dto.submittedAt ?? undefined,
    createdAt: dto.created_at ?? '',
  }
}

/** Вэбийн payload — `{...values, summary, completedWork}`, `blockers`-гүй. */
export function toReportWrite(input: WeeklyReportInput) {
  return {
    weekStart: input.weekStart,
    weekEnd: input.weekEnd,
    title: input.title.trim(),
    summary: input.summary.trim(),
    completedWork: joinCompletedWork(input.completedWork),
    nextPlan: input.nextPlan.trim(),
  }
}
