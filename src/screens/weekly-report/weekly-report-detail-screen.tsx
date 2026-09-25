import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import {
  AppButton,
  AppHeader,
  AppInput,
  AppText,
  BottomSheet,
  FormSection,
  RecordActions,
  Screen,
  StateView,
  StatusPill,
} from '@/components'
import { useSessionStore } from '@/core/session/session-store'
import {
  useSubmitReport,
  useUpdateNextPlan,
  useWeeklyReport,
} from '@/hooks/use-weekly-reports'
import { formatDate, formatDateOnly } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.weeklyReports
const f = text.fields

/**
 * Тайлан унших. Эзэн нь ноорог бол засаж/илгээнэ, илгээсэн бол зөвхөн
 * дараагийн төлөвлөгөөг засна (вэбийн `canEdit` / `canEditNextPlan`).
 */
export function WeeklyReportDetailScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const userId = useSessionStore((store) => store.user?.id)
  const query = useWeeklyReport(id)
  const submit = useSubmitReport()
  const updatePlan = useUpdateNextPlan(id)
  const [planDraft, setPlanDraft] = useState<string | null>(null)

  const report = query.data
  const isOwner = report !== undefined && report.authorId === userId
  const canEdit = isOwner && report.status === 'DRAFT'
  const canEditPlan = isOwner && report.status === 'SUBMITTED'

  return (
    <Screen>
      <AppHeader
        title={report?.title ?? text.title}
        subtitle={
          report
            ? `${formatDateOnly(report.weekStart)} – ${formatDateOnly(report.weekEnd)}`
            : undefined
        }
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
        actions={
          canEdit
            ? [
                {
                  icon: 'edit',
                  label: text.edit,
                  onPress: () =>
                    router.push({
                      pathname: '/office/weekly-reports/[id]/edit',
                      params: { id },
                    }),
                },
              ]
            : []
        }
      />
      <StateView
        loading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      >
        {report ? (
          <ScrollView
            contentContainerClassName="gap-5 pb-10"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-row flex-wrap items-center gap-2">
              <StatusPill
                label={text.statuses[report.status]}
                tone={report.status === 'SUBMITTED' ? 'success' : 'warning'}
              />
              <AppText variant="caption">
                {[
                  report.author?.email,
                  report.submittedAt
                    ? formatDate(report.submittedAt, 'MM/DD HH:mm')
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </AppText>
            </View>

            <FormSection
              title={`${f.completedWork} · ${report.completedWork.length}`}
            >
              {report.completedWork.map((line, index) => (
                <View key={`${index}-${line}`} className="flex-row gap-2">
                  <AppText variant="body" className="text-muted-foreground">
                    •
                  </AppText>
                  <AppText variant="body" selectable className="flex-1">
                    {line}
                  </AppText>
                </View>
              ))}
            </FormSection>

            <FormSection title={f.nextPlan}>
              <AppText variant="body" selectable>
                {report.nextPlan}
              </AppText>
              {canEditPlan ? (
                <AppButton
                  label={text.editNextPlan}
                  icon="edit"
                  variant="secondary"
                  size="md"
                  onPress={() => setPlanDraft(report.nextPlan)}
                />
              ) : null}
            </FormSection>

            {canEdit ? (
              <RecordActions
                actions={[
                  {
                    key: 'submit',
                    label: text.submit,
                    icon: 'send',
                    confirm: {
                      title: text.submit,
                      description: text.submitConfirm,
                    },
                    run: async () => {
                      await submit.mutateAsync(report.id)
                      router.dismissTo('/office/weekly-reports')
                    },
                  },
                ]}
              />
            ) : null}
          </ScrollView>
        ) : null}
      </StateView>

      <BottomSheet
        visible={planDraft !== null}
        title={text.editNextPlan}
        onClose={() => setPlanDraft(null)}
      >
        <AppInput
          value={planDraft ?? ''}
          onChangeText={setPlanDraft}
          multiline
          autoFocus
        />
        <AppButton
          label={messages.form.save}
          icon="check"
          disabled={!planDraft?.trim()}
          onPress={async () => {
            await updatePlan.mutateAsync(planDraft ?? '')
            setPlanDraft(null)
          }}
        />
      </BottomSheet>
    </Screen>
  )
}
