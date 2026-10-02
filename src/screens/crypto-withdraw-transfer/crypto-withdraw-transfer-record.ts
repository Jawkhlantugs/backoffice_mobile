import type { RecordView } from '@/components'
import type { CryptoWithdrawTransfer } from '@/data/crypto-withdraw-transfer/crypto-withdraw-transfer-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function cryptoWithdrawTransferRecord(
  transfer: CryptoWithdrawTransfer,
): RecordView {
  return {
    title: transfer.userEmail ?? transfer.userId ?? transfer.id,
    subtitle: formatDate(transfer.createdAt),
    status: { label: String(transfer.status), tone: 'neutral' },
    amount: transfer.amount,
    fields: [
      { label: f.receiveAmount, amount: transfer.receiveAmount },
      { label: f.feeAmount, amount: transfer.transactionFee },
    ],
    details: [
      { label: f.address, value: transfer.address },
      { label: f.txnId, value: transfer.txId },
    ],
  }
}
