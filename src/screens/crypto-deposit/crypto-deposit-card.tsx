import { RecordCard } from '@/components'
import type { CryptoDeposit } from '@/data/crypto-deposit/crypto-deposit-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function CryptoDepositCard({ deposit }: { deposit: CryptoDeposit }) {
  return (
    <RecordCard
      title={deposit.userEmail ?? deposit.userId ?? deposit.id}
      subtitle={formatDate(deposit.insertTime ?? deposit.createdAt)}
      status={{ label: String(deposit.status), tone: 'neutral' }}
      amount={deposit.amount}
      fields={[
        { label: f.network, value: deposit.network },
        { label: f.usdtValuation, value: deposit.usdtValuation },
      ]}
      details={[
        { label: f.txnId, value: deposit.txId },
        { label: f.address, value: deposit.depositAddress },
      ]}
    />
  )
}
