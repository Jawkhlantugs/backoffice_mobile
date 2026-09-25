import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

import {
  bannerToInput,
  EMPTY_BANNER,
} from '@/data/mobile-banner/mobile-banner-model'
import {
  useMobileBanner,
  useSaveMobileBanner,
} from '@/hooks/use-mobile-banners'
import { messages } from '@/lib/messages'

import { MobileBannerForm } from './mobile-banner-form'

export function EditMobileBannerScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const banner = useMobileBanner(id)
  const save = useSaveMobileBanner(id)
  const initial = useMemo(
    () => (banner.data ? bannerToInput(banner.data) : EMPTY_BANNER),
    [banner.data],
  )

  return (
    <MobileBannerForm
      title={messages.mobileContent.banners.edit}
      initial={initial}
      submitLabel={messages.form.save}
      loading={banner.isPending}
      error={banner.error}
      onRetry={() => banner.refetch()}
      onSubmit={async (input) => {
        await save.mutateAsync(input)
        router.back()
      }}
    />
  )
}
