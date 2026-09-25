import { clients } from '@/core/network/clients'
import {
  unwrapList,
  unwrapObject,
  type ListPage,
} from '@/core/network/envelope'

import {
  toComplianceCase,
  toComplianceCaseEvent,
  type ComplianceCaseDto,
  type ComplianceCaseEventDto,
} from './compliance-case-dto'
import type {
  ComplianceCase,
  ComplianceCaseEvent,
  ComplianceCaseResolution,
  ComplianceCaseSeverity,
  ComplianceCaseStatus,
} from './compliance-case-model'

/**
 * Endpoint: `compliance.service.ts` — `{compliance}/cases`. Cursor
 * pagination (`lastEvaluatedKey`), хариу `body`/`data` хоёулаа, `items`/`list`
 * хоёулаа — `unwrapList` бүгдийг барина.
 */
export type ComplianceCaseListParams = {
  status?: ComplianceCaseStatus
  severity?: ComplianceCaseSeverity
  lastEvaluatedKey?: string
}

export const complianceCaseRepository = {
  async list(
    params: ComplianceCaseListParams,
  ): Promise<ListPage<ComplianceCase>> {
    const response = await clients.compliance.post('/cases/list', {
      ...(params.status ? { status: params.status } : {}),
      ...(params.severity ? { severity: params.severity } : {}),
      ...(params.lastEvaluatedKey
        ? { lastEvaluatedKey: params.lastEvaluatedKey }
        : {}),
    })

    const page = unwrapList<ComplianceCaseDto>(
      response.data,
      'compliance-cases',
    )
    return { ...page, items: page.items.map(toComplianceCase) }
  },

  async byId(uid: string, caseId: string): Promise<ComplianceCase> {
    const response = await clients.compliance.get(`/cases/${uid}/${caseId}`)
    return toComplianceCase(
      unwrapObject<ComplianceCaseDto>(response.data, 'compliance-case'),
    )
  },

  async events(
    uid: string,
    caseId: string,
  ): Promise<ListPage<ComplianceCaseEvent>> {
    const response = await clients.compliance.post(
      `/cases/${uid}/${caseId}/events/list`,
      {},
    )
    const page = unwrapList<ComplianceCaseEventDto>(
      response.data,
      'compliance-case-events',
    )
    return { ...page, items: page.items.map(toComplianceCaseEvent) }
  },

  async addNote(uid: string, caseId: string, notes: string): Promise<void> {
    await clients.compliance.post(`/cases/${uid}/${caseId}/notes`, { notes })
  },

  async assign(
    uid: string,
    caseId: string,
    assignedAnalyst: string,
  ): Promise<void> {
    await clients.compliance.post(`/cases/${uid}/${caseId}/assign`, {
      assignedAnalyst,
    })
  },

  async close(
    uid: string,
    caseId: string,
    resolution: ComplianceCaseResolution,
    notes: string,
  ): Promise<void> {
    await clients.compliance.post(`/cases/${uid}/${caseId}/close`, {
      resolution,
      notes,
    })
  },

  async reopen(uid: string, caseId: string, notes: string): Promise<void> {
    await clients.compliance.post(`/cases/${uid}/${caseId}/reopen`, { notes })
  },
}
