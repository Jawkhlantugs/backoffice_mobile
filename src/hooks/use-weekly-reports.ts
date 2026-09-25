import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { WeeklyReportInput } from '@/data/weekly-report/weekly-report-model'
import {
  weeklyReportRepository,
  type WeeklyReportFilters,
} from '@/data/weekly-report/weekly-report-repository'

import { usePagedList } from './use-paged-list'

const KEY = 'weekly-reports'

export const useWeeklyReports = (
  search: string,
  filters: WeeklyReportFilters,
) => usePagedList(KEY, weeklyReportRepository.list, { search, filters })

export function useWeeklyReport(id: string) {
  return useQuery({
    queryKey: [KEY, 'detail', id],
    queryFn: () => weeklyReportRepository.byId(id),
    enabled: id.length > 0,
  })
}

export function useReportAuthors(department: string | undefined) {
  return useQuery({
    queryKey: [KEY, 'authors', department],
    queryFn: () => weeklyReportRepository.authors(department ?? ''),
    enabled: Boolean(department),
  })
}

function useReportMutation<T, R>(fn: (input: T) => Promise<R>) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: fn,
    // Promise буцаана — `mutateAsync` жагсаалт шинэчлэгдтэл хүлээж, буцахад
    // хуучин мөр анивчихгүй.
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  })
}

export const useCreateReport = () =>
  useReportMutation((input: WeeklyReportInput) =>
    weeklyReportRepository.create(input),
  )
export const useUpdateReport = (id: string) =>
  useReportMutation((input: WeeklyReportInput) =>
    weeklyReportRepository.update(id, input),
  )
export const useUpdateNextPlan = (id: string) =>
  useReportMutation((nextPlan: string) =>
    weeklyReportRepository.updateNextPlan(id, nextPlan),
  )
export const useSubmitReport = () =>
  useReportMutation((id: string) => weeklyReportRepository.submit(id))
