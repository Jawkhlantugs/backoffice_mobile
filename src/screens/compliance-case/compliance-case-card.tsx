import { View } from 'react-native'

import { AppCard, AppIcon, AppText, StatusPill } from '@/components'
import type { ComplianceCase } from '@/data/compliance-case/compliance-case-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { ComplianceCaseStatusPill } from './compliance-case-status-pill'

const SEVERITY_TONE = {
  LOW: 'neutral',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'danger',
} as const

export function ComplianceCaseCard({
  item,
  onPress,
}: {
  item: ComplianceCase
  onPress: () => void
}) {
  return (
    <AppCard onPress={onPress} className="gap-3">
      <View className="flex-row items-start gap-3">
        <AppIcon name="compliance" size={iconSize.md} tone="muted" />
        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {item.caseType || item.caseId}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {item.uid}
          </AppText>
        </View>
        <ComplianceCaseStatusPill status={item.status} />
      </View>

      <View className="flex-row items-center gap-2">
        <StatusPill
          label={messages.complianceCases.severities[item.severity]}
          tone={SEVERITY_TONE[item.severity]}
        />
        {item.caseCategory ? (
          <AppText variant="tiny" numberOfLines={1} className="flex-1">
            {item.caseCategory}
          </AppText>
        ) : null}
        <AppText variant="tiny">{formatDate(item.createdAt)}</AppText>
      </View>
    </AppCard>
  )
}
