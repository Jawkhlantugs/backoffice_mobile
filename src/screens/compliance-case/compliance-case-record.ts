import type { RecordView } from '@/components'
import type { ComplianceCase } from '@/data/compliance-case/compliance-case-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { COMPLIANCE_CASE_STATUS_TONES } from './compliance-case-status-pill'

const text = messages.complianceCases

export function complianceCaseRecord(
  item: ComplianceCase,
  onPress: () => void,
): RecordView {
  return {
    title: item.caseType || item.caseId,
    subtitle: item.uid,
    status: {
      label: text.statuses[item.status],
      tone: COMPLIANCE_CASE_STATUS_TONES[item.status],
    },
    fields: [
      {
        label: messages.lists.fields.risk,
        value: text.severities[item.severity],
      },
      { label: text.caseCategory, value: item.caseCategory },
      { label: text.createdAt, value: formatDate(item.createdAt) },
      { label: text.assignedAnalyst, value: item.assignedAnalyst },
    ],
    details: [
      { label: text.riskScore, value: item.riskScore },
      { label: text.triggerSource, value: item.triggerSource },
    ],
    onPress,
  }
}
