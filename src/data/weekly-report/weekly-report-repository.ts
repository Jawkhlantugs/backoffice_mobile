import { clients } from '@/core/network/clients'
import { unwrap, type ListPage, type PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toAuthor,
  toReportWrite,
  toWeeklyReport,
  type ReportAuthorDto,
  type WeeklyReportDto,
} from './weekly-report-dto'
import type {
  ReportAuthor,
  WeeklyReport,
  WeeklyReportInput,
} from './weekly-report-model'

const BASE = '/admin/weekly-reports'

export type WeeklyReportFilters = {
  status?: string
  department?: string
  adminUserId?: string
}

/** Endpoint: `office/weekly-reports.service.ts` — `{backoffice}/admin/weekly-reports…`. */
export const weeklyReportRepository = {
  list: (
    params: PageParams & WeeklyReportFilters,
  ): Promise<ListPage<WeeklyReport>> =>
    fetchList(clients.backoffice, `${BASE}/list`, params, toWeeklyReport),

  async authors(department: string): Promise<ReportAuthor[]> {
    const response = await clients.backoffice.get(`${BASE}/authors`, {
      params: { department },
    })
    return unwrap<ReportAuthorDto[]>(response.data).map(toAuthor)
  },

  async byId(id: string): Promise<WeeklyReport> {
    const response = await clients.backoffice.get(`${BASE}/${id}`)
    return toWeeklyReport(unwrap<WeeklyReportDto>(response.data))
  },

  async create(input: WeeklyReportInput): Promise<WeeklyReport> {
    const response = await clients.backoffice.post(BASE, toReportWrite(input))
    return toWeeklyReport(unwrap<WeeklyReportDto>(response.data))
  },

  async update(id: string, input: WeeklyReportInput): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}`, toReportWrite(input))
  },

  /** Илгээсний дараа зөвхөн дараагийн төлөвлөгөөг засна (вэбийн `canEditNextPlan`). */
  async updateNextPlan(id: string, nextPlan: string): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}/next-plan`, {
      nextPlan: nextPlan.trim(),
    })
  },

  async submit(id: string): Promise<void> {
    await clients.backoffice.post(`${BASE}/${id}/submit`)
  },
}
