import type { BanKind } from './user-ban'

export type BanLog = { reason?: string; createdAt?: number; by?: string }

export type RiskScore = {
  action?: string
  score?: number
  modelVersion?: string
  reasons: string[]
  scoredAt?: number
}

/** `withdraw-bans` хүснэгтийн сүүлийн BANNED мөр. */
export type LatestWithdrawBan = { reason?: string; createdAt?: string }

export type BanReason =
  | {
      source: 'risk'
      score?: number
      details: string
      date?: number
      by: string
    }
  | { source: 'withdrawBan'; reason?: string; date?: string }
  | { source: 'log'; reason?: string; date?: number; by?: string }

const RISK_FREEZE_SCORE = 70
const DEFAULT_MODEL = 'v5'

/**
 * Вэбийн `BanBanner`-ийн дараалал: withdraw-д эрсдэлийн загвар → withdraw-bans
 * хүснэгт → админы лог; trade/futures-д зөвхөн админы лог. Юу ч олдохгүй
 * бол `null`.
 */
export function resolveBanReason(
  kind: BanKind,
  sources: {
    risk?: RiskScore | null
    withdrawBan?: LatestWithdrawBan | null
    log?: BanLog | null
  },
): BanReason | null {
  const { risk, withdrawBan, log } = sources

  if (kind === 'withdraw' && risk) {
    const frozenByModel =
      risk.action === 'FREEZE' ||
      (risk.score !== undefined && risk.score >= RISK_FREEZE_SCORE)
    if (frozenByModel) {
      return {
        source: 'risk',
        score: risk.score,
        details: risk.reasons.join(' | '),
        date: risk.scoredAt,
        by: `SYSTEM: ai-model-${risk.modelVersion || DEFAULT_MODEL}`,
      }
    }
  }

  if (kind === 'withdraw' && withdrawBan) {
    return {
      source: 'withdrawBan',
      reason: withdrawBan.reason,
      date: withdrawBan.createdAt,
    }
  }

  if (log) {
    return {
      source: 'log',
      reason: log.reason,
      date: log.createdAt,
      by: log.by,
    }
  }

  return null
}

/** Хамгийн сүүлийн BANNED мөр — вэб 50 мөрөөс `created_at`-аар эрэмбэлдэг. */
export function latestWithdrawBan(
  items: { status?: string; reason?: string; createdAt: string }[],
): LatestWithdrawBan | null {
  const banned = items
    .filter((item) => (item.status ?? '').toUpperCase() === 'BANNED')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const first = banned[0]
  return first ? { reason: first.reason, createdAt: first.createdAt } : null
}
