import { clients } from '@/core/network/clients'
import {
  unwrapList,
  unwrapObject,
  type ListPage,
} from '@/core/network/envelope'

import {
  toTakeAction,
  toUserTakeAction,
  type TakeActionDto,
  type UserTakeActionDto,
} from './take-action-dto'
import type {
  TakeAction,
  TakeActionStatus,
  UserTakeAction,
  UserTakeActionStatus,
} from './take-action-model'

/**
 * Endpoint: вэб админы `takeAction.service.ts`. Cursor pagination
 * (`lastEvaluatedKey`) — DynamoDB, `total` байхгүй байж болно.
 */

export type TakeActionListParams = {
  status?: TakeActionStatus
  lastEvaluatedKey?: string
}

export type UserTakeActionListParams = {
  takeActionId?: string
  uid?: string
  status?: UserTakeActionStatus
  lastEvaluatedKey?: string
}

export const takeActionRepository = {
  async list(params: TakeActionListParams): Promise<ListPage<TakeAction>> {
    const response = await clients.takeAction.post('/take-action/list', {
      ...(params.status ? { status: params.status } : {}),
      ...(params.lastEvaluatedKey
        ? { lastEvaluatedKey: params.lastEvaluatedKey }
        : {}),
    })

    const page = unwrapList<TakeActionDto>(response.data, 'take-actions')
    return { ...page, items: page.items.map(toTakeAction) }
  },

  async userResponses(
    params: UserTakeActionListParams,
  ): Promise<ListPage<UserTakeAction>> {
    const response = await clients.takeAction.post('/user-take-action/list', {
      ...(params.takeActionId ? { takeActionId: params.takeActionId } : {}),
      ...(params.uid ? { uid: params.uid } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.lastEvaluatedKey
        ? { lastEvaluatedKey: params.lastEvaluatedKey }
        : {}),
    })

    const page = unwrapList<UserTakeActionDto>(
      response.data,
      'user-take-actions',
    )
    return { ...page, items: page.items.map(toUserTakeAction) }
  },

  /** Асуумжид хавсаргасан зургийн түр URL — диск дээр хадгалахгүй (§4). */
  async imageSignedUrl(privateImageUrl: string): Promise<string> {
    const response = await clients.takeAction.post(
      '/user-take-action/image-signed-url',
      { privateImageUrl },
    )
    const body = unwrapObject<{ signedUrl?: string }>(
      response.data,
      'image-signed-url',
    )
    return body.signedUrl ?? ''
  },
}
