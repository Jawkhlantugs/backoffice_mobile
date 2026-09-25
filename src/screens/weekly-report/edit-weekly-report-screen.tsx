import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

import { toast } from '@/core/ui/toast-store'
import {
  emptyReport,
  reportToInput,
} from '@/data/weekly-report/weekly-report-model'
import { useUpdateReport, useWeeklyReport } from '@/hooks/use-weekly-reports'
import { messages } from '@/lib/messages'

import { WeeklyReportForm } from './weekly-report-form'

export function EditWeeklyReportScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const report = useWeeklyReport(id)
  const update = useUpdateReport(id)
  const initial = useMemo(
    () => (report.data ? reportToInput(report.data) : emptyReport()),
    [report.data],
  )

  return (
    <WeeklyReportForm
      title={messages.weeklyReports.edit}
      initial={initial}
      submitLabel={messages.form.save}
      loading={report.isPending}
      error={report.error}
      onRetry={() => report.refetch()}
      onSubmit={async (input) => {
        await update.mutateAsync(input)
        toast.success(messages.form.saved)
        router.dismissTo('/office/weekly-reports')
      }}
    />
  )
}
