import type {
  ComplianceCase,
  ComplianceCaseEvent,
  ComplianceCaseResolution,
  ComplianceCaseSeverity,
  ComplianceCaseStatus,
} from './compliance-case-model'

export type ComplianceCaseDto = {
  uid?: string
  caseId?: string
  caseType?: string
  caseCategory?: string
  severity?: string
  status?: string
  triggerSource?: string
  createdAt?: number
  lastUpdatedAt?: number
  riskScore?: number
  assignedAnalyst?: string
  notes?: string
  resolution?: string
  closedAt?: number
  closedBy?: string
  closeNotes?: string
}

export type ComplianceCaseEventDto = {
  eventType?: string
  details?: string
  timestamp?: number
  actor?: string
}

const KNOWN_STATUSES: ComplianceCaseStatus[] = [
  'OPEN',
  'UNDER_REVIEW',
  'CLOSED',
  'REOPENED',
]
const KNOWN_SEVERITIES: ComplianceCaseSeverity[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]
const KNOWN_RESOLUTIONS: ComplianceCaseResolution[] = [
  'CONFIRMED_MULE',
  'FALSE_POSITIVE',
]

export function toComplianceCase(dto: ComplianceCaseDto): ComplianceCase {
  return {
    uid: dto.uid ?? '',
    caseId: dto.caseId ?? '',
    caseType: dto.caseType ?? '',
    caseCategory: dto.caseCategory ?? '',
    severity: KNOWN_SEVERITIES.find((s) => s === dto.severity) ?? 'LOW',
    status: KNOWN_STATUSES.find((s) => s === dto.status) ?? 'OPEN',
    triggerSource: dto.triggerSource,
    createdAt: dto.createdAt,
    lastUpdatedAt: dto.lastUpdatedAt,
    riskScore: dto.riskScore,
    assignedAnalyst: dto.assignedAnalyst,
    notes: dto.notes,
    resolution: KNOWN_RESOLUTIONS.find((r) => r === dto.resolution),
    closedAt: dto.closedAt,
    closedBy: dto.closedBy,
    closeNotes: dto.closeNotes,
  }
}

export function toComplianceCaseEvent(
  dto: ComplianceCaseEventDto,
): ComplianceCaseEvent {
  return {
    eventType: dto.eventType ?? '',
    details: dto.details,
    timestamp: dto.timestamp,
    actor: dto.actor,
  }
}
