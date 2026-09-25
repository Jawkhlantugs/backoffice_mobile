import {
  confirmSignIn,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from 'aws-amplify/auth'

/**
 * Cognito-той ярих цорын ганц газар. Вэб админы `src/lib/auth-amplify.ts`-ийн
 * алхмуудыг яг дагасан — нэвтрэлтийн урсгал хоёр талд ижил байх ёстой.
 *
 * ⚠️ **Хоёр өөр token байна (§1.2):**
 * - `idToken` → API хүсэлтийн `Authorization: Bearer`
 * - `accessToken` → step-up MFA verify-ийн **body** дотор
 * Эдгээрийг андуурвал MFA бүх үйлдэл дээр татгалзана.
 */

export type SignInStep =
  | { step: 'done'; idToken: string; userId: string; username: string }
  | { step: 'totpCode' }
  | { step: 'newPassword' }
  | { step: 'totpSetup'; sharedSecret: string; setupUri: string }

async function signedInPayload(): Promise<
  Extract<SignInStep, { step: 'done' }>
> {
  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()
  if (!idToken) throw new Error('Cognito session-д idToken алга')

  const user = await getCurrentUser()
  return {
    step: 'done',
    idToken,
    userId: user.userId,
    username: user.username,
  }
}

/**
 * TOTP тохируулах салааг задалж, QR болгох URI-г буцаана.
 *
 * Cognito сонголтын алхмыг тусад нь асуудаг ч TOTP-оос өөр сонголт админд
 * байхгүй тул автоматаар сонгоод цааш нь үргэлжлүүлнэ.
 */
async function resolveMfaSetup(
  nextStep: { signInStep: string } & Record<string, unknown>,
  accountName?: string,
): Promise<Extract<SignInStep, { step: 'totpSetup' }> | null> {
  if (nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION') {
    const allowed = (nextStep.allowedMFATypes as string[] | undefined) ?? []
    if (!allowed.includes('TOTP')) {
      throw new Error('Authenticator app шаардлагатай ч TOTP боломжгүй байна.')
    }
    const result = await confirmSignIn({ challengeResponse: 'TOTP' })
    return resolveMfaSetup(result.nextStep as never, accountName)
  }

  if (nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP') {
    const details = nextStep.totpSetupDetails as {
      sharedSecret: string
      getSetupUri: (appName: string, accountName?: string) => URL
    }
    return {
      step: 'totpSetup',
      sharedSecret: details.sharedSecret,
      setupUri: details.getSetupUri('X-Meta Admin', accountName).toString(),
    }
  }

  return null
}

async function interpret(
  result: { isSignedIn: boolean; nextStep: { signInStep: string } },
  accountName?: string,
): Promise<SignInStep> {
  const { isSignedIn, nextStep } = result

  if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
    return { step: 'totpCode' }
  }
  if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
    return { step: 'newPassword' }
  }

  const setup = await resolveMfaSetup(nextStep as never, accountName)
  if (setup) return setup

  if (isSignedIn) return signedInPayload()

  throw new Error(`Тодорхойгүй нэвтрэлтийн алхам: ${nextStep.signInStep}`)
}

export const cognitoAuth = {
  async signIn(email: string, password: string): Promise<SignInStep> {
    const result = await signIn({
      username: email,
      password,
      options: { authFlowType: 'USER_PASSWORD_AUTH' },
    })
    return interpret(result, email)
  },

  /** TOTP код, шинэ нууц үг, MFA setup код — гурвуулаа нэг алхам. */
  async confirm(challengeResponse: string): Promise<SignInStep> {
    const result = await confirmSignIn({ challengeResponse })
    return interpret(result)
  },

  async signOut(): Promise<void> {
    await signOut()
  },

  /** API хүсэлтийн Bearer token. Amplify хугацаа дуусахад нь өөрөө шинэчилнэ. */
  async idToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() ?? null
    } catch {
      return null
    }
  },

  /** ⚠️ Зөвхөн step-up MFA verify-ийн body-д. Bearer-т **биш** (§1.2). */
  async accessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.accessToken?.toString() ?? null
    } catch {
      return null
    }
  },

  /** Апп foreground-д ирэхэд token-оо шинэчилнэ. */
  async refresh(): Promise<string | null> {
    try {
      const session = await fetchAuthSession({ forceRefresh: true })
      return session.tokens?.idToken?.toString() ?? null
    } catch {
      return null
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser()
      return true
    } catch {
      return false
    }
  },
}
