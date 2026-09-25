import { AppErrors, type AppException } from '@/core/errors/app-exception'

/**
 * Amplify-ийн алдаа axios-ынх биш тул `toAppException` түүнийг таньдаггүй.
 * Cognito-ийн нэрийг л мэддэг цорын ганц газар энэ байх ёстой — дээд
 * давхаргууд зөвхөн `AppException` хардаг.
 */
const REASONS: Record<string, AppException> = {
  NotAuthorizedException: AppErrors.auth('invalidCredentials'),
  UserNotFoundException: AppErrors.auth('invalidCredentials'),
  CodeMismatchException: AppErrors.auth('invalidCode'),
  EnableSoftwareTokenMFAException: AppErrors.auth('invalidCode'),
  ExpiredCodeException: AppErrors.auth('codeExpired'),
  UserNotConfirmedException: AppErrors.auth('notConfirmed'),
  LimitExceededException: AppErrors.auth('tooManyAttempts'),
  TooManyRequestsException: AppErrors.auth('tooManyAttempts'),
  TooManyFailedAttemptsException: AppErrors.auth('tooManyAttempts'),
  InvalidPasswordException: AppErrors.auth('weakPassword'),
}

export function toCognitoException(error: unknown): AppException | null {
  if (typeof error !== 'object' || error === null) return null

  const name = (error as { name?: unknown }).name
  if (typeof name !== 'string') return null

  if (name === 'NetworkError') return AppErrors.offline()

  const known = REASONS[name]
  if (known) return known

  // Танихгүй Cognito алдаа: "Алдаа гарлаа" гэхээс Cognito-ийн өөрийн
  // өгүүлбэр (жишээ нь "USER_PASSWORD_AUTH flow not enabled for this client")
  // админд хамаагүй ашигтай. Cognito HTTP статус өгдөггүй тул 0.
  const message = (error as { message?: unknown }).message
  if (typeof message === 'string' && message.length > 0) {
    return AppErrors.api(0, `cognito ${name}`, { message })
  }

  return null
}
