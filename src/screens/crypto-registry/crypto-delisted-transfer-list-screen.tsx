import { useState } from 'react'

import { PagedListScreen, type RecordView, type StatusTone } from '@/components'
import type { DelistedTransfer } from '@/data/crypto-registry/crypto-registry-model'
import { useDelistedTransfers } from '@/hooks/use-crypto-registry'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function CryptoDelistedTransferListScreen() {
  const [search, setSearch] = useState('')
  const list = useDelistedTransfers(search)

  return (
    <PagedListScreen
      title={text.cryptoDelisted.title}
      subtitle={text.cryptoDelisted.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="convert"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.id }}
    />
  )
}

/** Вэбийн `delisted-transfers/constants.ts`-ийн `getStatusVariant`. */
function statusToneOf(status: string): StatusTone {
  const upper = status.toUpperCase()
  if (upper === 'RETURNED_BASE_ASSET') return 'success'
  if (upper === 'PENDING' || upper === 'REQUESTED') return 'warning'
  if (upper.includes('FAIL') || upper.includes('ERROR')) return 'danger'
  return 'neutral'
}

/** Вэбийн `crypto/delisted-transfers/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.subAccountId,
  f.userEmail,
  f.asset,
  'amount',
  f.price,
  f.returnAmount,
  f.usdtValuation,
  'status',
  f.txnId,
  f.createdAt,
] as const

function toCard(item: DelistedTransfer): RecordView {
  return {
    title: item.owner ?? item.id,
    tableTitle: item.id,
    subtitle: formatDate(item.createdAt),
    status: item.status
      ? { label: item.status, tone: statusToneOf(item.status) }
      : undefined,
    amount: item.amount && { ...item.amount, showCode: true },
    fields: [
      {
        label: f.returnAmount,
        amount: item.returnAmount && { ...item.returnAmount, showCode: true },
      },
      { label: f.usdtValuation, amount: item.usdtValuation },
      { label: f.asset, value: item.asset },
      { label: f.price, value: item.price },
    ],
    details: [
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.userEmail, value: item.userEmail },
      { label: f.txnId, value: item.txnId },
      { label: f.returnTxnId, value: item.returnTxnId },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    columns: COLUMNS,
  }
}
