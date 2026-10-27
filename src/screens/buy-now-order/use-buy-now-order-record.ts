import type { RecordView, StatusTone } from '@/components'
import type { BuyNowOrder } from '@/data/buy-now-order/buy-now-order-model'
import { useRetryBuyNowOrder } from '@/hooks/use-buy-now-orders'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `buy-now/list/constants.ts`-ийн `statusTypes`. */
const STATUS_TONE: Record<string, StatusTone> = {
  SUCCESS: 'success',
  PENDING: 'warning',
  FAILED: 'danger',
  ERROR: 'danger',
}

/** Вэбийн `buy-now/list/components/columns.tsx`-ийн дараалал (Metadata-гүй). */
const COLUMNS = [
  f.user,
  f.cryptoCurrency,
  f.getAmountCrypto,
  'amount',
  f.getAmountFiat,
  f.rate,
  f.buyerToUserTxn,
  'status',
  f.createdAt,
] as const

export function useBuyNowOrderRecord(): (order: BuyNowOrder) => RecordView {
  const retry = useRetryBuyNowOrder()

  return (order) => {
    const label = order.userEmail ?? order.userId ?? order.orderId ?? order.id
    const orderId = order.orderId
    return {
      title: label,
      tableTitle: order.id,
      subtitle: `${order.symbol ?? order.cryptoCurrency} · ${formatDate(order.createdAt)}`,
      status: {
        label: order.orderStatus,
        tone: STATUS_TONE[order.orderStatus] ?? 'neutral',
      },
      amount: { ...order.userPayAmount, showCode: true },
      fields: [
        {
          label: f.getAmountCrypto,
          amount: { ...order.userGetAmount, showCode: true },
        },
        {
          label: f.getAmountFiat,
          amount: order.userGetAmountFiat && {
            ...order.userGetAmountFiat,
            showCode: true,
          },
        },
        { label: f.rate, value: order.quotePrice },
        { label: f.feeAmount, amount: order.userTotalFee },
      ],
      details: [
        {
          label: f.user,
          value: [order.userEmail, order.subAccountId ?? order.userId]
            .filter(Boolean)
            .join(' · '),
        },
        { label: f.cryptoCurrency, value: order.cryptoCurrency },
        { label: f.buyerToUserTxn, value: order.buyerToUserTxnId },
        {
          label: f.createdAt,
          value: order.createdAt ? formatDate(order.createdAt) : undefined,
        },
        { label: f.orderId, value: orderId },
      ],
      columns: COLUMNS,
      actions: [
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
      ],
    }
  }
}
