import type { RecordView } from '@/components'
import type { BankDeposit } from '@/data/bank-deposit/bank-deposit-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

const f = messages.finance.fields

/** Вэбийн `bank/deposit/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  'amount',
  f.currency,
  f.txnAmount,
  f.requestTime,
  f.subAccountId,
  f.transferTime,
  f.userId,
  'status',
  f.txnId,
  f.email,
  f.paymentWalletId,
] as const

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

export function bankDepositRecord(deposit: BankDeposit): RecordView {
  return {
    title: deposit.userEmail ?? deposit.userId ?? deposit.id,
    tableTitle: deposit.id,
    subtitle: formatDate(deposit.transferTime ?? deposit.createdAt),
    status: {
      label: deposit.status,
      tone: webStatusTone(deposit.status, 'bank'),
    },
    amount: deposit.depositAmount,
    fields: [
      { label: f.txnAmount, amount: deposit.txnAmount },
      { label: f.currency, value: deposit.currency },
      { label: f.subAccountId, value: deposit.subAccountId },
      { label: f.email, value: deposit.userEmail },
    ],
    details: [
      { label: f.requestTime, value: dateOf(deposit.createdAt) },
      { label: f.transferTime, value: dateOf(deposit.transferTime) },
      { label: f.userId, value: deposit.userId },
      { label: f.txnId, value: deposit.txnId },
      { label: f.paymentWalletId, value: deposit.paymentWalletId },
    ],
    columns: COLUMNS,
  }
}
