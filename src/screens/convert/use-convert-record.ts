import type { RecordView } from '@/components'
import type { ConvertRecord } from '@/data/convert/convert-model'
import { useRetryConvert } from '@/hooks/use-convert'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function useConvertRecord(): (record: ConvertRecord) => RecordView {
  const retry = useRetryConvert()

  return (record) => {
    const label = record.userEmail ?? record.userId ?? record.id
    return {
      title: label,
      subtitle: formatDate(record.createdAt),
      status: { label: record.status, tone: statusTone(record.status) },
      amount: record.toAmount,
      fields: [
        { label: f.fromAsset, amount: record.fromAmount },
        { label: f.rate, value: record.rate },
      ],
      details: [{ label: f.orderId, value: record.id }],
      actions: [
        {
          key: 'retry',
          label: messages.finance.retry,
          icon: 'retry',
          confirm: {
            title: messages.finance.retryTitle,
            description: `${label} · ${messages.finance.retryDescription}`,
          },
          run: () => retry.mutateAsync(record.id),
        },
      ],
    }
  }
}
