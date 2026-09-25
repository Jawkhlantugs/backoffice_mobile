import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppInput,
  AppText,
  ConfirmSheet,
  InfoRow,
  Screen,
  SegmentedControl,
  StateView,
} from '@/components'
import type { ComplianceCaseResolution } from '@/data/compliance-case/compliance-case-model'
import {
  useAddCaseNote,
  useAssignCase,
  useCloseCase,
  useComplianceCase,
  useComplianceCaseEvents,
  useReopenCase,
} from '@/hooks/use-compliance-cases'
import { formatDate } from '@/lib/date'
import { messages, translateUnknownError } from '@/lib/messages'

import { ComplianceCaseStatusPill } from './compliance-case-status-pill'

type Action = 'close' | 'reopen' | null

export function ComplianceCaseDetailScreen() {
  const router = useRouter()
  const { uid, caseId } = useLocalSearchParams<{
    uid: string
    caseId: string
  }>()
  const scopedUid = uid ?? ''
  const scopedCaseId = caseId ?? ''

  const query = useComplianceCase(scopedUid, scopedCaseId)
  const eventsQuery = useComplianceCaseEvents(scopedUid, scopedCaseId)
  const addNote = useAddCaseNote(scopedUid, scopedCaseId)
  const assign = useAssignCase(scopedUid, scopedCaseId)
  const close = useCloseCase(scopedUid, scopedCaseId)
  const reopen = useReopenCase(scopedUid, scopedCaseId)

  const [noteDraft, setNoteDraft] = useState('')
  const [analystDraft, setAnalystDraft] = useState('')
  const [resolution, setResolution] =
    useState<ComplianceCaseResolution>('FALSE_POSITIVE')
  const [action, setAction] = useState<Action>(null)

  const item = query.data
  const events = eventsQuery.data?.items ?? []

  return (
    <Screen>
      <AppHeader
        title={messages.complianceCases.detailTitle}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
        right={
          item ? <ComplianceCaseStatusPill status={item.status} /> : undefined
        }
      />

      <ScrollView contentContainerClassName="gap-4 pb-8">
        <StateView
          loading={query.isPending}
          error={query.error}
          onRetry={() => query.refetch()}
        >
          {item ? (
            <>
              <AppCard className="gap-3">
                <AppText variant="label">
                  {item.caseType || item.caseId}
                </AppText>
                <InfoRow
                  label={messages.complianceCases.caseCategory}
                  value={item.caseCategory}
                />
                {item.triggerSource ? (
                  <InfoRow
                    label={messages.complianceCases.triggerSource}
                    value={item.triggerSource}
                  />
                ) : null}
                {item.riskScore !== undefined ? (
                  <InfoRow
                    label={messages.complianceCases.riskScore}
                    value={String(item.riskScore)}
                  />
                ) : null}
                {item.assignedAnalyst ? (
                  <InfoRow
                    label={messages.complianceCases.assignedAnalyst}
                    value={item.assignedAnalyst}
                  />
                ) : null}
                <InfoRow
                  label={messages.complianceCases.createdAt}
                  value={formatDate(item.createdAt)}
                />
              </AppCard>

              {item.notes ? (
                <AppCard className="gap-2">
                  <AppText variant="label">
                    {messages.complianceCases.notes}
                  </AppText>
                  <AppText variant="body">{item.notes}</AppText>
                </AppCard>
              ) : null}

              {item.status !== 'CLOSED' ? (
                <>
                  <AppCard className="gap-3">
                    <AppText variant="label">
                      {messages.complianceCases.assign}
                    </AppText>
                    <AppInput
                      placeholder={messages.complianceCases.assignPlaceholder}
                      value={analystDraft}
                      onChangeText={setAnalystDraft}
                      autoCapitalize="none"
                    />
                    <AppButton
                      label={messages.complianceCases.assign}
                      variant="secondary"
                      disabled={analystDraft.trim().length === 0}
                      onPress={async () => {
                        await assign.mutateAsync(analystDraft.trim())
                        setAnalystDraft('')
                      }}
                    />
                  </AppCard>

                  <AppCard className="gap-3">
                    <AppText variant="label">
                      {messages.complianceCases.addNote}
                    </AppText>
                    <AppInput
                      placeholder={messages.complianceCases.addNotePlaceholder}
                      value={noteDraft}
                      onChangeText={setNoteDraft}
                      multiline
                    />
                    <AppButton
                      label={messages.complianceCases.addNote}
                      variant="secondary"
                      disabled={noteDraft.trim().length === 0}
                      onPress={async () => {
                        await addNote.mutateAsync(noteDraft.trim())
                        setNoteDraft('')
                      }}
                    />
                  </AppCard>

                  <AppCard className="gap-3">
                    <AppText variant="label">
                      {messages.complianceCases.resolution}
                    </AppText>
                    <SegmentedControl<ComplianceCaseResolution>
                      value={resolution}
                      onChange={setResolution}
                      options={[
                        {
                          value: 'FALSE_POSITIVE',
                          label:
                            messages.complianceCases.resolutions.FALSE_POSITIVE,
                        },
                        {
                          value: 'CONFIRMED_MULE',
                          label:
                            messages.complianceCases.resolutions.CONFIRMED_MULE,
                        },
                      ]}
                    />
                    <AppButton
                      label={messages.complianceCases.close}
                      variant="destructive"
                      onPress={() => setAction('close')}
                    />
                  </AppCard>
                </>
              ) : (
                <AppButton
                  label={messages.complianceCases.reopen}
                  variant="secondary"
                  onPress={() => setAction('reopen')}
                />
              )}

              {addNote.error || assign.error ? (
                <AppText
                  variant="body"
                  className="text-center text-destructive"
                >
                  {translateUnknownError(addNote.error ?? assign.error)}
                </AppText>
              ) : null}

              <View className="gap-2">
                <AppText variant="label">
                  {messages.complianceCases.events}
                </AppText>
                {events.length === 0 ? (
                  <AppText variant="caption">
                    {messages.complianceCases.eventsEmpty}
                  </AppText>
                ) : (
                  events.map((event, index) => (
                    <AppCard key={index} className="gap-1">
                      <AppText variant="body" className="font-semibold">
                        {event.eventType}
                      </AppText>
                      {event.details ? (
                        <AppText variant="caption">{event.details}</AppText>
                      ) : null}
                      <AppText variant="tiny">
                        {formatDate(event.timestamp)}
                        {event.actor ? ` · ${event.actor}` : ''}
                      </AppText>
                    </AppCard>
                  ))
                )}
              </View>
            </>
          ) : null}
        </StateView>
      </ScrollView>

      <ConfirmSheet
        visible={action !== null}
        title={
          action === 'close'
            ? messages.complianceCases.closeTitle
            : messages.complianceCases.reopenTitle
        }
        description={item?.caseType ?? ''}
        reason={{
          label: messages.complianceCases.addNotePlaceholder,
          required: true,
        }}
        destructive={action === 'close'}
        confirmLabel={
          action === 'close'
            ? messages.complianceCases.close
            : messages.complianceCases.reopen
        }
        onCancel={() => setAction(null)}
        onConfirm={async (notes) => {
          if (!notes) return
          if (action === 'close') {
            await close.mutateAsync({ resolution, notes })
          } else if (action === 'reopen') {
            await reopen.mutateAsync(notes)
          }
          setAction(null)
        }}
      />
    </Screen>
  )
}
