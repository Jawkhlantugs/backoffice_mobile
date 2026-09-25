/** `compliance.types.ts`-ийн `ComplianceCase` — вэб админы compliance/cases. */

export const COMPLIANCE_CASE_STATUSES = [
  'OPEN',
  'UNDER_REVIEW',
  'CLOSED',
  'REOPENED',
] as const
export type ComplianceCaseStatus = (typeof COMPLIANCE_CASE_STATUSES)[number]

export const COMPLIANCE_CASE_SEVERITIES = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const
export type ComplianceCaseSeverity = (typeof COMPLIANCE_CASE_SEVERITIES)[number]

export const COMPLIANCE_CASE_RESOLUTIONS = [
  'CONFIRMED_MULE',
  'FALSE_POSITIVE',
] as const
export type ComplianceCaseResolution =
  (typeof COMPLIANCE_CASE_RESOLUTIONS)[number]

export type ComplianceCase = {
  uid: string
  caseId: string
  caseType: string
  caseCategory: string
  severity: ComplianceCaseSeverity
  status: ComplianceCaseStatus
  triggerSource?: string
  createdAt?: number
  lastUpdatedAt?: number
  riskScore?: number
  assignedAnalyst?: string
  notes?: string
  resolution?: ComplianceCaseResolution
  closedAt?: number
  closedBy?: string
  closeNotes?: string
}

export type ComplianceCaseEvent = {
  eventType: string
  details?: string
  timestamp?: number
  actor?: string
}
