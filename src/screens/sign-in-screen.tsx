import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { AppButton, AppCard, AppInput, AppText, Screen } from '@/components'
import { useSignIn } from '@/hooks/use-sign-in'
import { messages } from '@/lib/messages'

/**
 * Cognito-ийн олон алхамт нэвтрэлт нэг дэлгэц дээр. Route **биш** —
 * `_layout` нь `signedOut` үед үүнийг шууд render хийдэг тул нэвтрээгүй
 * админ ямар ч route-д хүрэхгүй (FLOWS.md §3).
 */
export function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [answer, setAnswer] = useState('')
  const auth = useSignIn()

  // Narrowing тогтвортой байхын тулд stage-ийг const-д авна.
  const stage = auth.stage

  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow justify-center gap-6 py-12"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center gap-3">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <AppText variant="display" className="text-primary-foreground">
                X
              </AppText>
            </View>
            <View className="items-center gap-1">
              <AppText variant="heading">{messages.signIn.title}</AppText>
              <AppText variant="body" className="text-muted-foreground">
                {messages.signIn.subtitle}
              </AppText>
            </View>
          </View>

          {stage === 'credentials' ? (
            <AppCard className="gap-4">
              <AppInput
                label={messages.signIn.email}
                value={email}
                onChangeText={setEmail}
                placeholder={messages.signIn.emailPlaceholder}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="username"
              />
              <AppInput
                label={messages.signIn.password}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
              />
              <AppButton
                label={messages.signIn.submit}
                icon="lock"
                loading={auth.pending}
                disabled={email.length === 0 || password.length === 0}
                onPress={() => auth.signIn(email, password)}
              />
            </AppCard>
          ) : (
            <AppCard className="gap-4">
              <View className="gap-1">
                <AppText variant="title">{challengeTitle(stage)}</AppText>
                <AppText variant="caption">{challengeHint(stage)}</AppText>
              </View>

              {stage === 'totpSetup' && auth.setupUri ? (
                <View className="rounded-lg bg-muted p-3">
                  <AppText variant="caption" numeric selectable>
                    {auth.setupUri}
                  </AppText>
                </View>
              ) : null}

              <AppInput
                label={challengeLabel(stage)}
                value={answer}
                onChangeText={setAnswer}
                autoCapitalize="none"
                secureTextEntry={stage === 'newPassword'}
                keyboardType={
                  stage === 'newPassword' ? 'default' : 'number-pad'
                }
              />
              <AppButton
                label={messages.signIn.verify}
                loading={auth.pending}
                disabled={answer.length === 0}
                onPress={() => auth.confirm(answer)}
              />
              <AppButton
                label={messages.signIn.back}
                variant="ghost"
                icon="back"
                onPress={() => {
                  setAnswer('')
                  auth.reset()
                }}
              />
            </AppCard>
          )}

          {auth.error ? (
            <AppText variant="body" className="text-center text-destructive">
              {auth.error}
            </AppText>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

function challengeTitle(
  stage: 'totpCode' | 'newPassword' | 'totpSetup',
): string {
  if (stage === 'newPassword') return messages.signIn.newPasswordTitle
  if (stage === 'totpSetup') return messages.signIn.setupTitle
  return messages.signIn.totpTitle
}

function challengeHint(
  stage: 'totpCode' | 'newPassword' | 'totpSetup',
): string {
  if (stage === 'newPassword') return messages.signIn.newPasswordHint
  if (stage === 'totpSetup') return messages.signIn.setupHint
  return messages.signIn.totpHint
}

function challengeLabel(
  stage: 'totpCode' | 'newPassword' | 'totpSetup',
): string {
  return stage === 'newPassword'
    ? messages.signIn.password
    : messages.signIn.totpLabel
}
