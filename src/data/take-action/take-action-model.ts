/**
 * Take-action (compliance асуумж) domain model. Талбарын нэр, статусын утга
 * нь вэб админы `services/types/portal/takeAction.types.ts` болон
 * `userTakeAction.types.ts`-аас — таамаглаагүй.
 */

export const TAKE_ACTION_STATUSES = ['active', 'inactive'] as const
export type TakeActionStatus = (typeof TAKE_ACTION_STATUSES)[number]

/** Асуумжийн тодорхойлолт — ажилтан үүсгэж, харилцагчид илгээдэг. */
export type TakeAction = {
  actionId: string
  title: string
  status: TakeActionStatus
  type?: string
  required: boolean
  contentType?: string
  createdAt?: string
}

export const USER_TAKE_ACTION_STATUSES = ['waiting', 'success'] as const
export type UserTakeActionStatus = (typeof USER_TAKE_ACTION_STATUSES)[number]

export type TakeActionSubContent = {
  title: string
  desc: string
  subType?: string
  value?: string
  fileType?: string
}

export type TakeActionContentBlock = {
  mainTitle: string
  mainDesc: string
  subContent: TakeActionSubContent[]
}

/** Харилцагчийн бөглөсөн хариу — нэг (uid, takeActionId) хосонд нэг. */
export type UserTakeAction = {
  uid: string
  takeActionId: string
  status: UserTakeActionStatus
  content: TakeActionContentBlock[]
  createdAt?: string
}
