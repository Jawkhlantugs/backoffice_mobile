import type {
  FooterCategory,
  FooterContact,
  FooterItem,
  HeadConfig,
  NewsArticle,
  PageCategory,
  SitePage,
  WebFile,
  WithdrawalLimit,
} from './site-content-model'

/** Footer-ийн `is_active` нь boolean, '1'/'0', 1/0 гурвын аль нь ч ирнэ. */
type ActiveDto = boolean | '1' | '0' | 1 | 0 | undefined

export function toActive(value: ActiveDto): boolean {
  return value === true || value === 1 || value === '1'
}

const text = (value: string | null | undefined) => value || undefined

type Timestamps = {
  created_at?: string
  createdAt?: string | number
  updated_at?: string
  updatedAt?: string | number
}

export type FooterCategoryDto = Timestamps & {
  cid: string
  name_mn?: string
  name_en?: string
  is_active?: ActiveDto
}

export type FooterItemDto = Timestamps & {
  uid: string
  type?: string
  name_mn?: string
  name_en?: string
  category_id?: string
  link?: string
  order?: number
  is_active?: ActiveDto
  target?: string
}

export type FooterContactDto = {
  phone?: string | null
  mail?: string | null
  location_mn?: string | null
  location_en?: string | null
  youtube?: string | null
  linked_in?: string | null
  facebook?: string | null
  twitter?: string | null
  instagram?: string | null
  telegram?: string | null
  alert_desc?: string | null
  alert_desc_en?: string | null
}

export type WithdrawalLimitDto = {
  bank?: { min?: number; limit?: number }
  crypto?: { limit?: number }
  updateBy?: string
  updatedAt?: number
}

export type SitePageDto = {
  id: string
  page_category_id?: string
  type?: string
  file_url?: string
  name_mn?: string
  name_en?: string
  short_mn?: string
  status?: string
  createdDate?: string | number
  updatedAt?: number
}

export type PageCategoryDto = {
  cuid: string
  name_mn?: string
  name_en?: string
  description_mn?: string
  status?: string
  createdDate?: number | string
  updatedAt?: number
}

export type WebFileDto = {
  name: string
  fileType?: string
  path?: string
  createdAt?: number
  updatedAt?: number
}

export type HeadConfigDto = {
  pk: string
  app?: string
  route?: string
  locale?: string | null
  meta?: unknown[]
  links?: unknown[]
  scripts?: unknown[]
  enabled?: boolean
  update_at?: number
}

export type NewsDto = {
  id: string
  name_mn?: string
  name_en?: string
  category?: string
  img?: string
  status?: string
  postDate?: string
  createdDate?: string
  like?: number
  views?: number
}

export function toFooterCategory(dto: FooterCategoryDto): FooterCategory {
  return {
    id: dto.cid,
    nameMn: dto.name_mn ?? '',
    nameEn: dto.name_en ?? '',
    isActive: toActive(dto.is_active),
    createdAt: dto.created_at ?? dto.createdAt,
    updatedAt: dto.updated_at ?? dto.updatedAt,
  }
}

export function toFooterItem(dto: FooterItemDto): FooterItem {
  return {
    id: dto.uid,
    nameMn: dto.name_mn ?? '',
    nameEn: dto.name_en ?? '',
    type: text(dto.type),
    categoryId: text(dto.category_id),
    link: text(dto.link),
    target: text(dto.target),
    order: dto.order,
    isActive: toActive(dto.is_active),
    createdAt: dto.created_at ?? dto.createdAt,
  }
}

export function toFooterContact(dto: FooterContactDto): FooterContact {
  return {
    phone: text(dto.phone),
    mail: text(dto.mail),
    locationMn: text(dto.location_mn),
    locationEn: text(dto.location_en),
    facebook: text(dto.facebook),
    instagram: text(dto.instagram),
    twitter: text(dto.twitter),
    youtube: text(dto.youtube),
    linkedIn: text(dto.linked_in),
    telegram: text(dto.telegram),
    alertMn: text(dto.alert_desc),
    alertEn: text(dto.alert_desc_en),
  }
}

export function toWithdrawalLimit(dto: WithdrawalLimitDto): WithdrawalLimit {
  return {
    bankMin: String(dto.bank?.min ?? ''),
    bankLimit: String(dto.bank?.limit ?? ''),
    cryptoLimit: String(dto.crypto?.limit ?? ''),
    updatedBy: text(dto.updateBy),
    updatedAt: dto.updatedAt,
  }
}

export function toSitePage(dto: SitePageDto): SitePage {
  return {
    id: dto.id,
    nameMn: dto.name_mn ?? '',
    nameEn: dto.name_en ?? '',
    type: text(dto.type),
    categoryId: text(dto.page_category_id),
    fileUrl: text(dto.file_url),
    shortMn: text(dto.short_mn),
    status: dto.status ?? '',
    createdAt: dto.createdDate,
    updatedAt: dto.updatedAt,
  }
}

export function toPageCategory(dto: PageCategoryDto): PageCategory {
  return {
    id: dto.cuid,
    nameMn: dto.name_mn ?? '',
    nameEn: dto.name_en ?? '',
    descriptionMn: text(dto.description_mn),
    status: dto.status ?? '',
    createdAt: dto.createdDate,
    updatedAt: dto.updatedAt,
  }
}

export function toWebFile(dto: WebFileDto): WebFile {
  return {
    name: dto.name,
    fileType: dto.fileType ?? '',
    path: dto.path ?? '',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}

export function toHeadConfig(dto: HeadConfigDto): HeadConfig {
  return {
    id: dto.pk,
    app: dto.app ?? '',
    route: dto.route ?? '',
    locale: text(dto.locale),
    metaCount: dto.meta?.length ?? 0,
    linkCount: dto.links?.length ?? 0,
    scriptCount: dto.scripts?.length ?? 0,
    enabled: dto.enabled ?? false,
    updatedAt: dto.update_at,
  }
}

/** Вэбийн `transformNewsApiResponse` — `active`-аас бусад нь идэвхгүй. */
export function toNewsArticle(dto: NewsDto): NewsArticle {
  return {
    id: dto.id,
    nameMn: dto.name_mn ?? '',
    nameEn: dto.name_en ?? '',
    category: (dto.category ?? '').toLowerCase(),
    status: dto.status === 'active' ? 'active' : 'inactive',
    views: dto.views,
    likes: dto.like,
    imageUrl: text(dto.img),
    publishedAt: text(dto.postDate),
    createdAt: dto.createdDate ?? '',
  }
}
