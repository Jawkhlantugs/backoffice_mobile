import {
  validateAppVersion,
  EMPTY_APP_VERSION,
} from '@/data/app-version/app-version-model'

import { toBannerWrite, toMobileBanner } from '../mobile-banner-dto'
import {
  bannerToInput,
  EMPTY_BANNER,
  validateBanner,
} from '../mobile-banner-model'

describe('mobile banner', () => {
  it('snake_case ↔ model хоёр тийш алдагдалгүй', () => {
    const banner = toMobileBanner({
      id: 'b1',
      title_en: ' Hello ',
      title_mn: 'Сайн уу',
      image: 'https://cdn/x.png',
      status: 'inactive',
      type: 'deep_link',
      priority: 3,
      for_type: 'web',
      createTime: 1,
    })
    const write = toBannerWrite(bannerToInput(banner))
    expect(write).toMatchObject({
      title_en: 'Hello',
      title_mn: 'Сайн уу',
      status: 'inactive',
      type: 'deep_link',
      priority: 3,
      for_type: 'web',
      button_title_mn: 'Дэлгэрэнгүй',
    })
  })

  it('гарчиг хоёр хэл, зураг заавал, эрэмбэ бүхэл тоо', () => {
    expect(validateBanner(EMPTY_BANNER)).toEqual([
      'titleMn',
      'titleEn',
      'image',
    ])
    expect(
      validateBanner({
        ...EMPTY_BANNER,
        titleMn: 'a',
        titleEn: 'b',
        image: 'u',
        priority: 1.5,
      }),
    ).toEqual(['priority'])
  })

  it('app version-д текст талбар бүгд заавал', () => {
    expect(validateAppVersion(EMPTY_APP_VERSION)).toHaveLength(6)
  })
})
