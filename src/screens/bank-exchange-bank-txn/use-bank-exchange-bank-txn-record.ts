import type { RecordView, StatusTone } from '@/components'
import type { BankExchangeBankTxn } from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-model'
import {
  useRefundBankExchangeBankTxn,
  useSolveBankExchangeBankTxn,
} from '@/hooks/use-bank-exchange-bank-txn'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/**
 * Вэбийн `exchange-txn/constants.ts`-ийн `getStatusVariant`,
 * `getAmountTypeVariant`. `statusTone` нь PROCESSED-ийг шар болгодог тул
 * вэбийн өнгийг шууд давтана.
 */
const STATUS_TONE: Record<string, StatusTone> = {
  PROCESSED: 'success',
  SOLVED: 'success',
  PENDING: 'warning',
  REFUNDED: 'neutral',
  MANUAL_REFUND: 'neutral',
}
const AMOUNT_TYPE_TONE: Record<string, StatusTone> = {
  DEPOSIT: 'success',
  WITHDRAWAL: 'danger',
}

/** Вэбийн `columns.tsx`-ийн дараалал; ID нь гарчгийн (sticky) багана. */
const COLUMNS = [
  'amount',
  f.type,
  'status',
  f.description,
  f.mainAccount,
  f.relatedAccount,
  f.beginBalance,
  f.endBalance,
  f.txnTime,
  f.createdAt,
] as const

export function useBankExchangeBankTxnRecord(): (
  txn: BankExchangeBankTxn,
) => RecordView {
  const solve = useSolveBankExchangeBankTxn()
  const refund = useRefundBankExchangeBankTxn()

  return (txn) => {
    const label = txn.relatedAccountNumber || txn.id
    return {
      title: txn.id,
      subtitle: formatDate(txn.txnTime ?? txn.createdAt),
      status: txn.processStatus
        ? {
            label: txn.processStatus,
            tone: STATUS_TONE[txn.processStatus] ?? 'warning',
          }
        : undefined,
      amount: txn.amount && { ...txn.amount, showCode: true },
      fields: [
        {
          label: f.type,
          value: txn.amountType,
          tone: txn.amountType
            ? (AMOUNT_TYPE_TONE[txn.amountType] ?? 'warning')
            : undefined,
        },
        { label: f.description, value: txn.description },
        { label: f.beginBalance, amount: txn.beginBalance },
        { label: f.endBalance, amount: txn.endBalance },
      ],
      details: [
        { label: f.mainAccount, value: txn.mainAccountNumber },
        { label: f.relatedAccount, value: txn.relatedAccountNumber },
        {
          label: f.txnTime,
          value: txn.txnTime ? formatDate(txn.txnTime) : undefined,
        },
        {
          label: f.createdAt,
          value: txn.createdAt ? formatDate(txn.createdAt) : undefined,
        },
      ],
      columns: COLUMNS,
      actions: [
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
      ],
    }
  }
}
