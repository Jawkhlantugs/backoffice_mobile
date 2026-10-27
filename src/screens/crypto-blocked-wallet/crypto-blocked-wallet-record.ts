import type { RecordView } from '@/components'
import type { CryptoBlockedWallet } from '@/data/crypto-blocked-wallet/crypto-blocked-wallet-model'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const f = messages.finance.fields

/** Вэбийн `crypto/blocked-wallets/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.address,
  f.network,
  f.reason,
  'status',
  f.createdBy,
  f.createdAt,
] as const

export function cryptoBlockedWalletRecord(
  wallet: CryptoBlockedWallet,
): RecordView {
  const active = wallet.status === 1
  return {
    title: wallet.address,
    tableTitle: wallet.id,
    subtitle: wallet.network,
    // Вэбийн `getStatusVariant`: 1 → Active (ногоон), 0 → Inactive (улаан).
    status: {
      label: active ? 'Active' : 'Inactive',
      tone: active ? 'success' : wallet.status === 0 ? 'danger' : 'neutral',
    },
    fields: [
      { label: f.reason, value: wallet.reason },
      { label: f.network, value: wallet.network },
      { label: f.createdBy, value: wallet.createdByLabel },
      {
        label: f.createdAt,
        value: wallet.createdAt ? formatDate(wallet.createdAt) : undefined,
      },
    ],
    details: [{ label: f.address, value: wallet.address }],
    columns: COLUMNS,
  }
}
