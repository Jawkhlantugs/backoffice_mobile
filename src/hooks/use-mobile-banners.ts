import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { BannerType, MobileBannerInput } from '@/data/mobile-banner/mobile-banner-model'
import { mobileBannerRepository } from '@/data/mobile-banner/mobile-banner-repository'
import { pickImage } from '@/services/media/image-picker-service'

import { useCursorList } from './use-cursor-list'

const KEY = 'mobile-banners'

export const useMobileBanners = (type?: BannerType) =>
  useCursorList(KEY, mobileBannerRepository.list, { filters: { type } })

export function useMobileBanner(id: string) {
  return useQuery({
    queryKey: [KEY, 'detail', id],
    queryFn: () => mobileBannerRepository.byId(id),
    enabled: id.length > 0,
  })
}

/** `id` байвал засна, үгүй бол шинээр үүсгэнэ — нэг форм хоёуланд. */
export function useSaveMobileBanner(id?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MobileBannerInput) =>
      id ? mobileBannerRepository.update(id, input) : mobileBannerRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [KEY] })
    },
  })
}

/** Сонгож, шууд upload хийгээд URL буцаана. Цуцалбал `null`. */
export function useUploadBannerImage() {
  return useMutation({
    mutationFn: async () => {
      const image = await pickImage()
      return image ? mobileBannerRepository.uploadImage(image) : null
    },
  })
}
