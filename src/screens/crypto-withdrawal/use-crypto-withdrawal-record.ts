import type { RecordView, StatusTone } from '@/components'
import type { CryptoWithdrawal } from '@/data/crypto-withdrawal/crypto-withdrawal-model'
import { useCryptoWithdrawAction } from '@/hooks/use-crypto-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const f = messages.finance.fields

/** Вэбийн `getStatusText` — шүүлтүүрийн чиптэй ижил текст. */
const STATUS_TEXT: Record<string, string> =
  messages.finance.cryptoWithdrawalStatuses

/** Вэбийн `getStatusVariant` — 2, 5 нь улаан, бусад нь `crypto-withdraw`. */
function statusToneOf(status: number): StatusTone {
  if (status === 2 || status === 5) return 'danger'
  return webStatusTone(status, 'crypto-withdraw')
}

/** Вэбийн `getWithdrawalReason`. */
function reasonOf(status: number): string | undefined {
  if (status === 2) return messages.finance.cryptoWithdrawAgeReason
  if (status === 5 || status === 8)
    return messages.finance.cryptoWithdrawAddressReason
  return undefined
}

/** Вэбийн `crypto/withdrawal/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  'amount',
  f.bwFee,
  f.swFee,
  f.coin,
  f.network,
  f.usdtValuation,
  'status',
  f.reason,
  f.txnId,
  f.address,
  f.userEmail,
  f.createdAt,
  f.updateTime,
] as const

const usd = (value?: number) =>
  value === undefined ? undefined : { raw: value, currency: 'USD' }
const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

export function useCryptoWithdrawalRecord(): (
  withdrawal: CryptoWithdrawal,
) => RecordView {
  const action = useCryptoWithdrawAction()

  return (withdrawal) => {
    const owner = withdrawal.userEmail || withdrawal.operationAccount
    const label = owner ?? withdrawal.userId ?? withdrawal.id
    return {
      title: label,
      tableTitle: withdrawal.id,
      subtitle: formatDate(withdrawal.createdAt),
      status: {
        label:
          STATUS_TEXT[String(withdrawal.status)] ??
          `Status ${withdrawal.status}`,
        tone: statusToneOf(withdrawal.status),
      },
      amount: { ...withdrawal.amount, showCode: true },
      fields: [
        { label: f.network, value: withdrawal.network },
        { label: f.usdtValuation, amount: usd(withdrawal.usdtValuation) },
        { label: f.bwFee, amount: usd(withdrawal.bwFee) },
        { label: f.swFee, amount: usd(withdrawal.swFee) },
      ],
      details: [
        { label: f.coin, value: withdrawal.coin },
        { label: f.receiveAmount, amount: withdrawal.receiveAmount },
        { label: f.reason, value: reasonOf(withdrawal.status) },
        { label: f.txnId, value: withdrawal.txnId },
        { label: f.address, value: withdrawal.address },
        { label: f.userEmail, value: owner },
        { label: f.createdAt, value: dateOf(withdrawal.createdAt) },
        { label: f.updateTime, value: dateOf(withdrawal.transferTime) },
      ],
      columns: COLUMNS,
      actions: [
        {
          key: 'approve',
          label: messages.finance.approveCrypto,
          icon: 'check',
          confirm: {
            title: messages.finance.approveCryptoTitle,
            description: label,
          },
          run: () =>
            action.mutateAsync({ historyId: withdrawal.id, action: 'APPROVE' }),
        },
        {
          key: 'refund',
          label: messages.finance.refund,
          icon: 'refund',
          destructive: true,
          confirm: {
            title: messages.finance.refundCryptoTitle,
            description: label,
          },
          run: () =>
            action.mutateAsync({ historyId: withdrawal.id, action: 'REFUND' }),
        },
      ],
    }
  }
}
