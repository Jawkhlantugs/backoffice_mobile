import '@/theme/global.css'

import { Fragment, useEffect, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { adminRepository } from '@/data/auth/admin-repository'
import { configureAmplify } from '@/core/config/amplify'
import { assertEnvReady } from '@/core/config/env'
import { queryClient } from '@/core/query/query-client'
import { useAppLock } from '@/core/session/use-app-lock'
import { useSessionStore } from '@/core/session/session-store'
import { useThemeStore } from '@/theme/theme-preference'
import { AppLoader, AppText, Screen, ToastHost } from '@/components'
import { biometricService } from '@/services/biometric/biometric-service'
import { cognitoAuth } from '@/services/auth/cognito-auth-service'
import { logger } from '@/lib/logger'
import { messages, useLanguageStore } from '@/lib/messages'
import { useAppColors } from '@/theme/use-theme'

import { LockScreen } from '@/screens/lock-screen'
import { SignInScreen } from '@/screens/sign-in-screen'

/**
 * Апп асах дараалал (docs/FLOWS.md §3):
 * 1. env шалгах → 2. Amplify тохируулах → 3. session сэргээх →
 * 4. түгжээ шийдэх → 5. route.
 */
export default function RootLayout() {
  const [fatal, setFatal] = useState<string | null>(null)
  const status = useSessionStore((state) => state.status)
  const setStatus = useSessionStore((state) => state.setStatus)
  const restore = useSessionStore((state) => state.restore)
  const signOut = useSessionStore((state) => state.signOut)
  const { scheme } = useAppColors()
  const restoreTheme = useThemeStore((store) => store.restore)
  const language = useLanguageStore((store) => store.language)
  const restoreLanguage = useLanguageStore((store) => store.restore)

  useAppLock()

  useEffect(() => {
    async function boot() {
      // Theme, хэлийг хамгийн түрүүнд — эс бөгөөс анхны кадр өөр өнгө, хэлээр
      // анивчина.
      await Promise.all([restoreTheme(), restoreLanguage()])

      try {
        assertEnvReady()
        configureAmplify()
      } catch (error) {
        setFatal(error instanceof Error ? error.message : String(error))
        return
      }

      if (!(await cognitoAuth.isAuthenticated())) {
        setStatus('signedOut')
        return
      }

      // Профайлыг түгжээнээс **өмнө** татна: session сэргээхэд `user` хоосон
      // үлдвэл түгжээ тайлах товч юу ч хийхгүй, апп гацна.
      try {
        const [profile, locked] = await Promise.all([
          adminRepository.profile(),
          biometricService.isEnabled(),
        ])
        restore(profile, locked)
      } catch (error) {
        logger.warn('Session сэргээх амжилтгүй', error)
        await signOut()
      }
    }

    void boot()
  }, [restore, restoreLanguage, restoreTheme, setStatus, signOut])

  if (fatal) {
    return (
      <SafeAreaProvider>
        <Screen className="items-center justify-center">
          <AppText variant="title" className="text-destructive">
            {messages.common.configError}
          </AppText>
          <AppText variant="body" className="mt-2 text-center">
            {fatal}
          </AppText>
        </Screen>
      </SafeAreaProvider>
    )
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {/* Хэл солигдоход бүх дэлгэцийг шинээр mount хийнэ — React Compiler
              memo хийсэн текст хуучин хэлээр үлдэхгүй. */}
          <Fragment key={language}>
            {status === 'loading' ? (
              <Screen className="justify-center">
                <AppLoader />
              </Screen>
            ) : status === 'locked' ? (
              <LockScreen />
            ) : status === 'signedOut' ? (
              <SignInScreen />
            ) : (
              <Stack screenOptions={{ headerShown: false }} />
            )}
          </Fragment>
          <ToastHost />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
