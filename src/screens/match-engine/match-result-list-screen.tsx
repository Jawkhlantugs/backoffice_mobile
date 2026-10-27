import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type {
  MatchMarket,
  MatchResult,
} from '@/data/match-engine/match-engine-model'
import { useMatchResults } from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.matchEngine
const f = text.fields
const ALL = 'all'
/** Вэбийн `is_cancel` шүүлтүүр — backend '0'/'1' мөр хүлээнэ. */
const CANCEL_VALUES = ['0', '1'] as const

const TITLES = {
  'ihc-mnt': () => text.ihcMnt,
  'usdt-mnt': () => text.usdtMnt,
} as const

/** Вэбийн `match-*-mnt/components/columns.tsx`-ийн дараалал (хоёулаа ижил). */
const COLUMNS = [
  f.pair,
  f.price,
  f.makerOrder,
  f.takerOrder,
  f.makerTxin,
  f.takerTxin,
  f.makerUser,
  f.takerUser,
  'amount',
  f.takerAmount,
  f.makerType,
  f.takerType,
  'status',
  f.createdAt,
] as const

function toRecord(item: MatchResult): RecordView {
  const side = (buyer: boolean) => (buyer ? text.buyer : text.seller)
  return {
    title: item.id,
    subtitle: `${item.pair} · ${formatDate(item.createdAt)}`,
    // Вэб `is_cancel`-ийг "Yes" улаан, "No" саарал Badge-аар харуулдаг.
    status: item.cancelled
      ? { label: text.cancelled, tone: 'danger' }
      : { label: text.matched, tone: 'neutral' },
    amount: item.maker.amount,
    fields: [
      { label: f.price, value: item.price },
      { label: f.takerAmount, amount: item.taker.amount },
      {
        label: f.makerType,
        value: `${item.maker.type} · ${side(item.maker.isBuyer)}`,
      },
      {
        label: f.takerType,
        value: `${item.taker.type} · ${side(item.taker.isBuyer)}`,
      },
    ],
    details: [
      { label: f.pair, value: item.pair },
      {
        label: f.createdAt,
        value: item.createdAt ? formatDate(item.createdAt) : undefined,
      },
      { label: f.makerOrder, value: item.maker.orderId },
      { label: f.takerOrder, value: item.taker.orderId },
      { label: f.makerUser, value: item.maker.userId },
      { label: f.takerUser, value: item.taker.userId },
      { label: f.makerTxin, value: item.maker.txinId },
      { label: f.takerTxin, value: item.taker.txinId },
      { label: f.makerFee, amount: item.maker.fee },
      { label: f.takerFee, amount: item.taker.fee },
    ],
    columns: COLUMNS,
  }
}

/** Settlement log, Excel татах нь вэб дээр. */
export function MatchResultListScreen({ market }: { market: MatchMarket }) {
  const [cancel, setCancel] = useState<string>(ALL)
  const list = useMatchResults(market, cancel === ALL ? undefined : cancel)
  const title = TITLES[market]()

  return (
    <PagedListScreen
      title={title.title}
      subtitle={title.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="transfer"
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...CANCEL_VALUES.map((value) => ({
            value,
            label: value === '1' ? text.cancelled : text.matched,
          })),
        ],
        value: cancel,
        onChange: setCancel,
      }}
      tableLabels={{ title: f.matchId, amount: f.makerAmount }}
      record={toRecord}
    />
  )
}
