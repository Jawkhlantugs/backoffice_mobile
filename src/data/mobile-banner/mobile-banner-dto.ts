import type {
  BannerStatus,
  BannerTarget,
  BannerType,
  MobileBanner,
  MobileBannerInput,
} from './mobile-banner-model'

export type MobileBannerDto = {
  id: string
  title_en?: string
  title_mn?: string
  description_en?: string
  description_mn?: string
  image?: string
  link?: string
  button_title_en?: string
  button_title_mn?: string
  status?: string
  type?: string
  priority?: number
  for_type?: string
  createdBy?: string
  createTime?: number
  updateTime?: number
}

export function toMobileBanner(dto: MobileBannerDto): MobileBanner {
  return {
    id: dto.id,
    titleEn: dto.title_en ?? '',
    titleMn: dto.title_mn ?? '',
    descriptionEn: dto.description_en ?? '',
    descriptionMn: dto.description_mn ?? '',
    image: dto.image ?? '',
    link: dto.link ?? '',
    buttonTitleEn: dto.button_title_en ?? '',
    buttonTitleMn: dto.button_title_mn ?? '',
    status: (dto.status === 'inactive'
      ? 'inactive'
      : 'active') satisfies BannerStatus,
    type: (dto.type === 'deep_link'
      ? 'deep_link'
      : 'link') satisfies BannerType,
    priority: dto.priority ?? 0,
    target: (dto.for_type === 'web' ? 'web' : 'mobile') satisfies BannerTarget,
    createdBy: dto.createdBy,
    createTime: dto.createTime ?? 0,
    updateTime: dto.updateTime,
  }
}

/** Вэбийн `MobileBannerWriteForm` — snake_case. */
export function toBannerWrite(input: MobileBannerInput) {
  return {
    title_en: input.titleEn.trim(),
    title_mn: input.titleMn.trim(),
    description_en: input.descriptionEn.trim(),
    description_mn: input.descriptionMn.trim(),
    image: input.image,
    link: input.link.trim(),
    button_title_en: input.buttonTitleEn.trim(),
    button_title_mn: input.buttonTitleMn.trim(),
    status: input.status,
    type: input.type,
    priority: input.priority,
    for_type: input.target,
  }
}
