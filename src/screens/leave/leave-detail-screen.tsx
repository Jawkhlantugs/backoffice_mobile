import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppText,
  ConfirmSheet,
  InfoRow,
  Screen,
  StateView,
} from '@/components'
import type { LeaveRequest } from '@/data/leave-request/leave-request-model'
import {
  useLeaveRequest,
  useReviewLeaveRequest,
} from '@/hooks/use-leave-requests'
import { formatDate } from '@/lib/date'
import { messages, translateUnknownError } from '@/lib/messages'

import { LeaveStatusPill } from './leave-status-pill'

type Decision = 'APPROVED' | 'REJECTED'

function periodLabel(request: LeaveRequest): string {
  const range =
    request.startDate === request.endDate
      ? request.startDate
      : `${request.startDate} → ${request.endDate}`

  return request.unit === 'hour'
    ? `${range} ${request.startTime ?? ''}–${request.endTime ?? ''}`.trim()
    : range
}

export function LeaveDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const query = useLeaveRequest(id ?? '')
  const review = useReviewLeaveRequest()
  const [decision, setDecision] = useState<Decision | null>(null)

  const request = query.data

  return (
    <Screen>
      <AppHeader
        title={messages.leave.title}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
        right={
          request ? <LeaveStatusPill status={request.status} /> : undefined
        }
      />

      <ScrollView contentContainerClassName="gap-4 pb-8">
        <StateView
          loading={query.isPending}
          error={query.error}
          onRetry={() => query.refetch()}
        >
          {request ? (
            <>
              <AppCard className="gap-3">
                <InfoRow
                  label={messages.leave.requester}
                  value={request.requester}
                />
                {request.department ? (
                  <InfoRow
                    label={messages.leave.department}
                    value={request.department}
                  />
                ) : null}
                <InfoRow
                  label={messages.leave.type}
                  value={messages.leave.types[request.type]}
                />
                <InfoRow
                  label={messages.leave.period}
                  value={periodLabel(request)}
                />
                <InfoRow
                  label={messages.leave.sentAt}
                  value={formatDate(request.createdAt)}
                />
                {request.reviewer ? (
                  <InfoRow
                    label={messages.leave.reviewer}
                    value={request.reviewer}
                  />
                ) : null}
              </AppCard>

              <AppCard className="gap-2">
                <AppText variant="label">{messages.leave.reason}</AppText>
                <AppText variant="body">{request.reason || '—'}</AppText>
              </AppCard>

              {request.reviewNote ? (
                <AppCard className="gap-2">
                  <AppText variant="label">{messages.leave.reviewNote}</AppText>
                  <AppText variant="body">{request.reviewNote}</AppText>
                </AppCard>
              ) : null}

              {review.error ? (
                <AppText
                  variant="body"
                  className="text-center text-destructive"
                >
                  {translateUnknownError(review.error)}
                </AppText>
              ) : null}

              {/* Шийдвэрлэсэн хүсэлтэд товч харуулахгүй — API дахин
                  шийдвэрлэхийг зөвшөөрдөггүй. */}
              {request.status === 'PENDING' ? (
                <View className="gap-2">
                  <AppButton
                    label={messages.leave.approve}
                    loading={review.isPending}
                    onPress={() => setDecision('APPROVED')}
                  />
                  <AppButton
                    label={messages.leave.reject}
                    variant="secondary"
                    loading={review.isPending}
                    onPress={() => setDecision('REJECTED')}
                  />
                </View>
              ) : null}
            </>
          ) : null}
        </StateView>
      </ScrollView>

      <ConfirmSheet
        visible={decision !== null && request !== undefined}
        title={
          decision === 'REJECTED'
            ? messages.leave.rejectTitle
            : messages.leave.approveTitle
        }
        description={
          request
            ? `${request.requester} · ${
                messages.leave.types[request.type]
              } · ${periodLabel(request)}`
            : ''
        }
        reason={{
          label: messages.leave.reviewNote,
          // Татгалзах нь ажилтанд тайлбар хэрэгтэй — заавал.
          required: decision === 'REJECTED',
          placeholder: messages.leave.reviewNotePlaceholder,
        }}
        destructive={decision === 'REJECTED'}
        confirmLabel={
          decision === 'REJECTED'
            ? messages.leave.reject
            : messages.leave.approve
        }
        onCancel={() => setDecision(null)}
        onConfirm={async (note) => {
          if (!decision || !request) return
          await review.mutateAsync({ id: request.id, decision, note })
          setDecision(null)
        }}
      />
    </Screen>
  )
}
