import type { RecordView } from '@/components'
import type { ConvertRecord } from '@/data/convert/convert-model'
import { useRetryConvert } from '@/hooks/use-convert'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `convert/list/constants.ts`-ийн `getStatusVariant`. */
const statusToneOf = (status: string) =>
  status === 'COMPLETED'
    ? 'success'
    : status === 'FAILED'
      ? 'danger'
      : 'warning'

/** Вэбийн `convert/list/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.id,
  f.createdAt,
  f.fromAmount,
  f.fromAsset,
  f.fromTxnId,
  f.postDate,
  f.rate,
  'status',
  'amount',
  f.toAsset,
  f.subAccountId,
  f.updatedAt,
] as const

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

export function useConvertRecord(): (record: ConvertRecord) => RecordView {
  const retry = useRetryConvert()

  return (record) => {
    const label = record.userEmail ?? record.userId ?? record.id
    return {
      title: label,
      // Вэбийн эхний багана `toTxnId` — хоосон бол зураас.
      tableTitle: record.toTxnId ?? '—',
      subtitle: formatDate(record.createdAt),
      status: { label: record.status, tone: statusToneOf(record.status) },
      amount: record.toAmount,
      fields: [
        { label: f.fromAmount, amount: record.fromAmount },
        { label: f.rate, value: record.rate },
        { label: f.fromAsset, value: record.fromAsset },
        { label: f.toAsset, value: record.toAsset },
      ],
      details: [
        { label: f.id, value: record.id },
        { label: f.createdAt, value: dateOf(record.createdAt) },
        { label: f.fromTxnId, value: record.fromTxnId },
        { label: f.postDate, value: record.postDate },
        { label: f.subAccountId, value: record.subId },
        { label: f.updatedAt, value: dateOf(record.updatedAt) },
      ],
      columns: COLUMNS,
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
