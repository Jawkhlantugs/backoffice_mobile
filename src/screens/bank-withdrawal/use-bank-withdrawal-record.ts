import type { RecordView } from '@/components'
import type { BankWithdrawal } from '@/data/bank-withdrawal/bank-withdrawal-model'
import { useMarkBankWithdrawTransferred } from '@/hooks/use-bank-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function useBankWithdrawalRecord(): (
  withdrawal: BankWithdrawal,
) => RecordView {
  const markTransferred = useMarkBankWithdrawTransferred()

  return (withdrawal) => {
    const label = withdrawal.userEmail ?? withdrawal.userId ?? withdrawal.id
    return {
      title: label,
      subtitle: formatDate(withdrawal.transferTime ?? withdrawal.createdAt),
      status: { label: withdrawal.status, tone: statusTone(withdrawal.status) },
      amount: withdrawal.totalAmount,
      fields: [
        { label: f.bank, value: withdrawal.bankLabel },
        { label: f.accountNumber, value: withdrawal.accountNumber },
        { label: f.receiveAmount, amount: withdrawal.receiveAmount },
        { label: f.feeAmount, amount: withdrawal.feeAmount },
      ],
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
