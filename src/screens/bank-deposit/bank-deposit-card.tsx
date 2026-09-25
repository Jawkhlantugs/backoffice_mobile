import { RecordCard } from '@/components'
import type { BankDeposit } from '@/data/bank-deposit/bank-deposit-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function BankDepositCard({ deposit }: { deposit: BankDeposit }) {
  return (
    <RecordCard
      title={deposit.userEmail ?? deposit.userId ?? deposit.id}
      subtitle={formatDate(deposit.transferTime ?? deposit.createdAt)}
      status={{ label: deposit.status, tone: statusTone(deposit.status) }}
      amount={deposit.depositAmount}
      fields={[{ label: f.totalAmount, amount: deposit.txnAmount }]}
      details={[{ label: f.txnId, value: deposit.txnId }]}
    />
  )
}
