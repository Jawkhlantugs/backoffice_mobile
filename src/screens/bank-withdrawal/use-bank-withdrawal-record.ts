import type { RecordView } from '@/components'
import type { BankWithdrawal } from '@/data/bank-withdrawal/bank-withdrawal-model'
import { useMarkBankWithdrawTransferred } from '@/hooks/use-bank-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const f = messages.finance.fields

/** Вэбийн `bank/withdrawal/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.accountNumber,
  f.bankCode,
  f.currency,
  f.feeAmount,
  f.paymentWalletId,
  f.receiveAmount,
  f.requestTime,
  'status',
  'amount',
  f.transferTime,
  f.userId,
  f.serviceFeeTxnId,
  f.serviceFee,
  f.txnFeeTxnId,
  f.txnTaskId,
] as const

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

export function useBankWithdrawalRecord(): (
  withdrawal: BankWithdrawal,
) => RecordView {
  const markTransferred = useMarkBankWithdrawTransferred()

  return (withdrawal) => {
    const label = withdrawal.userEmail ?? withdrawal.userId ?? withdrawal.id
    return {
      title: label,
      tableTitle: withdrawal.id,
      subtitle: formatDate(withdrawal.transferTime ?? withdrawal.createdAt),
      status: {
        label: withdrawal.status,
        tone: webStatusTone(withdrawal.status, 'bank'),
      },
      amount: withdrawal.totalAmount,
      fields: [
        { label: f.bankCode, value: withdrawal.bankCode },
        { label: f.accountNumber, value: withdrawal.accountNumber },
        { label: f.receiveAmount, amount: withdrawal.receiveAmount },
        { label: f.feeAmount, amount: withdrawal.feeAmount },
      ],
      details: [
        { label: f.currency, value: withdrawal.currency },
        { label: f.paymentWalletId, value: withdrawal.paymentWalletId },
        { label: f.requestTime, value: dateOf(withdrawal.createdAt) },
        { label: f.transferTime, value: dateOf(withdrawal.transferTime) },
        { label: f.userId, value: withdrawal.userId },
        { label: f.serviceFeeTxnId, value: withdrawal.serviceFeeTxnId },
        { label: f.serviceFee, amount: withdrawal.serviceFee },
        { label: f.txnFeeTxnId, value: withdrawal.txnFeeTxnId },
        { label: f.txnTaskId, value: withdrawal.txnTaskId },
      ],
      columns: COLUMNS,
      actions: [
        {
          key: 'mark-transferred',
          label: messages.finance.markTransferred,
          icon: 'check',
          confirm: {
            title: messages.finance.markTransferredTitle,
            description: label,
          },
          run: () => markTransferred.mutateAsync(withdrawal.id),
        },
      ],
    }
  }
}
