/** `push-notification.types.ts`-ийн `PushNotification`. */
export const PUSH_NOTIFICATION_STATUSES = [
  'PENDING',
  'PROCESSING',
  'DONE',
  'REJECTED',
] as const
export type PushNotificationStatus = (typeof PUSH_NOTIFICATION_STATUSES)[number]

export type PushNotification = {
  pid: string
  title: string
  message: string
  status: PushNotificationStatus
  isBroadcast: boolean
  createTime?: number
  viewsCount?: number
  /** Имэйл (эсвэл uid) — харуулах шошго. */
  createdUser?: string
  approvedUser?: string
}

export type NewPushNotification = {
  title: string
  message: string
  isBroadcast: boolean
  /** `isBroadcast=false` үед 1-20 имэйл — CSV оруулах боломжгүй тул хязгаарласан. */
  emails: string[]
}
