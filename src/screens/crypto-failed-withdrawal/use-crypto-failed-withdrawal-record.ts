import type { RecordView } from '@/components'
import type { CryptoFailedWithdrawal } from '@/data/crypto-failed-withdrawal/crypto-failed-withdrawal-model'
import { useManualRefundFailedWithdrawal } from '@/hooks/use-crypto-failed-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function useCryptoFailedWithdrawalRecord(): (
  item: CryptoFailedWithdrawal,
) => RecordView {
  const manualRefund = useManualRefundFailedWithdrawal()

  return (item) => {
    const label = item.userEmail ?? item.userId ?? item.id
    return {
      title: label,
      subtitle: formatDate(item.createdAt),
      status: item.status ? { label: item.status, tone: 'danger' } : undefined,
      fields: [
        { label: f.type, value: item.type },
        { label: f.uid, value: item.resolvedBy },
      ],
      details: [
        {
          label: f.updatedAt,
          value:
            item.resolvedAt !== undefined
              ? formatDate(item.resolvedAt)
              : undefined,
        },
      ],
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
