import type { RecordView } from '@/components'
import type { CryptoDeposit } from '@/data/crypto-deposit/crypto-deposit-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `crypto/deposit/components/columns.tsx`-ийн дараалал. */
const USER_COLUMNS = [
  'amount',
  f.coin,
  f.network,
  f.usdtValuation,
  'status',
  f.txnId,
  f.address,
  f.sourceAddress,
  f.userEmail,
  f.insertTime,
  f.updateTime,
] as const

/** Вэбийн `crypto/deposit-operations/components/columns.tsx`-ийн дараалал. */
const OPERATION_COLUMNS = [
  f.operationAccount,
  'amount',
  f.coin,
  f.network,
  f.usdtValuation,
  'status',
  f.txnId,
  f.depositAddress,
  f.sourceAddress,
  f.insertTime,
] as const

const dateOf = (value?: string | number) =>
  value === undefined ? undefined : formatDate(value)

/**
 * Вэб 1-ийг хэрэглэгчийн жагсаалтад "Completed", operation-д "Success" гэж
 * бичдэг. Operation-ийн "Success"-ийг вэб шар болгодог нь алдаа тул ногоон.
 */
function statusOf(deposit: CryptoDeposit, isOperation: boolean) {
  if (deposit.status === 1) {
    return {
      label: isOperation ? 'Success' : 'Completed',
      tone: 'success' as const,
    }
  }
  const label = deposit.status === 0 ? 'Pending' : `Status ${deposit.status}`
  return { label, tone: 'warning' as const }
}

export function cryptoDepositRecord(
  isOperation: boolean,
): (deposit: CryptoDeposit) => RecordView {
  return (deposit) => {
    const owner = deposit.userEmail ?? deposit.operationAccount
    const usdt =
      deposit.usdtValuation === undefined
        ? undefined
        : { raw: deposit.usdtValuation, currency: 'USD' }
    return {
      title: owner ?? deposit.userId ?? deposit.id,
      tableTitle: deposit.id,
      subtitle: formatDate(
        deposit.insertTimeMs ?? deposit.insertTime ?? deposit.createdAt,
      ),
      status: statusOf(deposit, isOperation),
      amount: { ...deposit.amount, showCode: true },
      fields: [
        { label: f.network, value: deposit.network },
        { label: f.usdtValuation, amount: usdt },
        { label: f.coin, value: deposit.coin },
        isOperation
          ? { label: f.operationAccount, value: deposit.operationAccount }
          : { label: f.userEmail, value: owner },
      ],
      details: isOperation
        ? [
            { label: f.txnId, value: deposit.txId },
            { label: f.depositAddress, value: deposit.depositAddress },
            { label: f.sourceAddress, value: deposit.sourceAddress },
            { label: f.insertTime, value: dateOf(deposit.insertTime) },
          ]
        : [
            { label: f.txnId, value: deposit.txId },
            { label: f.address, value: deposit.address },
            { label: f.sourceAddress, value: deposit.sourceAddress },
            { label: f.insertTime, value: dateOf(deposit.insertTimeMs) },
            { label: f.updateTime, value: dateOf(deposit.fetchedAtMs) },
          ],
      columns: isOperation ? OPERATION_COLUMNS : USER_COLUMNS,
    }
  }
}
