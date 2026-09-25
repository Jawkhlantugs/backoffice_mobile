import { useState } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppHeader,
  AppInput,
  AppText,
  ConfirmSheet,
  Screen,
  ToggleRow,
} from '@/components'
import { useCreatePushNotification } from '@/hooks/use-push-notifications'
import { messages, translateUnknownError } from '@/lib/messages'

const MAX_EMAILS = 20
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

type FormErrors = { title?: string; message?: string; emails?: string }

function parseEmails(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0)
}

function validate(
  title: string,
  message: string,
  isBroadcast: boolean,
  emails: string[],
): FormErrors {
  const errors: FormErrors = {}
  if (!title.trim())
    errors.title = messages.pushNotifications.form.titleRequired
  if (!message.trim())
    errors.message = messages.pushNotifications.form.messageRequired
  if (!isBroadcast) {
    if (emails.length === 0) {
      errors.emails = messages.pushNotifications.form.emailsRequired
    } else if (
      emails.length > MAX_EMAILS ||
      emails.some((email) => !EMAIL_PATTERN.test(email))
    ) {
      errors.emails = messages.pushNotifications.form.emailsHint
    }
  }
  return errors
}

export function NewPushNotificationScreen() {
  const router = useRouter()
  const create = useCreatePushNotification()

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isBroadcast, setIsBroadcast] = useState(true)
  const [emailsRaw, setEmailsRaw] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [confirming, setConfirming] = useState(false)

  const emails = parseEmails(emailsRaw)

  function handleSubmit() {
    const found = validate(title, message, isBroadcast, emails)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setConfirming(true)
  }

  return (
    <Screen>
      <AppHeader
        title={messages.pushNotifications.newButton}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />

      <ScrollView contentContainerClassName="gap-4 pb-8">
        <AppInput
          label={messages.pushNotifications.form.title}
          placeholder={messages.pushNotifications.form.titlePlaceholder}
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <AppInput
          label={messages.pushNotifications.form.message}
          placeholder={messages.pushNotifications.form.messagePlaceholder}
          value={message}
          onChangeText={setMessage}
          multiline
          error={errors.message}
        />

        <ToggleRow
          icon="push"
          title={messages.pushNotifications.form.broadcast}
          value={isBroadcast}
          onChange={setIsBroadcast}
        />

        {!isBroadcast ? (
          <AppInput
            label={messages.pushNotifications.form.emails}
            placeholder={messages.pushNotifications.form.emailsPlaceholder}
            value={emailsRaw}
            onChangeText={setEmailsRaw}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.emails}
          />
        ) : null}

        {!isBroadcast ? (
          <AppText variant="caption">
            {messages.pushNotifications.form.emailsHint}
          </AppText>
        ) : null}

        {create.error ? (
          <AppText variant="body" className="text-center text-destructive">
            {translateUnknownError(create.error)}
          </AppText>
        ) : null}

        <View className="pt-2">
          <AppButton
            label={messages.pushNotifications.form.submit}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={confirming}
        title={messages.pushNotifications.newButton}
        description={`${title} · ${isBroadcast ? messages.pushNotifications.form.broadcast : `${emails.length} имэйл`}`}
        confirmLabel={messages.pushNotifications.form.submit}
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          await create.mutateAsync({ title, message, isBroadcast, emails })
          setConfirming(false)
          router.back()
        }}
      />
    </Screen>
  )
}
