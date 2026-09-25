import { View } from 'react-native'

import { AppCard, AppIcon, AppText, Avatar } from '@/components'
import type { LeaveRequest } from '@/data/leave-request/leave-request-model'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { LeaveStatusPill } from './leave-status-pill'

/** Хугацааг нэг мөрөнд: хоногоор бол огноо, цагаар бол огноо + цагийн зай. */
function periodLabel(request: LeaveRequest): string {
  if (request.unit === 'hour') {
    const from = request.startTime ?? ''
    const to = request.endTime ?? ''
    return `${request.startDate} ${from} → ${to}`.trim()
  }
  return request.startDate === request.endDate
    ? request.startDate
    : `${request.startDate} → ${request.endDate}`
}

export function LeaveRequestCard({
  request,
  onPress,
}: {
  request: LeaveRequest
  onPress: () => void
}) {
  return (
    <AppCard onPress={onPress} className="gap-3">
      <View className="flex-row items-center gap-3">
        <Avatar source={request.requester} size="sm" />

        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {request.requester}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {request.department ?? messages.leave.types[request.type]}
          </AppText>
        </View>

        <LeaveStatusPill status={request.status} />
      </View>

      <View className="flex-row items-center gap-2 rounded-lg bg-muted px-3 py-2">
        <AppIcon name="leave" size={iconSize.sm} tone="muted" />
        <AppText variant="caption" numeric className="flex-1">
          {periodLabel(request)}
        </AppText>
        <AppText variant="tiny">{messages.leave.types[request.type]}</AppText>
      </View>

      {request.reason ? (
        <AppText variant="caption" numberOfLines={2}>
          {request.reason}
        </AppText>
      ) : null}
    </AppCard>
  )
}
