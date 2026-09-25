import { RecordCard } from '@/components'
import type { CryptoWithdrawal } from '@/data/crypto-withdrawal/crypto-withdrawal-model'
import { useCryptoWithdrawAction } from '@/hooks/use-crypto-withdrawals'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function CryptoWithdrawalCard({
  withdrawal,
}: {
  withdrawal: CryptoWithdrawal
}) {
  const action = useCryptoWithdrawAction()
  const label = withdrawal.userEmail ?? withdrawal.userId ?? withdrawal.id

  return (
    <RecordCard
      title={label}
      subtitle={formatDate(withdrawal.createdAt)}
      status={{ label: String(withdrawal.status), tone: 'neutral' }}
      amount={withdrawal.amount}
      fields={[
        { label: f.network, value: withdrawal.network },
        { label: f.receiveAmount, amount: withdrawal.receiveAmount },
      ]}
      details={[
        { label: f.address, value: withdrawal.address },
        { label: f.txnId, value: withdrawal.txnId },
      ]}
      actions={[
        {
          key: 'approve',
          label: messages.finance.approveCrypto,
          icon: 'check',
          confirm: {
            title: messages.finance.approveCryptoTitle,
            description: label,
          },
          run: () =>
            action.mutateAsync({ historyId: withdrawal.id, action: 'APPROVE' }),
        },
        {
          key: 'refund',
          label: messages.finance.refund,
          icon: 'refund',
          destructive: true,
          confirm: {
            title: messages.finance.refundCryptoTitle,
            description: label,
          },
          run: () =>
            action.mutateAsync({ historyId: withdrawal.id, action: 'REFUND' }),
        },
      ]}
    />
  )
}
