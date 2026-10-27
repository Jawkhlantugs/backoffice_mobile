import { useState } from 'react'

import {
  PagedListScreen,
  type RecordField,
  type RecordView,
} from '@/components'
import type {
  BalanceSnapshot,
  SnapshotBalance,
} from '@/data/balance-snapshot/balance-snapshot-model'
import { useBalanceSnapshots } from '@/hooks/use-balance-snapshots'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function BalanceSnapshotListScreen() {
  const [search, setSearch] = useState('')
  const list = useBalanceSnapshots(search)

  return (
    <PagedListScreen
      title={text.balanceSnapshots.title}
      subtitle={text.balanceSnapshots.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="wallet"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.subAccountPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.id, amount: f.usdtValuation }}
    />
  )
}

/** Хөрөнгө бүр нэг мөр — "Spot · USDT". Дэлгэрэнгүйд л харагдана. */
function balanceRows(
  group: string,
  balances: SnapshotBalance[],
): RecordField[] {
  return balances.map((balance) => ({
    label: `${group} · ${balance.asset}`,
    amount: balance.free,
  }))
}

/** Вэбийн `user-management/balance-snapshots/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [f.subAccountId, f.date, f.mntValuation, 'amount'] as const

function toCard(item: BalanceSnapshot): RecordView {
  return {
    title: item.user ?? item.subAccountId,
    tableTitle: item.userId ?? item.id,
    subtitle: `${item.date} · ${item.subAccountId}`,
    amount: item.usdtValuation,
    fields: [
      { label: f.mntValuation, amount: item.mntValuation },
      { label: f.spot, value: item.spot.length },
      { label: f.futures, value: item.futures.length },
      { label: f.fiat, value: item.bank.length },
    ],
    details: [
      ...balanceRows(f.spot, item.spot),
      ...balanceRows(f.futures, item.futures),
      ...balanceRows(f.fiat, item.bank),
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.date, value: item.date },
    ],
    columns: COLUMNS,
  }
}
