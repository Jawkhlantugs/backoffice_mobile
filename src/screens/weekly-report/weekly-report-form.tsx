import { useState } from 'react'

import { AppInput, FormScreen, FormSection } from '@/components'
import {
  validateReport,
  type ReportField,
  type WeeklyReportInput,
} from '@/data/weekly-report/weekly-report-model'
import { messages } from '@/lib/messages'

import { CompletedWorkEditor } from './completed-work-editor'
import { TaskPickerSheet } from './task-picker-sheet'
import { WeekRangeField } from './week-range-field'

const text = messages.weeklyReports
const f = text.fields

/**
 * Вэбийн `weekly-report-form.tsx`-тэй ижил 4 хэсэг: долоо хоног, гарчиг,
 * хийсэн ажил (мөр мөрөөр + даалгавраас), дараагийн төлөвлөгөө.
 */
export function WeeklyReportForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  loading,
  error,
  onRetry,
}: {
  title: string
  initial: WeeklyReportInput
  submitLabel: string
  onSubmit: (input: WeeklyReportInput) => Promise<void>
  loading?: boolean
  error?: unknown
  onRetry?: () => void
}) {
  const [input, setInput] = useState(initial)
  const [missing, setMissing] = useState<ReportField[]>([])
  const [picking, setPicking] = useState(false)

  const [source, setSource] = useState(initial)
  if (initial !== source) {
    setSource(initial)
    setInput(initial)
  }

  const set = <K extends keyof WeeklyReportInput>(
    key: K,
    value: WeeklyReportInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }))
  const err = (field: ReportField) =>
    missing.includes(field) ? text.required : undefined

  function addFromTasks(titles: string[]) {
    // Хоосон мөрүүдийг даалгаврын гарчгаар орлуулна — "1." хоосон үлдэхгүй.
    const filled = input.completedWork.filter((item) => item.trim())
    set('completedWork', [...filled, ...titles])
  }

  async function submit() {
    const found = validateReport(input)
    setMissing(found)
    if (found.length === 0) await onSubmit(input)
  }

  return (
    <FormScreen
      title={title}
      submitLabel={submitLabel}
      onSubmit={submit}
      loading={loading}
      error={error}
      onRetry={onRetry}
    >
      <FormSection title={f.week} hint={f.weekHint}>
        <WeekRangeField
          weekStart={input.weekStart}
          weekEnd={input.weekEnd}
          onChange={(range) =>
            setInput((current) => ({ ...current, ...range }))
          }
        />
      </FormSection>

      <FormSection title={f.title} hint={f.titleHint}>
        <AppInput
          value={input.title}
          onChangeText={(value) => set('title', value)}
          placeholder={f.titlePlaceholder}
          error={err('title')}
        />
      </FormSection>

      <FormSection title={f.completedWork} hint={f.completedHint}>
        <CompletedWorkEditor
          items={input.completedWork}
          onChange={(items) => set('completedWork', items)}
          onPickTasks={() => setPicking(true)}
          error={err('completedWork')}
        />
      </FormSection>

      <FormSection title={f.nextPlan} hint={f.nextPlanHint}>
        <AppInput
          value={input.nextPlan}
          onChangeText={(value) => set('nextPlan', value)}
          placeholder={f.nextPlanPlaceholder}
          multiline
          error={err('nextPlan')}
        />
      </FormSection>

      <TaskPickerSheet
        visible={picking}
        existing={input.completedWork}
        onSelect={addFromTasks}
        onClose={() => setPicking(false)}
      />
    </FormScreen>
  )
}
