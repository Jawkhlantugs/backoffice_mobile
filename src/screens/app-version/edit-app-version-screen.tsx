import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

import {
  appVersionToInput,
  EMPTY_APP_VERSION,
} from '@/data/app-version/app-version-model'
import { useAppVersion, useSaveAppVersion } from '@/hooks/use-app-versions'
import { messages } from '@/lib/messages'

import { AppVersionForm } from './app-version-form'

export function EditAppVersionScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const version = useAppVersion(id)
  const save = useSaveAppVersion(id)
  const initial = useMemo(
    () => (version.data ? appVersionToInput(version.data) : EMPTY_APP_VERSION),
    [version.data],
  )

  return (
    <AppVersionForm
      title={messages.mobileContent.versions.edit}
      initial={initial}
      submitLabel={messages.form.save}
      loading={version.isPending}
      error={version.error}
      onRetry={() => version.refetch()}
      onSubmit={async (input) => {
        await save.mutateAsync(input)
        router.back()
      }}
    />
  )
}
