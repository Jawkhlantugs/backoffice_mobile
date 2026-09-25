import type {
  PushNotification,
  PushNotificationStatus,
} from './push-notification-model'

export type PushNotificationDto = {
  pid?: string
  title?: string
  message?: string
  status?: string
  createTime?: number | string
  updateTime?: number | string
  isBroadcast?: number | boolean
  viewsCount?: number
  /** Вэбийн `PushNotificationUser` — объект, string биш. */
  createdUser?: { uid?: string; email?: string } | null
  approvedUser?: { uid?: string; email?: string } | null
}

const KNOWN_STATUSES: PushNotificationStatus[] = [
  'PENDING',
  'PROCESSING',
  'DONE',
  'REJECTED',
]

export function toPushNotification(dto: PushNotificationDto): PushNotification {
  return {
    pid: dto.pid ?? '',
    title: dto.title ?? '',
    message: dto.message ?? '',
    status: KNOWN_STATUSES.find((status) => status === dto.status) ?? 'PENDING',
    isBroadcast: dto.isBroadcast === 1 || dto.isBroadcast === true,
    createTime: typeof dto.createTime === 'number' ? dto.createTime : undefined,
    viewsCount: dto.viewsCount,
    createdUser: dto.createdUser?.email || dto.createdUser?.uid || undefined,
    approvedUser: dto.approvedUser?.email || dto.approvedUser?.uid || undefined,
  }
}
