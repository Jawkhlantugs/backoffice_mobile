import { View } from 'react-native'

import { AmountText, AppCard, AppText, SectionHeader } from '@/components'
import type { AmountField } from '@/core/money/format'
import { messages } from '@/lib/messages'

const text = messages.users.assets

/** Одоогийн үлдэгдэл ба өдрийн snapshot хоёр ижил хэлбэртэй — нэг харагдац. */
type BalanceLine = {
  asset: string
  free: AmountField
  usdtValuation: AmountField
}

/** Нэг жагсаалтад олон валют холилдоно — USDT мөрөнд ч код хэрэгтэй. */
const withCode = (amount: AmountField): AmountField => ({
  ...amount,
  showCode: true,
})

function BalanceGroup({
  title,
  items,
}: {
  title: string
  items: BalanceLine[]
}) {
  if (items.length === 0) return null
  return (
    <AppCard className="gap-1">
      <SectionHeader title={title} />
      {items.map((item) => (
        <View
          key={item.asset}
          className="flex-row items-center justify-between py-1.5"
        >
          <AppText variant="body">{item.asset}</AppText>
          <View className="items-end">
            <AmountText amount={withCode(item.free)} variant="body" />
            <AmountText amount={withCode(item.usdtValuation)} variant="tiny" />
          </View>
        </View>
      ))}
    </AppCard>
  )
}

export function UserBalanceView({
  usdt,
  mnt,
  spot,
  futures,
  fiat,
}: {
  usdt: AmountField
  mnt: AmountField
  spot: BalanceLine[]
  futures: BalanceLine[]
  fiat: BalanceLine[]
}) {
  const empty = spot.length === 0 && futures.length === 0 && fiat.length === 0

  return (
    <View className="gap-3">
      <AppCard className="flex-row items-center justify-between">
        <AppText variant="label">{text.total}</AppText>
        <View className="items-end">
          <AmountText amount={withCode(mnt)} variant="title" />
          <AmountText amount={withCode(usdt)} variant="caption" />
        </View>
      </AppCard>

      <BalanceGroup title={text.spot} items={spot} />
      <BalanceGroup title={text.futures} items={futures} />
      <BalanceGroup title={text.fiat} items={fiat} />

      {empty ? (
        <AppText variant="caption" className="text-center">
          {text.empty}
        </AppText>
      ) : null}
    </View>
  )
}
