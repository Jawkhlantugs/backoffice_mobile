/** `banners.types.ts`-ийн утгууд — вэбтэй ижил string. */
export const BANNER_TYPES = ['link', 'deep_link'] as const
export const BANNER_STATUSES = ['active', 'inactive'] as const
export const BANNER_TARGETS = ['mobile', 'web'] as const

export type BannerType = (typeof BANNER_TYPES)[number]
export type BannerStatus = (typeof BANNER_STATUSES)[number]
export type BannerTarget = (typeof BANNER_TARGETS)[number]

/** `mobileBannerSchema`. */
export type MobileBanner = {
  id: string
  titleEn: string
  titleMn: string
  descriptionEn: string
  descriptionMn: string
  image: string
  link: string
  buttonTitleEn: string
  buttonTitleMn: string
  status: BannerStatus
  type: BannerType
  priority: number
  target: BannerTarget
  createdBy?: string
  createTime: number
  updateTime?: number
}

/** Үүсгэх/засах форм — `mobileBannerWriteSchema`. */
export type MobileBannerInput = Omit<
  MobileBanner,
  'id' | 'createdBy' | 'createTime' | 'updateTime'
>

/** Вэбийн `banner-form.tsx`-ийн анхны утга. */
export const EMPTY_BANNER: MobileBannerInput = {
  titleEn: '',
  titleMn: '',
  descriptionEn: '',
  descriptionMn: '',
  image: '',
  link: '',
  buttonTitleEn: 'Explore Now',
  buttonTitleMn: 'Дэлгэрэнгүй',
  status: 'active',
  type: 'link',
  priority: 0,
  target: 'mobile',
}

export function bannerToInput(banner: MobileBanner): MobileBannerInput {
  return {
    titleEn: banner.titleEn,
    titleMn: banner.titleMn,
    descriptionEn: banner.descriptionEn,
    descriptionMn: banner.descriptionMn,
    image: banner.image,
    link: banner.link,
    buttonTitleEn: banner.buttonTitleEn || EMPTY_BANNER.buttonTitleEn,
    buttonTitleMn: banner.buttonTitleMn || EMPTY_BANNER.buttonTitleMn,
    status: banner.status,
    type: banner.type,
    priority: banner.priority,
    target: banner.target,
  }
}

export type BannerField = 'titleEn' | 'titleMn' | 'image' | 'priority'

/** Вэбийн `mobileBannerWriteSchema`: гарчиг хоёр хэл, зураг заавал. */
export function validateBanner(input: MobileBannerInput): BannerField[] {
  const missing: BannerField[] = []
  if (!input.titleMn.trim()) missing.push('titleMn')
  if (!input.titleEn.trim()) missing.push('titleEn')
  if (!input.image) missing.push('image')
  if (!Number.isInteger(input.priority)) missing.push('priority')
  return missing
}
