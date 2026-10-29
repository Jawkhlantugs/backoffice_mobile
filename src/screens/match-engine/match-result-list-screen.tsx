import { useState } from 'react'
import { View } from 'react-native'

import {
  AppText,
  FilterChips,
  ListFilterSheet,
  PagedListScreen,
  TextButton,
  type ListFilterField,
  type RecordView,
} from '@/components'
import {
  MISSING_TXIN,
  type MatchMarket,
  type MatchResult,
  type MissingTxin,
} from '@/data/match-engine/match-engine-model'
import { useMatchResults } from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

const text = messages.matchEngine
const f = text.fields
const filterText = messages.finance.filters
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

/**
 * Вэбийн `MATCH_ENGINE_FILTER_FIELDS` (IHC, USDT ижил). `is_cancel` чип дээр,
 * `limit` нь доош гүйлгэх хуудаслалттай давхардах тул алга.
 */
const FILTER_FIELDS: ListFilterField[] = [
  { key: 'maker_order_id', label: f.makerOrder },
  { key: 'taker_order_id', label: f.takerOrder },
  { key: 'txinID', label: f.txinId },
  { key: 'maker_user_id', label: f.makerUser },
  { key: 'taker_user_id', label: f.takerUser },
  {
    key: 'hariult_amount',
    label: f.hariultAmount,
    placeholder: '0',
    keyboardType: 'decimal-pad',
  },
]

/** Settlement log, Excel татах нь вэб дээр. */
export function MatchResultListScreen({ market }: { market: MatchMarket }) {
  const [cancel, setCancel] = useState<string>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const [missing, setMissing] = useState<MissingTxin | typeof ALL>(ALL)
  const list = useMatchResults(market, {
    isCancel: cancel === ALL ? undefined : cancel,
    filters,
    missingTxin: missing === ALL ? undefined : missing,
  })
  const title = TITLES[market]()
  const activeCount = activeFilterCount(filters)

  return (
    <>
      <PagedListScreen
        title={title.title}
        subtitle={title.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="transfer"
        headerActions={[
          {
            icon: 'filter',
            label: filterText.open,
            onPress: () => setFilterOpen(true),
          },
        ]}
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
        filters={
          <View className="gap-2">
            <FilterChips
              chips={[
                { value: ALL, label: text.missingTxin.all },
                ...MISSING_TXIN.map((value) => ({
                  value,
                  label: text.missingTxin[value],
                })),
              ]}
              value={missing}
              onChange={setMissing}
            />
            {/* Хуудсанд олдохгүй ч цаана нь байж болно — хэрэглэгч өөрөө цааш татна. */}
            {list.scanned !== undefined ? (
              <View className="flex-row items-center justify-between gap-3">
                <AppText variant="caption">
                  {`${text.missingTxin.found}: ${list.items.length} / ${list.scanned}`}
                </AppText>
                {list.hasMore ? (
                  <TextButton
                    label={text.missingTxin.loadMore}
                    onPress={list.loadMore}
                  />
                ) : null}
              </View>
            ) : null}
            {activeCount > 0 ? (
              <TextButton
                label={`${filterText.clear} (${activeCount})`}
                onPress={() => setFilters({})}
                className="self-start"
              />
            ) : null}
          </View>
        }
        tableLabels={{ title: f.matchId, amount: f.makerAmount }}
        record={toRecord}
      />
      <ListFilterSheet
        visible={filterOpen}
        fields={FILTER_FIELDS}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
