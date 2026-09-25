import { useCallback, useState } from 'react'

import { adminRepository } from '@/data/auth/admin-repository'
import { toAppException } from '@/core/network/failure'
import { useSessionStore } from '@/core/session/session-store'
import { toast } from '@/core/ui/toast-store'
import { logger } from '@/lib/logger'
import { translateError } from '@/lib/messages'
import { toCognitoException } from '@/services/auth/cognito-error'
import {
  cognitoAuth,
  type SignInStep,
} from '@/services/auth/cognito-auth-service'

/** Дэлгэц ямар оролт асуухыг тодорхойлно (FLOWS.md §4.2). */
export type SignInStage =
  'credentials' | 'totpCode' | 'newPassword' | 'totpSetup'

type State = {
  stage: SignInStage
  /** `totpSetup` үед л утгатай — QR болгож харуулах URI. */
  setupUri?: string
  error?: string
  pending: boolean
}

const IDLE: State = { stage: 'credentials', pending: false }

/**
 * Cognito-ийн олон алхамт нэвтрэлтийг нэг төлөв болгоно. `done` болмогц
 * `/auth/info` + `/admin/admin-menus/my`-аас профайл татаж session-д тавина —
 * эрхгүй цэс хэзээ ч харагдахгүй байх эхлэл нь энэ.
 */
export function useSignIn() {
  const [state, setState] = useState<State>(IDLE)
  const setUser = useSessionStore((store) => store.setUser)

  const finish = useCallback(
    async (step: SignInStep) => {
      if (step.step === 'done') {
        const profile = await adminRepository.profile()
        setUser(profile)
        setState(IDLE)
        return
      }

      setState({
        stage: step.step,
        setupUri: step.step === 'totpSetup' ? step.setupUri : undefined,
        pending: false,
      })
    },
    [setUser],
  )

  const run = useCallback(
    async (action: () => Promise<SignInStep>) => {
      setState((previous) => ({ ...previous, pending: true, error: undefined }))
      try {
        await finish(await action())
      } catch (error) {
        // Cognito-ийн жинхэнэ нэр, мессежийг лог руу: доорх текст нь
        // орчуулагдсан хувилбар тул шалтгаан нь алдагддаг.
        logger.warn('Нэвтрэлт амжилтгүй', error)

        const failure = toCognitoException(error) ?? toAppException(error)
        const message = translateError(failure)
        toast.error(message)
        setState((previous) => ({
          ...previous,
          pending: false,
          error: message,
        }))
      }
    },
    [finish],
  )

  return {
    ...state,
    signIn: (email: string, password: string) =>
      run(() => cognitoAuth.signIn(email.trim(), password)),
    /** TOTP код, шинэ нууц үг, setup код — Cognito-д бүгд нэг алхам. */
    confirm: (answer: string) => run(() => cognitoAuth.confirm(answer.trim())),
    reset: () => setState(IDLE),
  }
}
