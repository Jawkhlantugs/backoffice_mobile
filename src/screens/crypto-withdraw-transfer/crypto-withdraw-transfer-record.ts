import type { RecordView } from '@/components'
import type { CryptoWithdrawTransfer } from '@/data/crypto-withdraw-transfer/crypto-withdraw-transfer-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const f = messages.finance.fields

/** Вэбийн `crypto/withdraw-transfers/constants.ts`-ийн `getStatusText`. */
const STATUS_TEXT: Record<number, string> = {
  6: 'Completed',
  4: 'Processing',
  3: 'Pending',
  [-1]: 'Failed',
}

/** Вэбийн `crypto/withdraw-transfers/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  'amount',
  f.coin,
  f.network,
  'status',
  f.txnId,
  f.address,
  f.identity,
  f.createdAt,
] as const

export function cryptoWithdrawTransferRecord(
  transfer: CryptoWithdrawTransfer,
): RecordView {
  const identity = transfer.userEmail || transfer.operationAccount
  return {
    title: identity ?? transfer.userId ?? transfer.id,
    tableTitle: transfer.id,
    subtitle: formatDate(transfer.createdAt),
    status: {
      label: STATUS_TEXT[transfer.status] ?? `Status ${transfer.status}`,
      tone: webStatusTone(transfer.status, 'crypto-transfer'),
    },
    amount: transfer.amount && { ...transfer.amount, showCode: true },
    fields: [
      { label: f.coin, value: transfer.coin },
      { label: f.network, value: transfer.network },
      { label: f.identity, value: identity },
      { label: f.txnId, value: transfer.txId },
    ],
    details: [
      { label: f.address, value: transfer.address },
      {
        label: f.createdAt,
        value: transfer.createdAt ? formatDate(transfer.createdAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
