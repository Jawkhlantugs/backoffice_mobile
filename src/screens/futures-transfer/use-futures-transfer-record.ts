import type { RecordView } from '@/components'
import type { FuturesTransferRequest } from '@/data/futures-transfer/futures-transfer-model'
import {
  useApproveFuturesTransfer,
  useRejectFuturesTransfer,
} from '@/hooks/use-futures-transfers'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

/** Вэбийн `futures/transfer-requests/constants.ts`-ийн `getStatusVariant`. */
const TONES = {
  PENDING: 'warning',
  PROCESSING: 'warning',
  COMPLETED: 'success',
  APPROVED: 'success',
  REJECTED: 'danger',
  FAILED: 'danger',
} as const

const text = messages.futures

/**
 * Вэбийн `futures/transfer-requests/components/columns.tsx`-ийн дараалал.
 * Email, Reviewed By нь raw хариунд байдаггүй (вэб ч "-") тул хасав.
 */
const COLUMNS = [
  'status',
  text.direction,
  'amount',
  text.usdtValue,
  text.user,
  text.requestedAt,
] as const

/** Вэбийн `normalizeFuturesTransferDirection` + `getDirectionText`. */
function directionText(direction?: string): string {
  const value = (direction ?? '').toLowerCase()
  return value.includes('futures_to_spot') || value.includes('futures-to-spot')
    ? 'Futures to Spot'
    : 'Spot to Futures'
}

export function useFuturesTransferRecord(): (
  request: FuturesTransferRequest,
) => RecordView {
  const approve = useApproveFuturesTransfer()
  const reject = useRejectFuturesTransfer()

  return (request) => {
    const description = `${request.userId ?? request.txnId} · ${formatDate(request.createdAt)}`
    const pending = request.status !== 'PENDING'
    return {
      title: request.userId ?? request.txnId,
      subtitle: `${request.direction ?? ''} · ${formatDate(request.createdAt)}`,
      status: {
        label: messages.futures.statuses[request.status],
        tone: TONES[request.status],
      },
      tableTitle: request.txnId,
      amount: { ...request.amount, showCode: true },
      fields: [
        { label: text.direction, value: directionText(request.direction) },
        {
          // Вэб USDT дүнг дүнтэй ижил утгаар харуулдаг.
          label: text.usdtValue,
          amount: { raw: request.amount.raw, currency: 'USDT', showCode: true },
        },
        { label: text.user, value: request.userId },
        {
          label: text.requestedAt,
          value: request.createdAt ? formatDate(request.createdAt) : undefined,
        },
      ],
      details: [{ label: messages.finance.fields.txnId, value: request.txnId }],
      columns: COLUMNS,
      actions: [
        {
          key: 'approve',
          label: messages.futures.approve,
          icon: 'check',
          hidden: pending,
          confirm: { title: messages.futures.approveTitle, description },
          run: () => approve.mutateAsync({ txnId: request.txnId }),
        },
        {
          key: 'reject',
          label: messages.futures.reject,
          icon: 'close',
          hidden: pending,
          destructive: true,
          confirm: {
            title: messages.futures.rejectTitle,
            description,
            reason: {
              label: messages.futures.rejectReasonPlaceholder,
              required: true,
            },
          },
          run: (reason = '') =>
            reject.mutateAsync({ txnId: request.txnId, reason }),
        },
      ],
    }
  }
}
