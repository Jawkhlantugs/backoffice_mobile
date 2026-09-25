import { AppInput, AppText, SelectField } from '@/components'
import type { OperationAccount } from '@/data/transfer/transfer-model'
import { messages } from '@/lib/messages'

const text = messages.transfer

/**
 * Шилжүүлгийн нэг тал: operation данс бол жагсаалтаас, хэрэглэгч бол
 * subAccountId бичиж, олдсон имэйлийг доор нь харуулна (вэбтэй ижил).
 */
export function TransferAccountField({
  label,
  isUser,
  value,
  onChange,
  accounts,
  accountsLoading,
  accountsError,
  onRetryAccounts,
  matchedEmail,
  checking,
  error,
}: {
  label: string
  isUser: boolean
  value: string
  onChange: (value: string) => void
  accounts: OperationAccount[]
  accountsLoading: boolean
  accountsError: unknown
  onRetryAccounts: () => void
  matchedEmail?: string
  checking: boolean
  error?: string
}) {
  if (!isUser) {
    return (
      <SelectField
        label={label}
        placeholder={text.operationPlaceholder}
        options={accounts.map((account) => ({
          value: account.subAccountId,
          label: account.name,
          description: account.subAccountId,
        }))}
        value={value || undefined}
        onChange={onChange}
        error={error}
        loading={accountsLoading}
        loadError={accountsError}
        onRetry={onRetryAccounts}
      />
    )
  }

  return (
    <>
      <AppInput
        label={label}
        placeholder={text.subAccountPlaceholder}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        error={error}
      />
      {value.trim() && !error ? (
        <AppText variant="caption">
          {checking ? text.checkingUser : matchedEmail}
        </AppText>
      ) : null}
    </>
  )
}
