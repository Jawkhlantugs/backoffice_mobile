import { StatusPill, type StatusTone } from '@/components'
import type { ComplianceCaseStatus } from '@/data/compliance-case/compliance-case-model'
import { messages } from '@/lib/messages'

const TONES: Record<ComplianceCaseStatus, StatusTone> = {
  OPEN: 'warning',
  UNDER_REVIEW: 'info',
  CLOSED: 'success',
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
      tone={TONES[status]}
    />
  )
}
