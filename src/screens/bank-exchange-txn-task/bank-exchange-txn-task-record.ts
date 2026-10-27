import type { RecordView, StatusTone } from '@/components'
import type { BankExchangeTxnTask } from '@/data/bank-exchange-txn-task/bank-exchange-txn-task-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const f = messages.finance.fields

/** Вэбийн `exchange-txn-task/constants.ts`-ийн `getReasonVariant`. */
const REASON_TONE: Record<string, StatusTone> = {
  DEPOSIT_REFUND: 'danger',
  USDT_BUY: 'success',
}

/** Вэбийн `exchange-txn-task/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  'amount',
  f.currency,
  'status',
  f.reason,
  f.receiverName,
  f.receiverIban,
  f.senderIban,
  f.journalNo,
  f.userId,
  f.transferTime,
  f.createdAt,
] as const

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

export function bankExchangeTxnTaskRecord(
  task: BankExchangeTxnTask,
): RecordView {
  return {
    title: task.id,
    subtitle: formatDate(
      task.transferTime ?? task.requestTime ?? task.createdAt,
    ),
    status: {
      label: task.status,
      tone: webStatusTone(task.status, 'exchange'),
    },
    amount: { ...task.amount, showCode: true },
    fields: [
      {
        label: f.reason,
        value: task.reason,
        tone: REASON_TONE[task.reason ?? ''] ?? 'neutral',
      },
      { label: f.receiverName, value: task.receiverName },
      { label: f.receiverIban, value: task.receiverIban },
      { label: f.senderIban, value: task.senderIban },
    ],
    details: [
      { label: f.currency, value: task.currency },
      { label: f.journalNo, value: task.journalNo },
      { label: f.userId, value: task.userId },
      { label: f.transferTime, value: dateOf(task.transferTime) },
      { label: f.createdAt, value: dateOf(task.createdAt) },
    ],
    columns: COLUMNS,
  }
}
