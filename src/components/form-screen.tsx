import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'

import { messages } from '@/lib/messages'

import { AppButton } from './app-button'
import { AppHeader } from './app-header'
import { Screen } from './screen'
import { StateView } from './state-view'

/**
 * Нэмэх/засах формын бүтэн дэлгэц: буцах толгой, гарны ард нуугдахгүй
 * scroll, доод талд үргэлж харагдах хадгалах товч. Засах үед өгөгдөл
 * ачаалж дуустал форм гарахгүй (`loading`/`error`).
 */
export function FormScreen({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  loading = false,
  error,
  onRetry,
  children,
}: {
  title: string
  subtitle?: string
  submitLabel: string
  onSubmit: () => void | Promise<void>
  loading?: boolean
  error?: unknown
  onRetry?: () => void
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <Screen>
      <AppHeader
        title={title}
        subtitle={subtitle}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StateView loading={loading} error={error} onRetry={onRetry}>
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-6 pb-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          <View className="pb-2 pt-3">
            <AppButton label={submitLabel} icon="check" onPress={onSubmit} />
          </View>
        </StateView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
