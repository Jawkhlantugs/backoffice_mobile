/** `security.types.ts`-ийн `UserSecurity` — backend kebab-case түлхүүрүүд. */
export type UserSecurity = {
  uid: string
  phoneNumber?: string
  softwareTokenEnabled: boolean
  antiPhishingEnabled: boolean
  whiteListEnabled: boolean
  smsEnabled: boolean
  smsMobile?: string
  lastChangedEmail?: string
  isTradeBan?: boolean
  isWithdrawBan?: boolean
  isFuturesBan?: boolean
  canTrade?: boolean
  canWithdraw?: boolean
  futuresTrade?: boolean
}

export type MfaName = 'sms' | 'token'
