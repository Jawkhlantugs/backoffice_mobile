import { useState } from 'react'

import {
  AppInput,
  ChoiceField,
  FormScreen,
  FormSection,
  ImageField,
} from '@/components'
import { toast } from '@/core/ui/toast-store'
import {
  BANNER_STATUSES,
  BANNER_TARGETS,
  BANNER_TYPES,
  validateBanner,
  type BannerField,
  type MobileBannerInput,
} from '@/data/mobile-banner/mobile-banner-model'
import { useUploadBannerImage } from '@/hooks/use-mobile-banners'
import { messages } from '@/lib/messages'

const text = messages.mobileContent
const f = text.fields

/**
 * Banner үүсгэх/засах нэг форм (вэбийн `banner-form.tsx`). Зураг сонгонгуут
 * upload хийгдэж URL нь `image`-д орно — хадгалахад зөвхөн URL явна.
 */
export function MobileBannerForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  loading,
  error,
  onRetry,
}: {
  title: string
  initial: MobileBannerInput
  submitLabel: string
  onSubmit: (input: MobileBannerInput) => Promise<void>
  loading?: boolean
  error?: unknown
  onRetry?: () => void
}) {
  const [input, setInput] = useState(initial)
  const [priorityText, setPriorityText] = useState(String(initial.priority))
  const [missing, setMissing] = useState<BannerField[]>([])
  const upload = useUploadBannerImage()

  // Засах үед өгөгдөл ачаалж дуусахад формыг түүгээр дүүргэнэ.
  const [source, setSource] = useState(initial)
  if (initial !== source) {
    setSource(initial)
    setInput(initial)
    setPriorityText(String(initial.priority))
  }

  const set = <K extends keyof MobileBannerInput>(
    key: K,
    value: MobileBannerInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }))
  const err = (field: BannerField) =>
    missing.includes(field)
      ? field === 'priority'
        ? messages.form.invalidNumber
        : messages.form.required
      : undefined

  async function pick() {
    const url = await upload.mutateAsync()
    if (url) set('image', url)
  }

  async function submit() {
    const next = { ...input, priority: Number(priorityText.trim() || '0') }
    const found = validateBanner(next)
    setMissing(found)
    if (found.length > 0) return
    await onSubmit(next)
    toast.success(messages.form.saved)
  }

  return (
    <FormScreen
      title={title}
      submitLabel={submitLabel}
      onSubmit={submit}
      loading={loading}
      error={error}
      onRetry={onRetry}
    >
      <ImageField
        label={f.image}
        uri={input.image || undefined}
        onPick={() => void pick()}
        uploading={upload.isPending}
        error={err('image')}
      />

      <FormSection title={messages.form.mongolian}>
        <AppInput
          label={`${f.title} *`}
          value={input.titleMn}
          onChangeText={(value) => set('titleMn', value)}
          error={err('titleMn')}
        />
        <AppInput
          label={f.description}
          value={input.descriptionMn}
          onChangeText={(value) => set('descriptionMn', value)}
          multiline
        />
        <AppInput
          label={f.buttonTitle}
          value={input.buttonTitleMn}
          onChangeText={(value) => set('buttonTitleMn', value)}
        />
      </FormSection>

      <FormSection title={messages.form.english}>
        <AppInput
          label={`${f.title} *`}
          value={input.titleEn}
          onChangeText={(value) => set('titleEn', value)}
          error={err('titleEn')}
        />
        <AppInput
          label={f.description}
          value={input.descriptionEn}
          onChangeText={(value) => set('descriptionEn', value)}
          multiline
        />
        <AppInput
          label={f.buttonTitle}
          value={input.buttonTitleEn}
          onChangeText={(value) => set('buttonTitleEn', value)}
        />
      </FormSection>

      <FormSection title={messages.form.settings}>
        <AppInput
          label={f.link}
          value={input.link}
          onChangeText={(value) => set('link', value)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ChoiceField
          label={f.type}
          options={BANNER_TYPES.map((value) => ({
            value,
            label: text.types[value],
          }))}
          value={input.type}
          onChange={(value) => set('type', value)}
        />
        <ChoiceField
          label={f.status}
          options={BANNER_STATUSES.map((value) => ({
            value,
            label: text.statuses[value],
          }))}
          value={input.status}
          onChange={(value) => set('status', value)}
        />
        <ChoiceField
          label={f.target}
          options={BANNER_TARGETS.map((value) => ({
            value,
            label: text.targets[value],
          }))}
          value={input.target}
          onChange={(value) => set('target', value)}
        />
        <AppInput
          label={f.priority}
          value={priorityText}
          onChangeText={setPriorityText}
          keyboardType="number-pad"
          error={err('priority')}
        />
      </FormSection>
    </FormScreen>
  )
}
