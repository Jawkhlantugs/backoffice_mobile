import type { BanLog, RiskScore } from './user-ban-reason'

/** `security.types.ts`-ийн `UserBanLogResponse.data`. */
export type BanLogDto = {
  reason?: string
  createdAt?: number
  updatedBy?: string
}

/** `security.types.ts`-ийн `RiskUserScore` — зөвхөн шалтгаанд хэрэгтэй хэсэг. */
export type RiskScoreDto = {
  action?: string
  riskScore?: number
  modelScore?: number
  modelVersion?: string
  reasons?: string[]
  scoredAt?: number
}

export function toBanLog(dto: BanLogDto | null | undefined): BanLog | null {
  if (!dto || (!dto.reason && !dto.createdAt && !dto.updatedBy)) return null
  return { reason: dto.reason, createdAt: dto.createdAt, by: dto.updatedBy }
}

export function toRiskScore(
  dto: RiskScoreDto | null | undefined,
): RiskScore | null {
  if (!dto) return null
  return {
    action: dto.action,
    // Вэб `riskScore ?? modelScore` — хуучин загвар зөвхөн modelScore буцаадаг.
    score: dto.riskScore ?? dto.modelScore,
    modelVersion: dto.modelVersion,
    reasons: (dto.reasons ?? []).filter(Boolean),
    scoredAt: dto.scoredAt,
  }
}
