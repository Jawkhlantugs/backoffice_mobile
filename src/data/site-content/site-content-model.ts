/**
 * Вэб сайтын агуулга — content service (`footer-menu`, `pages`,
 * `page-categories`, `web-files`, `head-config`, `withdraw-limit`) ба news
 * service. Огноо нь string эсвэл ms тоо ирдэг — `formatDate` хоёуланг барина.
 */
type Timestamp = string | number | undefined

export type FooterCategory = {
  id: string
  nameMn: string
  nameEn: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const FOOTER_ITEM_TYPES = [
  'content',
  'category',
  'link',
  'default',
] as const

export type FooterItem = {
  id: string
  nameMn: string
  nameEn: string
  type?: string
  categoryId?: string
  link?: string
  target?: string
  order?: number
  isActive: boolean
  createdAt: Timestamp
}

/** Footer-ийн холбоо барих мэдээлэл — нэг бичлэг. */
export type FooterContact = {
  phone?: string
  mail?: string
  locationMn?: string
  locationEn?: string
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  linkedIn?: string
  telegram?: string
  alertMn?: string
  alertEn?: string
}

/**
 * Хэрэглэгчид харагдах татан авалтын хязгаар. Вэб валют заадаггүй бүхэл тоо
 * (`parseIntegerInput`) — мөр хэлбэрээр, зөвхөн харуулна (§10).
 */
export type WithdrawalLimit = {
  bankMin: string
  bankLimit: string
  cryptoLimit: string
  updatedBy?: string
  updatedAt: Timestamp
}

export const SITE_STATUSES = ['active', 'inactive'] as const

export type SitePage = {
  id: string
  nameMn: string
  nameEn: string
  type?: string
  categoryId?: string
  fileUrl?: string
  shortMn?: string
  status: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type PageCategory = {
  id: string
  nameMn: string
  nameEn: string
  descriptionMn?: string
  status: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const WEB_FILE_TYPES = ['image', 'video', 'document'] as const
export type WebFileType = (typeof WEB_FILE_TYPES)[number]

export type WebFile = {
  name: string
  fileType: string
  path: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type HeadConfig = {
  id: string
  app: string
  route: string
  locale?: string
  metaCount: number
  linkCount: number
  scriptCount: number
  enabled: boolean
  updatedAt: Timestamp
}

export type NewsArticle = {
  id: string
  nameMn: string
  nameEn: string
  category: string
  status: string
  views?: number
  likes?: number
  imageUrl?: string
  publishedAt?: string
  createdAt: string
}
