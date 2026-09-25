import { clients } from '@/core/network/clients'
import {
  unwrap,
  type CursorParams,
  type ListPage,
} from '@/core/network/envelope'
import { AppErrors } from '@/core/errors/app-exception'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'
import type { PickedImage } from '@/services/media/image-picker-service'

import {
  toBannerWrite,
  toMobileBanner,
  type MobileBannerDto,
} from './mobile-banner-dto'
import type {
  BannerType,
  MobileBanner,
  MobileBannerInput,
} from './mobile-banner-model'

/** Endpoint: `banners.service.ts` — `{content}/mobile/banner…`. */
export const mobileBannerRepository = {
  list: (
    params: CursorParams & { type?: BannerType },
  ): Promise<ListPage<MobileBanner>> =>
    fetchCursorList(
      clients.content,
      '/mobile/banner-list',
      params,
      { limit: params.limit, type: params.type },
      toMobileBanner,
    ),

  async byId(id: string): Promise<MobileBanner> {
    const response = await clients.content.get(`/mobile/banner/${id}`)
    const dto = unwrap<MobileBannerDto | null>(response.data)
    if (!dto) throw AppErrors.parse(`banner ${id} хоосон ирлээ`)
    return toMobileBanner(dto)
  },

  async create(input: MobileBannerInput): Promise<void> {
    await clients.content.post('/mobile/banner', toBannerWrite(input))
  },

  async update(id: string, input: MobileBannerInput): Promise<void> {
    await clients.content.put(`/mobile/banner/${id}`, toBannerWrite(input))
  },

  /** Вэбтэй ижил multipart (`file` + `filename`) → нийтийн URL. */
  async uploadImage(image: PickedImage): Promise<string> {
    const form = new FormData()
    // RN-ийн FormData нь `{uri, name, type}` объектыг файл гэж уншдаг.
    form.append('file', {
      uri: image.uri,
      name: image.name,
      type: image.mimeType,
    } as never)
    form.append('filename', image.name)
    const response = await clients.content.post(
      '/mobile/banner/upload-image',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    const url = unwrap<{ bannerImageUrl?: string } | null>(
      response.data,
    )?.bannerImageUrl
    if (!url) throw AppErrors.parse('bannerImageUrl ирсэнгүй')
    return url
  },
}
