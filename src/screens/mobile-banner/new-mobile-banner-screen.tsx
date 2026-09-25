import { useRouter } from 'expo-router'

import { EMPTY_BANNER } from '@/data/mobile-banner/mobile-banner-model'
import { useSaveMobileBanner } from '@/hooks/use-mobile-banners'
import { messages } from '@/lib/messages'

import { MobileBannerForm } from './mobile-banner-form'

export function NewMobileBannerScreen() {
  const router = useRouter()
  const save = useSaveMobileBanner()

  return (
    <MobileBannerForm
      title={messages.mobileContent.banners.new}
      initial={EMPTY_BANNER}
      submitLabel={messages.form.create}
      onSubmit={async (input) => {
        await save.mutateAsync(input)
        router.back()
      }}
    />
  )
}
