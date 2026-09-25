import { RecordCard } from '@/components'
import type { FuturesTransferRequest } from '@/data/futures-transfer/futures-transfer-model'
import {
  useApproveFuturesTransfer,
  useRejectFuturesTransfer,
} from '@/hooks/use-futures-transfers'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const TONES = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  APPROVED: 'success',
  REJECTED: 'danger',
  FAILED: 'danger',
} as const

export function FuturesTransferCard({
  request,
}: {
  request: FuturesTransferRequest
}) {
  const approve = useApproveFuturesTransfer()
  const reject = useRejectFuturesTransfer()
  const description = `${request.userId ?? request.txnId} · ${formatDate(request.createdAt)}`
  const pending = request.status !== 'PENDING'

  return (
    <RecordCard
      title={request.userId ?? request.txnId}
      subtitle={`${request.direction ?? ''} · ${formatDate(request.createdAt)}`}
      status={{
        label: messages.futures.statuses[request.status],
        tone: TONES[request.status],
      }}
      amount={request.amount}
      details={[{ label: messages.finance.fields.txnId, value: request.txnId }]}
      actions={[
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
      ]}
    />
  )
}
