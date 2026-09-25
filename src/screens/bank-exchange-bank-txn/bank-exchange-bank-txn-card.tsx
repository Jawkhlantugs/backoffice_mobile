import { RecordCard } from '@/components'
import type { BankExchangeBankTxn } from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-model'
import {
  useRefundBankExchangeBankTxn,
  useSolveBankExchangeBankTxn,
} from '@/hooks/use-bank-exchange-bank-txn'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function BankExchangeBankTxnCard({ txn }: { txn: BankExchangeBankTxn }) {
  const solve = useSolveBankExchangeBankTxn()
  const refund = useRefundBankExchangeBankTxn()
  const label = txn.relatedAccountNumber ?? txn.id

  return (
    <RecordCard
      title={label}
      subtitle={formatDate(txn.txnTime ?? txn.createdAt)}
      status={
        txn.processStatus
          ? { label: txn.processStatus, tone: 'neutral' }
          : undefined
      }
      amount={txn.amount}
      fields={[
        { label: f.type, value: txn.amountType },
        { label: f.beginBalance, amount: txn.beginBalance },
        { label: f.endBalance, amount: txn.endBalance },
      ]}
      actions={[
        {
          key: 'solve',
          label: messages.finance.solve,
          icon: 'check',
          confirm: {
            title: messages.finance.solveTitle,
            description: label,
            reason: {
              label: messages.finance.solveMessagePlaceholder,
              required: true,
            },
          },
          run: (message = '') => solve.mutateAsync({ txnId: txn.id, message }),
        },
        {
          key: 'refund',
          label: messages.finance.refund,
          icon: 'refund',
          destructive: true,
          confirm: {
            title: messages.finance.refundTitle,
            description: label,
            reason: {
              label: messages.finance.refundIbanPlaceholder,
              required: true,
            },
          },
          run: (iban = '') => refund.mutateAsync({ txnId: txn.id, iban }),
        },
      ]}
    />
  )
}
