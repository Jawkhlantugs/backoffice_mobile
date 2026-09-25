/** `app-versions.types.ts`-ийн утгууд. */
export const APP_OS = ['android', 'ios'] as const
export const UPDATE_MODES = ['recommended', 'required'] as const
export const APP_VERSION_STATUSES = ['active', 'inactive'] as const

export type AppOs = (typeof APP_OS)[number]
export type UpdateMode = (typeof UPDATE_MODES)[number]
export type AppVersionStatus = (typeof APP_VERSION_STATUSES)[number]

/** `appVersionSchema`. */
export type AppVersion = {
  id: string
  os: AppOs
  version: string
  requiredVersion: string
  updateMode: UpdateMode
  titleMn: string
  titleEn: string
  descriptionMn: string
  descriptionEn: string
  status: AppVersionStatus
  createdBy?: string
  createTime: number
  updateTime?: number
}

export type AppVersionInput = Omit<
  AppVersion,
  'id' | 'createdBy' | 'createTime' | 'updateTime'
>

/** Вэбийн `version-form.tsx`-ийн анхны утга. */
export const EMPTY_APP_VERSION: AppVersionInput = {
  os: 'android',
  version: '',
  requiredVersion: '',
  updateMode: 'recommended',
  titleMn: '',
  titleEn: '',
  descriptionMn: '',
  descriptionEn: '',
  status: 'active',
}

export function appVersionToInput(version: AppVersion): AppVersionInput {
  const {
    id: _id,
    createdBy: _by,
    createTime: _created,
    updateTime: _updated,
    ...input
  } = version
  return input
}

export type AppVersionField = keyof Pick<
  AppVersionInput,
  | 'version'
  | 'requiredVersion'
  | 'titleMn'
  | 'titleEn'
  | 'descriptionMn'
  | 'descriptionEn'
>

/** Вэбийн `appVersionWriteSchema` — текст талбар бүгд заавал. */
export function validateAppVersion(input: AppVersionInput): AppVersionField[] {
  const fields: AppVersionField[] = [
    'version',
    'requiredVersion',
    'titleMn',
    'titleEn',
    'descriptionMn',
    'descriptionEn',
  ]
  return fields.filter((field) => !input[field].trim())
}
