/**
 * Support багийн тохиргоо — вэбийн `features/portal/support/{macros,
 * support-user,support-user-roles,support-user-teams,ticket-category}`.
 * Бүгд `createdBy` нь үүсгэсэн админы имэйл (байхгүй бол id).
 */
type Audit = {
  isActive: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export type SupportMacro = Audit & {
  id: string
  name: string
  description?: string
  /** HTML-ийг цэвэрлэсэн текст — зөвхөн харуулах. */
  value: string
}

export type SupportAgent = Audit & {
  id: string
  email?: string
  name: string
  role?: string
  team?: string
}

export type SupportRole = Audit & {
  id: string
  name: string
  description?: string
  categoryCount: number
}

export type SupportTeam = Audit & {
  id: string
  name: string
  description?: string
  ticketsCount?: number
}

export type SupportCategory = Audit & {
  id: string
  nameEn: string
  nameMn: string
  type?: string
  /** Эцэг ангиллын нэр — дэд ангилалд л. */
  parent?: string
  ticketsCount?: number
}
