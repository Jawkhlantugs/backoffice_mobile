import type { RecordView, StatusTone } from '@/components'
import type { ComplianceCase } from '@/data/compliance-case/compliance-case-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { COMPLIANCE_CASE_STATUS_TONES } from './compliance-case-status-pill'

const text = messages.complianceCases

/** Вэбийн `cases/constants.ts`-ийн `getSeverityVariant`. */
const SEVERITY_TONE: Record<string, StatusTone> = {
  CRITICAL: 'danger',
  HIGH: 'warning',
  LOW: 'neutral',
}

/** Вэбийн `compliance/cases/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  text.uid,
  text.caseType,
  text.caseCategory,
  text.severity,
  'status',
  text.riskScore,
  text.assignedAnalyst,
  text.createdAt,
] as const

export function complianceCaseRecord(
  item: ComplianceCase,
  onPress: () => void,
): RecordView {
  return {
    title: item.caseType || item.caseId,
    tableTitle: item.caseId,
    subtitle: item.uid,
    status: {
      label: text.statuses[item.status],
      tone: COMPLIANCE_CASE_STATUS_TONES[item.status],
    },
    fields: [
      {
        label: text.severity,
        value: text.severities[item.severity],
        tone: SEVERITY_TONE[item.severity] ?? 'success',
      },
      { label: text.caseCategory, value: item.caseCategory },
      { label: text.createdAt, value: formatDate(item.createdAt) },
      { label: text.assignedAnalyst, value: item.assignedAnalyst },
    ],
    details: [
      { label: text.uid, value: item.uid },
      { label: text.caseType, value: item.caseType },
      { label: text.riskScore, value: item.riskScore },
      { label: text.triggerSource, value: item.triggerSource },
    ],
    columns: COLUMNS,
    onPress,
  }
}
