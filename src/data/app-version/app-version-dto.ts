import type { AppVersion, AppVersionInput } from './app-version-model'

export type AppVersionDto = {
  id: string
  os?: string
  version?: string
  requiredVersion?: string
  updateMode?: string
  titleMn?: string
  titleEn?: string
  descriptionMn?: string
  descriptionEn?: string
  status?: string
  createdBy?: string
  createTime?: number
  updateTime?: number
}

export function toAppVersion(dto: AppVersionDto): AppVersion {
  return {
    id: dto.id,
    os: dto.os === 'ios' ? 'ios' : 'android',
    version: dto.version ?? '',
    requiredVersion: dto.requiredVersion ?? '',
    updateMode: dto.updateMode === 'required' ? 'required' : 'recommended',
    titleMn: dto.titleMn ?? '',
    titleEn: dto.titleEn ?? '',
    descriptionMn: dto.descriptionMn ?? '',
    descriptionEn: dto.descriptionEn ?? '',
    status: dto.status === 'inactive' ? 'inactive' : 'active',
    createdBy: dto.createdBy,
    createTime: dto.createTime ?? 0,
    updateTime: dto.updateTime,
  }
}

/** Вэбийн `AppVersionWriteForm` — талбарын нэр ижил, зөвхөн trim. */
export function toAppVersionWrite(input: AppVersionInput) {
  return {
    ...input,
    version: input.version.trim(),
    requiredVersion: input.requiredVersion.trim(),
    titleMn: input.titleMn.trim(),
    titleEn: input.titleEn.trim(),
    descriptionMn: input.descriptionMn.trim(),
    descriptionEn: input.descriptionEn.trim(),
  }
}
