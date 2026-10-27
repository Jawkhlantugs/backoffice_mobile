import type { RecordView } from '@/components'
import type { FinanceOrder } from '@/data/finance-order/finance-order-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `order-mnt/usdt-mnt` ба `ihc-mnt` columns.tsx-ийн дараалал (ижил). */
const COLUMNS = [
  f.orderId,
  'amount',
  f.baseAsset,
  f.executedQty,
  f.price,
  f.quantity,
  f.quoteAsset,
  f.remaining,
  f.returnAmount,
  f.side,
  'status',
  f.timestamp,
  f.type,
  f.uid,
  f.updatedAt,
] as const

const dateOf = (value?: number) =>
  value === undefined ? undefined : formatDate(value)

/** Вэб статус, side-ийг өнгөгүй (энгийн текст, secondary Badge) харуулдаг. */
export function financeOrderRecord(order: FinanceOrder): RecordView {
  return {
    title: order.symbol || order.orderId,
    subtitle: order.uid,
    status: { label: order.status, tone: 'neutral' },
    amount: order.amount,
    fields: [
      { label: f.side, value: order.side },
      { label: f.type, value: order.type },
      { label: f.price, amount: order.price },
      { label: f.quantity, amount: order.quantity },
    ],
    details: [
      { label: f.orderId, value: order.orderId },
      { label: f.baseAsset, value: order.baseAsset },
      { label: f.executedQty, amount: order.executedQty },
      { label: f.quoteAsset, value: order.quoteAsset },
      { label: f.remaining, amount: order.remaining },
      { label: f.returnAmount, amount: order.returnAmount },
      { label: f.timestamp, value: dateOf(order.timestamp) },
      { label: f.uid, value: order.uid },
      { label: f.updatedAt, value: dateOf(order.updatedAt) },
    ],
    columns: COLUMNS,
  }
}
