import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { complianceCaseRepository } from '@/data/compliance-case/compliance-case-repository'
import type {
  ComplianceCaseResolution,
  ComplianceCaseSeverity,
  ComplianceCaseStatus,
} from '@/data/compliance-case/compliance-case-model'

export const complianceCaseQueryKeys = {
  all: ['compliance-cases'] as const,
  list: (status?: ComplianceCaseStatus, severity?: ComplianceCaseSeverity) =>
    ['compliance-cases', 'list', status ?? 'all', severity ?? 'all'] as const,
  detail: (uid: string, caseId: string) =>
    ['compliance-cases', 'detail', uid, caseId] as const,
  events: (uid: string, caseId: string) =>
    ['compliance-cases', 'events', uid, caseId] as const,
}

export function useComplianceCases(options: {
  status?: ComplianceCaseStatus
  severity?: ComplianceCaseSeverity
}) {
  return useQuery({
    queryKey: complianceCaseQueryKeys.list(options.status, options.severity),
    queryFn: () => complianceCaseRepository.list(options),
  })
}

export function useComplianceCase(uid: string, caseId: string) {
  return useQuery({
    queryKey: complianceCaseQueryKeys.detail(uid, caseId),
    queryFn: () => complianceCaseRepository.byId(uid, caseId),
    enabled: uid.length > 0 && caseId.length > 0,
  })
}

export function useComplianceCaseEvents(uid: string, caseId: string) {
  return useQuery({
    queryKey: complianceCaseQueryKeys.events(uid, caseId),
    queryFn: () => complianceCaseRepository.events(uid, caseId),
    enabled: uid.length > 0 && caseId.length > 0,
  })
}

function useCaseMutation<TInput>(
  mutationFn: (input: TInput) => Promise<void>,
  invalidate: (input: TInput) => readonly unknown[],
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({ queryKey: invalidate(input) })
      void queryClient.invalidateQueries({
        queryKey: complianceCaseQueryKeys.all,
      })
    },
  })
}

export function useAddCaseNote(uid: string, caseId: string) {
  return useCaseMutation(
    (notes: string) => complianceCaseRepository.addNote(uid, caseId, notes),
    () => complianceCaseQueryKeys.detail(uid, caseId),
  )
}

export function useAssignCase(uid: string, caseId: string) {
  return useCaseMutation(
    (assignedAnalyst: string) =>
      complianceCaseRepository.assign(uid, caseId, assignedAnalyst),
    () => complianceCaseQueryKeys.detail(uid, caseId),
  )
}

export function useCloseCase(uid: string, caseId: string) {
  return useCaseMutation(
    ({
      resolution,
      notes,
    }: {
      resolution: ComplianceCaseResolution
      notes: string
    }) => complianceCaseRepository.close(uid, caseId, resolution, notes),
    () => complianceCaseQueryKeys.detail(uid, caseId),
  )
}

export function useReopenCase(uid: string, caseId: string) {
  return useCaseMutation(
    (notes: string) => complianceCaseRepository.reopen(uid, caseId, notes),
    () => complianceCaseQueryKeys.detail(uid, caseId),
  )
}
