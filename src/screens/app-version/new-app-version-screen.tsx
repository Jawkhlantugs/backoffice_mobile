import { useRouter } from 'expo-router'

import { EMPTY_APP_VERSION } from '@/data/app-version/app-version-model'
import { useSaveAppVersion } from '@/hooks/use-app-versions'
import { messages } from '@/lib/messages'

import { AppVersionForm } from './app-version-form'

export function NewAppVersionScreen() {
  const router = useRouter()
  const save = useSaveAppVersion()

  return (
    <AppVersionForm
      title={messages.mobileContent.versions.new}
      initial={EMPTY_APP_VERSION}
      submitLabel={messages.form.create}
      onSubmit={async (input) => {
        await save.mutateAsync(input)
        router.back()
      }}
    />
  )
}
