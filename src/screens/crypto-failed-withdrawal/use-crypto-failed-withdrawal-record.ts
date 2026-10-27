import type { RecordView, StatusTone } from '@/components'
import type { CryptoFailedWithdrawal } from '@/data/crypto-failed-withdrawal/crypto-failed-withdrawal-model'
import { useManualRefundFailedWithdrawal } from '@/hooks/use-crypto-failed-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `failed-withdrawals/constants.ts`-ийн `getStatusVariant`. */
function statusToneOf(status: string): StatusTone {
  const upper = status.toUpperCase()
  if (upper === 'REFUNDED') return 'success'
  if (upper === 'PENDING' || upper === 'IN_REVIEW') return 'warning'
  if (upper.includes('FAIL') || upper.includes('ERROR')) return 'danger'
  return 'neutral'
}

/** Вэб буцаалтын төлвийг 1 → Refunded (ногоон), бусдыг Pending (шар). */
function refundOf(label: string, status?: number) {
  if (status === undefined) return { label }
  const refunded = status === 1
  return {
    label,
    value: refunded ? 'Refunded' : 'Pending',
    tone: refunded ? ('success' as const) : ('warning' as const),
  }
}

/** Вэбийн `crypto/failed-withdrawals/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.userId,
  f.userEmail,
  f.type,
  'status',
  f.feeRefund,
  f.mainRefund,
  f.resolvedAt,
  f.createdAt,
] as const

export function useCryptoFailedWithdrawalRecord(): (
  item: CryptoFailedWithdrawal,
) => RecordView {
  const manualRefund = useManualRefundFailedWithdrawal()

  return (item) => {
    const label = item.userEmail ?? item.userId ?? item.id
    return {
      title: label,
      tableTitle: item.id,
      subtitle: formatDate(item.createdAt),
      status: item.status
        ? { label: item.status, tone: statusToneOf(item.status) }
        : undefined,
      fields: [
        { label: f.type, value: item.type },
        refundOf(f.feeRefund, item.feeRefundStatus),
        refundOf(f.mainRefund, item.mainRefundStatus),
        { label: f.userEmail, value: item.userEmail },
      ],
      details: [
        { label: f.userId, value: item.uid },
        {
          label: f.resolvedAt,
          value: item.resolvedAt ? formatDate(item.resolvedAt) : undefined,
        },
        {
          label: f.createdAt,
          value: item.createdAt ? formatDate(item.createdAt) : undefined,
        },
      ],
      columns: COLUMNS,
      actions: [
        {
          key: 'refund',
          label: messages.finance.refund,
          icon: 'refund',
          destructive: true,
          confirm: { title: messages.finance.refundTitle, description: label },
          run: () => manualRefund.mutateAsync(item.id),
        },
      ],
    }
  }
}
