import type { JumioBackup } from './jumio-backup-model'

export type JumioBackupDto = {
  id: string
  scanReference?: string
  customerId?: string | null
  firstName?: string | null
  lastName?: string | null
  type?: string | null
  detailStatus?: number | null
  country?: { label?: string } | string | null
  created_at?: string
}

function countryLabel(country: JumioBackupDto['country']): string | undefined {
  if (!country) return undefined
  return typeof country === 'string' ? country : country.label || undefined
}

export function toJumioBackup(dto: JumioBackupDto): JumioBackup {
  return {
    id: dto.id,
    scanReference: dto.scanReference ?? '',
    customerId: dto.customerId || undefined,
    firstName: dto.firstName || undefined,
    lastName: dto.lastName || undefined,
    type: dto.type || undefined,
    verified:
      dto.detailStatus === null || dto.detailStatus === undefined
        ? undefined
        : dto.detailStatus === 1,
    country: countryLabel(dto.country),
    createdAt: dto.created_at ?? '',
  }
}
