import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { SpotTrade } from '@/data/spot/spot-model'
import { useSpotTrades } from '@/hooks/use-spot'
import { compareDecimal } from '@/lib/compare-decimal'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function SpotTradeListScreen() {
  const [search, setSearch] = useState('')
  const list = useSpotTrades(search)

  return (
    <PagedListScreen
      title={text.spotTrades.title}
      subtitle={text.spotTrades.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transaction"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      record={toCard}
      tableLabels={{ title: f.tradeIdSymbol, amount: f.mntAmount }}
    />
  )
}

/** Вэб BUY-г ногоон, SELL-ийг улаан Badge-аар харуулдаг. */
const sideTone = (side: string) => (side === 'BUY' ? 'success' : 'danger')

const dateOf = (value?: string) => (value ? formatDate(value) : undefined)

/** Вэбийн `spot/trade-history/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.rate,
  f.income,
  f.symbol,
  f.quote,
  f.createdAt,
  'amount',
  f.formattedDate,
  f.asset,
  f.commissionStatus,
  f.postDate,
  f.isBuyerMaker,
  f.subAccountId,
  f.mntPrice,
  f.tradeType,
  f.tokenAmount,
  f.side,
  f.price,
  f.tradeId,
  f.usdtAmount,
  f.commissionTime,
] as const

function toCard(item: SpotTrade): RecordView {
  const collected = item.commissionStatus === '1'
  // Вэб 0-ээс их орлогыг ногоон текстээр харуулдаг.
  const income =
    item.income && (compareDecimal(item.income, '0') ?? 0) > 0
      ? { raw: item.income, currency: '' }
      : undefined
  return {
    title: item.symbol || item.asset,
    tableTitle: `${item.tradeId}_${item.symbol}`,
    subtitle: [item.user, formatDate(item.postDate)]
      .filter(Boolean)
      .join(' · '),
    status: item.commissionStatus
      ? {
          label: collected ? 'Collected' : 'Pending',
          tone: collected ? 'success' : 'neutral',
        }
      : undefined,
    amount: item.mntAmount,
    fields: [
      { label: f.side, value: item.side, tone: sideTone(item.side) },
      {
        label: f.tradeType,
        value: item.tradeType,
        tone: sideTone(item.tradeType),
      },
      { label: f.tokenAmount, amount: item.tokenAmount },
      { label: f.usdtAmount, amount: item.usdtAmount },
    ],
    details: [
      { label: f.rate, value: item.rate },
      income
        ? { label: f.income, amount: income, tone: 'success' }
        : { label: f.income, value: item.income ?? '0' },
      { label: f.symbol, value: item.symbol },
      { label: f.quote, value: item.quote },
      { label: f.createdAt, value: dateOf(item.createdAt) },
      { label: f.formattedDate, value: item.formattedDate },
      { label: f.asset, value: item.asset },
      {
        label: f.commissionStatus,
        value: collected ? 'Collected' : 'Pending',
        tone: collected ? 'success' : 'neutral',
      },
      { label: f.postDate, value: item.postDate },
      {
        label: f.isBuyerMaker,
        value: item.isBuyerMaker ? 'TRUE' : 'FALSE',
      },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.mntPrice, amount: item.mntPrice },
      { label: f.price, amount: item.price },
      { label: f.tradeId, value: item.tradeId },
      { label: f.commissionTime, value: item.commissionTime },
    ],
    columns: COLUMNS,
  }
}
