import type { AdminActivity, OperationAccountRow } from './admin-activity-model'

export type AdminActivityDto = {
  id: string
  created_at?: string
  adminUserId?: string
  adminUser?: { email?: string } | null
  action?: string
  method?: string
  path?: string
  statusCode?: number
  recordCount?: number | null
  ip?: string
  duration?: number
}

export type OperationAccountRowDto = {
  id: string
  subAccountId?: string
  name?: string
  binanceEmail?: string
  description?: string
  canTrade?: boolean
  canWithdraw?: boolean
}

/** 4xx/5xx — жагсаалтад улаанаар ялгана. */
const HTTP_ERROR_FROM = 400

export function toAdminActivity(dto: AdminActivityDto): AdminActivity {
  const statusCode = dto.statusCode ?? 0
  return {
    id: dto.id,
    admin: dto.adminUser?.email ?? dto.adminUserId ?? '',
    action: dto.action ?? '',
    method: dto.method ?? '',
    path: dto.path ?? '',
    statusCode,
    isError: statusCode >= HTTP_ERROR_FROM,
    recordCount: dto.recordCount ?? undefined,
    ip: dto.ip ?? '',
    durationMs: dto.duration ?? 0,
    createdAt: dto.created_at ?? '',
  }
}

export function toOperationAccountRow(
  dto: OperationAccountRowDto,
): OperationAccountRow {
  return {
    id: dto.id,
    subAccountId: dto.subAccountId ?? '',
    name: dto.name ?? dto.subAccountId ?? dto.id,
    binanceEmail: dto.binanceEmail,
    description: dto.description,
    canTrade: dto.canTrade === true,
    canWithdraw: dto.canWithdraw === true,
  }
}
