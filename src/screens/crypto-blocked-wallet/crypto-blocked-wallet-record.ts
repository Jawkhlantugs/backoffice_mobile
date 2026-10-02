import type { RecordView } from '@/components'
import type { CryptoBlockedWallet } from '@/data/crypto-blocked-wallet/crypto-blocked-wallet-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

export function cryptoBlockedWalletRecord(
  wallet: CryptoBlockedWallet,
): RecordView {
  return {
    title: wallet.address,
    subtitle: wallet.network,
    status: { label: String(wallet.status), tone: 'danger' },
    fields: [{ label: f.reason, value: wallet.reason }],
    details: [
      { label: f.uid, value: wallet.createdByLabel },
      { label: f.createdAt, value: formatDate(wallet.createdAt) },
    ],
  }
}
