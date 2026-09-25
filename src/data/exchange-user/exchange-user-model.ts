/**
 * Харилцагчийн (crypto exchange хэрэглэгч) үндсэн мэдээлэл — вэб админы
 * `kyc.service.ts` (`/users/list`, `/users/detail/{id}`)-ийн бодит хэрэглэж
 * буй хэлбэр (`UserListType`, **`kyc.types.ts`-ийн `userSchema` биш** — тэр
 * нь ашиглагдаагүй загвар кодтой давхцаж байна, admin панелийн өөрийнх нь
 * жигд бус байдал, §8-ийн дагуу засаагүй).
 */
export type ExchangeUser = {
  id: string
  email: string
  binanceEmail?: string
  firstName?: string
  lastName?: string
  subAccountId?: string
  canTrade?: boolean
  canWithdraw?: boolean
  isWhitelistEnabled?: boolean
  kycLevel?: number
  vipLevel?: number
  /** Тоон код — вэбийн адил утгаараа харуулна, семантик таамаглаагүй. */
  status?: number
  createdAt?: string
}
