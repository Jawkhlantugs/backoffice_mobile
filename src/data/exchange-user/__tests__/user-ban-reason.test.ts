import { latestWithdrawBan, resolveBanReason } from '../user-ban-reason'
import { toBanLog, toRiskScore } from '../user-ban-reason-dto'

const log = {
  reason: 'ADMIN:a@x.mn: сэжигтэй',
  createdAt: 1_760_000_000_000,
  by: 'a@x.mn',
}

describe('resolveBanReason', () => {
  it('withdraw: FREEZE загвар бусдаас давуу', () => {
    const reason = resolveBanReason('withdraw', {
      risk: {
        action: 'FREEZE',
        score: 40,
        reasons: ['velocity', 'new device'],
      },
      withdrawBan: { reason: 'whitelist' },
      log,
    })
    expect(reason).toEqual({
      source: 'risk',
      score: 40,
      details: 'velocity | new device',
      date: undefined,
      by: 'SYSTEM: ai-model-v5',
    })
  })

  it('withdraw: 70-аас дээш оноо FREEZE-гүй ч загвар гэж үзнэ', () => {
    const reason = resolveBanReason('withdraw', {
      risk: { score: 72, modelVersion: 'v6', reasons: [] },
    })
    expect(reason).toMatchObject({ source: 'risk', by: 'SYSTEM: ai-model-v6' })
  })

  it('withdraw: загвар хаагаагүй бол withdraw-bans хүснэгт', () => {
    const reason = resolveBanReason('withdraw', {
      risk: { action: 'ALLOW', score: 10, reasons: [] },
      withdrawBan: {
        reason: 'Email changed',
        createdAt: '2026-10-20T00:00:00Z',
      },
      log,
    })
    expect(reason).toEqual({
      source: 'withdrawBan',
      reason: 'Email changed',
      date: '2026-10-20T00:00:00Z',
    })
  })

  it('withdraw: хүснэгтэд байхгүй бол админы лог', () => {
    expect(resolveBanReason('withdraw', { log })?.source).toBe('log')
  })

  it('trade: эрсдэлийн оноо, хүснэгтийг үл тооно', () => {
    const reason = resolveBanReason('trade', {
      risk: { action: 'FREEZE', score: 99, reasons: [] },
      withdrawBan: { reason: 'x' },
      log,
    })
    expect(reason).toEqual({
      source: 'log',
      reason: log.reason,
      date: log.createdAt,
      by: log.by,
    })
  })

  it('эх сурвалж хоосон бол null', () => {
    expect(resolveBanReason('futures', {})).toBeNull()
  })
})

describe('latestWithdrawBan', () => {
  it('BANNED мөрөөс хамгийн сүүлийнхийг авна', () => {
    expect(
      latestWithdrawBan([
        { status: 'BANNED', reason: 'old', createdAt: '2026-01-01' },
        { status: 'UNBANNED', reason: 'lifted', createdAt: '2026-09-01' },
        { status: 'banned', reason: 'new', createdAt: '2026-05-01' },
      ]),
    ).toEqual({ reason: 'new', createdAt: '2026-05-01' })
  })

  it('BANNED мөр байхгүй бол null', () => {
    expect(
      latestWithdrawBan([{ status: 'UNBANNED', createdAt: 'x' }]),
    ).toBeNull()
  })
})

describe('DTO', () => {
  it('хоосон лог нь null', () => {
    expect(toBanLog({})).toBeNull()
    expect(toBanLog(null)).toBeNull()
  })

  it('updatedBy-г by болгоно', () => {
    expect(toBanLog({ reason: 'r', updatedBy: 'a@x.mn' })).toEqual({
      reason: 'r',
      createdAt: undefined,
      by: 'a@x.mn',
    })
  })

  it('riskScore байхгүй бол modelScore, хоосон шалтгааныг хасна', () => {
    expect(toRiskScore({ modelScore: 81, reasons: ['a', ''] })).toMatchObject({
      score: 81,
      reasons: ['a'],
    })
  })
})
