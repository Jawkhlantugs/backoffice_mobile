import { RecordCard } from '@/components'
import type { BuyNowOrder } from '@/data/buy-now-order/buy-now-order-model'
import { useRetryBuyNowOrder } from '@/hooks/use-buy-now-orders'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function BuyNowOrderCard({ order }: { order: BuyNowOrder }) {
  const retry = useRetryBuyNowOrder()
  const label = order.userEmail ?? order.userId ?? order.orderId ?? order.id
  const orderId = order.orderId

  return (
    <RecordCard
      title={label}
      subtitle={`${order.symbol ?? order.cryptoCurrency} · ${formatDate(order.createdAt)}`}
      status={{ label: order.orderStatus, tone: statusTone(order.orderStatus) }}
      amount={order.userPayAmount}
      fields={[
        { label: f.receiveAmount, amount: order.userGetAmount },
        { label: f.feeAmount, amount: order.userTotalFee },
      ]}
      details={[{ label: f.orderId, value: orderId }]}
      actions={[
        {
          key: 'retry',
          label: messages.finance.retry,
          icon: 'retry',
          hidden: !orderId,
          confirm: {
            title: messages.finance.retryTitle,
            description: `${label} · ${messages.finance.retryDescription}`,
          },
          run: () => retry.mutateAsync(orderId ?? ''),
        },
      ]}
    />
  )
}
