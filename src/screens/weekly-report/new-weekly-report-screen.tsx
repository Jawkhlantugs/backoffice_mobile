import { useMemo } from 'react'
import { useRouter } from 'expo-router'

import { toast } from '@/core/ui/toast-store'
import { emptyReport } from '@/data/weekly-report/weekly-report-model'
import { useCreateReport } from '@/hooks/use-weekly-reports'
import { messages } from '@/lib/messages'

import { WeeklyReportForm } from './weekly-report-form'

/** Ноорог болж хадгалагдаад жагсаалт руу буцна — илгээхийг дэлгэрэнгүйгээс. */
export function NewWeeklyReportScreen() {
  const router = useRouter()
  const create = useCreateReport()
  const initial = useMemo(() => emptyReport(), [])

  return (
    <WeeklyReportForm
      title={messages.weeklyReports.new}
      initial={initial}
      submitLabel={messages.form.save}
      onSubmit={async (input) => {
        await create.mutateAsync(input)
        toast.success(messages.form.saved)
        router.dismissTo('/office/weekly-reports')
      }}
    />
  )
}
