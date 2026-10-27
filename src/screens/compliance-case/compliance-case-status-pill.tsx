import { StatusPill, type StatusTone } from '@/components'
import type { ComplianceCaseStatus } from '@/data/compliance-case/compliance-case-model'
import { messages } from '@/lib/messages'

export const COMPLIANCE_CASE_STATUS_TONES: Record<
  ComplianceCaseStatus,
  StatusTone
> = {
  // Вэбийн `cases/constants.ts`-ийн `getStatusBadgeClassName`: цэнхэр,
  // шар, саарал, улаан.
  OPEN: 'info',
  UNDER_REVIEW: 'warning',
  CLOSED: 'neutral',
  REOPENED: 'danger',
}

export function ComplianceCaseStatusPill({
  status,
}: {
  status: ComplianceCaseStatus
}) {
  return (
    <StatusPill
      label={messages.complianceCases.statuses[status]}
      tone={COMPLIANCE_CASE_STATUS_TONES[status]}
    />
  )
}
