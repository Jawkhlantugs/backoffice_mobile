import { useState } from 'react'

import { AppInput, ChoiceField, FormScreen, FormSection } from '@/components'
import { toast } from '@/core/ui/toast-store'
import {
  APP_OS,
  APP_VERSION_STATUSES,
  UPDATE_MODES,
  validateAppVersion,
  type AppVersionField,
  type AppVersionInput,
} from '@/data/app-version/app-version-model'
import { messages } from '@/lib/messages'

const text = messages.mobileContent
const f = text.fields

/** App version үүсгэх/засах нэг форм (вэбийн `version-form.tsx`). */
export function AppVersionForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  loading,
  error,
  onRetry,
}: {
  title: string
  initial: AppVersionInput
  submitLabel: string
  onSubmit: (input: AppVersionInput) => Promise<void>
  loading?: boolean
  error?: unknown
  onRetry?: () => void
}) {
  const [input, setInput] = useState(initial)
  const [missing, setMissing] = useState<AppVersionField[]>([])

  // Засах үед өгөгдөл ачаалж дуусахад формыг түүгээр дүүргэнэ.
  const [source, setSource] = useState(initial)
  if (initial !== source) {
    setSource(initial)
    setInput(initial)
  }

  const set = <K extends keyof AppVersionInput>(
    key: K,
    value: AppVersionInput[K],
  ) => setInput((current) => ({ ...current, [key]: value }))
  const err = (field: AppVersionField) =>
    missing.includes(field) ? messages.form.required : undefined
  const textInput = (field: AppVersionField, label: string, multiline = false) => (
    <AppInput
      label={`${label} *`}
      value={input[field]}
      onChangeText={(value) => set(field, value)}
      multiline={multiline}
      autoCapitalize={field.endsWith('ersion') ? 'none' : 'sentences'}
      error={err(field)}
    />
  )

  async function submit() {
    const found = validateAppVersion(input)
    setMissing(found)
    if (found.length > 0) return
    await onSubmit(input)
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
      <FormSection title={messages.form.settings}>
        <ChoiceField
          label={f.os}
          options={APP_OS.map((value) => ({ value, label: text.os[value] }))}
          value={input.os}
          onChange={(value) => set('os', value)}
        />
        {textInput('version', f.version)}
        {textInput('requiredVersion', f.requiredVersion)}
        <ChoiceField
          label={f.updateMode}
          options={UPDATE_MODES.map((value) => ({
            value,
            label: text.updateModes[value],
          }))}
          value={input.updateMode}
          onChange={(value) => set('updateMode', value)}
        />
        <ChoiceField
          label={f.status}
          options={APP_VERSION_STATUSES.map((value) => ({
            value,
            label: text.statuses[value],
          }))}
          value={input.status}
          onChange={(value) => set('status', value)}
        />
      </FormSection>

      <FormSection title={messages.form.mongolian}>
        {textInput('titleMn', f.title)}
        {textInput('descriptionMn', f.description, true)}
      </FormSection>

      <FormSection title={messages.form.english}>
        {textInput('titleEn', f.title)}
        {textInput('descriptionEn', f.description, true)}
      </FormSection>
    </FormScreen>
  )
}
