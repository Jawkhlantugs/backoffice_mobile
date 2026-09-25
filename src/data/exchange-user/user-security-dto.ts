import type { UserSecurity } from './user-security-model'

/** Серверийн JSON — талбарын нэр kebab-case (§8: нэрийг засаагүй). */
export type UserSecurityDto = {
  uid?: string
  'phone-number'?: string
  'software-token'?: { status?: number }
  'anti-phishing'?: { status?: number }
  'white-list'?: { status?: number }
  sms?: { status?: number; mobile?: string }
  email?: { 'last-changed-email'?: string }
  isTradeBan?: boolean
  isWithdrawBan?: boolean
  isFuturesBan?: boolean
  canTrade?: boolean | number
  canWithdraw?: boolean | number
  futuresTrade?: boolean | number
}

function toBool(value: boolean | number | undefined): boolean | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? value !== 0 : value
}

export function toUserSecurity(dto: UserSecurityDto): UserSecurity {
  return {
    uid: dto.uid ?? '',
    phoneNumber: dto['phone-number'],
    softwareTokenEnabled: (dto['software-token']?.status ?? 0) !== 0,
    antiPhishingEnabled: (dto['anti-phishing']?.status ?? 0) !== 0,
    whiteListEnabled: (dto['white-list']?.status ?? 0) !== 0,
    smsEnabled: (dto.sms?.status ?? 0) !== 0,
    smsMobile: dto.sms?.mobile,
    lastChangedEmail: dto.email?.['last-changed-email'],
    isTradeBan: dto.isTradeBan,
    isWithdrawBan: dto.isWithdrawBan,
    isFuturesBan: dto.isFuturesBan,
    canTrade: toBool(dto.canTrade),
    canWithdraw: toBool(dto.canWithdraw),
    futuresTrade: toBool(dto.futuresTrade),
  }
}
