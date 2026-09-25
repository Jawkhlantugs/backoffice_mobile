import { RecordCard } from '@/components'
import type { BankExchangeTxnTask } from '@/data/bank-exchange-txn-task/bank-exchange-txn-task-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const f = messages.finance.fields

export function BankExchangeTxnTaskCard({
  task,
}: {
  task: BankExchangeTxnTask
}) {
  return (
    <RecordCard
      title={task.id}
      subtitle={formatDate(
        task.transferTime ?? task.requestTime ?? task.createdAt,
      )}
      status={{ label: task.status, tone: statusTone(task.status) }}
      amount={task.amount}
      fields={[
        { label: f.senderIban, value: task.senderIban },
        { label: f.receiverIban, value: task.receiverIban },
      ]}
    />
  )
}
