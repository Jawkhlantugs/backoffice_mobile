import dayjs from 'dayjs'

/** `weekly-reports.types.ts`. */
export const WEEKLY_REPORT_STATUSES = ['DRAFT', 'SUBMITTED'] as const
export type WeeklyReportStatus = (typeof WEEKLY_REPORT_STATUSES)[number]

/** Вэбийн `constants/admin-departments.ts` — хэлтсээр харахад. */
export const ADMIN_DEPARTMENTS = [
  'Finance',
  'Marketing',
  'Tech',
  'Operations',
  'Compliance',
  'Support',
] as const

export type ReportAuthor = { id: string; email: string; department?: string }

export type WeeklyReport = {
  id: string
  authorId: string
  author?: ReportAuthor
  weekStart: string
  weekEnd: string
  title: string
  summary: string
  /** Мөр бүр нэг ажил (`- ` угтваргүй). */
  completedWork: string[]
  nextPlan: string
  blockers: string
  status: WeeklyReportStatus
  submittedAt?: string
  createdAt: string
}

/**
 * Вэбийн `weekly-report-form.tsx`-ийн талбарууд. `summary` формд харагддаггүй
 * ч засахад хуучин утгыг нь буцааж явуулдаг (вэб `values`-ийг бүтнээр нь).
 * `blockers` вэб формд байхгүй тул mobile ч илгээхгүй.
 */
export type WeeklyReportInput = {
  weekStart: string
  weekEnd: string
  title: string
  /** Мөр бүр нэг ажил — вэб шиг нэг нэгээр нэмнэ. */
  completedWork: string[]
  nextPlan: string
  summary: string
}

const DAY_FORMAT = 'YYYY-MM-DD'
const DAYS_IN_WEEK = 6

/** Вэбийн `getCurrentWeekRange`: Даваа → Ням. */
export function currentWeek(today = dayjs()): {
  weekStart: string
  weekEnd: string
} {
  const offsetToMonday = today.day() === 0 ? -6 : 1 - today.day()
  const start = today.add(offsetToMonday, 'day')
  return {
    weekStart: start.format(DAY_FORMAT),
    weekEnd: start.add(DAYS_IN_WEEK, 'day').format(DAY_FORMAT),
  }
}

/** Вэбийн шинэ формтой ижил: энэ долоо хоног, хоосон нэг мөр. */
export function emptyReport(): WeeklyReportInput {
  return {
    ...currentWeek(),
    title: '',
    completedWork: [''],
    nextPlan: '',
    summary: '',
  }
}

/** Сонгосон өдрийг агуулсан долоо хоног (Даваа → Ням). */
export function weekOf(date: string): { weekStart: string; weekEnd: string } {
  return currentWeek(dayjs(date))
}

export function reportToInput(report: WeeklyReport): WeeklyReportInput {
  return {
    weekStart: report.weekStart.slice(0, 10),
    weekEnd: report.weekEnd.slice(0, 10),
    title: report.title,
    completedWork:
      report.completedWork.length > 0 ? report.completedWork : [''],
    nextPlan: report.nextPlan,
    summary: report.summary,
  }
}

/** Вэбийн `splitCompletedWork`: `- ` / `* ` угтварыг хасаж, хоосон мөргүй. */
export function splitCompletedWork(value: string | undefined | null): string[] {
  return (value ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean)
}

/** API руу: хоосон мөргүй, мөр бүр `- ` угтвартай (вэбийн `normalizedCompletedWork`). */
export function joinCompletedWork(items: readonly string[]): string {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join('\n')
}

export type ReportField =
  'weekStart' | 'weekEnd' | 'title' | 'completedWork' | 'nextPlan'

/** Вэбийн шалгалт: огноо хоёр, гарчиг, хийсэн ажил, төлөвлөгөө заавал. */
export function validateReport(input: WeeklyReportInput): ReportField[] {
  const missing: ReportField[] = []
  if (!input.weekStart) missing.push('weekStart')
  if (!input.weekEnd) missing.push('weekEnd')
  if (!input.title.trim()) missing.push('title')
  if (!joinCompletedWork(input.completedWork)) missing.push('completedWork')
  if (!input.nextPlan.trim()) missing.push('nextPlan')
  return missing
}
