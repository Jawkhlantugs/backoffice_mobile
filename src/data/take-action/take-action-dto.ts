import type {
  TakeAction,
  TakeActionContentBlock,
  TakeActionStatus,
  TakeActionSubContent,
  UserTakeAction,
  UserTakeActionStatus,
} from './take-action-model'

/** Серверийн JSON — `takeAction.types.ts`-ийн `TakeAction`-той ижил. */
export type TakeActionDto = {
  actionId?: string
  title?: string
  status?: string
  type?: string
  required?: string | boolean
  contentType?: string
  createdAt?: string
}

/** Серверийн JSON — `content[].sub_content[]` snake_case (§8: нэрийг засахгүй). */
export type TakeActionSubContentDto = {
  title?: string
  desc?: string
  sub_type?: string
  value?: string
  fileType?: string
}

export type TakeActionContentBlockDto = {
  mainTitle?: string
  mainDesc?: string
  sub_content?: TakeActionSubContentDto[]
}

export type UserTakeActionDto = {
  uid?: string
  takeActionId?: string
  status?: string
  content?: TakeActionContentBlockDto[]
  createdAt?: string
}

const KNOWN_STATUSES: TakeActionStatus[] = ['active', 'inactive']
const KNOWN_USER_STATUSES: UserTakeActionStatus[] = ['waiting', 'success']

function toStatus(raw: string | undefined): TakeActionStatus {
  return KNOWN_STATUSES.find((status) => status === raw) ?? 'inactive'
}

function toUserStatus(raw: string | undefined): UserTakeActionStatus {
  return KNOWN_USER_STATUSES.find((status) => status === raw) ?? 'waiting'
}

function toRequired(raw: string | boolean | undefined): boolean {
  return raw === true || raw === 'true'
}

function toSubContent(dto: TakeActionSubContentDto): TakeActionSubContent {
  return {
    title: dto.title ?? '',
    desc: dto.desc ?? '',
    subType: dto.sub_type,
    value: dto.value,
    fileType: dto.fileType,
  }
}

function toContentBlock(
  dto: TakeActionContentBlockDto,
): TakeActionContentBlock {
  return {
    mainTitle: dto.mainTitle ?? '',
    mainDesc: dto.mainDesc ?? '',
    subContent: (dto.sub_content ?? []).map(toSubContent),
  }
}

export function toTakeAction(dto: TakeActionDto): TakeAction {
  return {
    actionId: dto.actionId ?? '',
    title: dto.title ?? '',
    status: toStatus(dto.status),
    type: dto.type,
    required: toRequired(dto.required),
    contentType: dto.contentType,
    createdAt: dto.createdAt,
  }
}

export function toUserTakeAction(dto: UserTakeActionDto): UserTakeAction {
  return {
    uid: dto.uid ?? '',
    takeActionId: dto.takeActionId ?? '',
    status: toUserStatus(dto.status),
    content: (dto.content ?? []).map(toContentBlock),
    createdAt: dto.createdAt,
  }
}
