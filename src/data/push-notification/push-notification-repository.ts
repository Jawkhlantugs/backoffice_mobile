import { clients } from '@/core/network/clients'
import { unwrap, unwrapList, type ListPage } from '@/core/network/envelope'

import {
  toPushNotification,
  type PushNotificationDto,
} from './push-notification-dto'
import type {
  NewPushNotification,
  PushNotification,
  PushNotificationStatus,
} from './push-notification-model'

/** Endpoint: `push-notification.service.ts` — `{finance}/push-notification*`. */
export const pushNotificationRepository = {
  async list(): Promise<ListPage<PushNotification>> {
    const response = await clients.finance.post('/push-notification/list', {})
    const page = unwrapList<PushNotificationDto>(
      response.data,
      'push-notifications',
    )
    return { ...page, items: page.items.map(toPushNotification) }
  },

  async create(input: NewPushNotification): Promise<PushNotification> {
    const response = await clients.finance.post('/push-notification', {
      title: input.title,
      message: input.message,
      isBroadcast: input.isBroadcast,
      notifications: input.isBroadcast
        ? []
        : input.emails.map((email) => ({ email })),
    })
    return toPushNotification(unwrap<PushNotificationDto>(response.data))
  },

  /** `PROCESSING` = зөвшөөрөх, `REJECTED` = татгалзах. */
  async updateStatus(
    pid: string,
    status: Extract<PushNotificationStatus, 'PROCESSING' | 'REJECTED'>,
  ): Promise<PushNotification> {
    const response = await clients.finance.put(
      `/push-notification/${pid}/status`,
      {
        status,
      },
    )
    return toPushNotification(unwrap<PushNotificationDto>(response.data))
  },
}
