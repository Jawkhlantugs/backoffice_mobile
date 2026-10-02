import type { RecordView } from '@/components'
import type { FinanceOrder } from '@/data/finance-order/finance-order-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function financeOrderRecord(order: FinanceOrder): RecordView {
  return {
    title: order.symbol || order.orderId,
    subtitle: order.uid,
    status: { label: order.status, tone: statusTone(order.status) },
    amount: order.amount,
    fields: [
      { label: f.side, value: order.side },
      { label: f.type, value: order.type },
      { label: f.price, amount: order.price },
      { label: f.quantity, amount: order.quantity },
    ],
    details: [
      { label: f.executedQty, amount: order.executedQty },
      { label: f.remaining, amount: order.remaining },
      { label: f.returnAmount, amount: order.returnAmount },
      { label: f.orderId, value: order.orderId },
      {
        label: f.createdAt,
        value: order.timestamp ? formatDate(order.timestamp) : undefined,
      },
    ],
  }
}
