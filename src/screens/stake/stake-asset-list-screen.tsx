import { PagedListScreen, type RecordView } from '@/components'
import type { StakeAsset } from '@/data/stake/stake-model'
import { useStakeAssets } from '@/hooks/use-stake'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function StakeAssetListScreen() {
  const list = useStakeAssets()

  return (
    <PagedListScreen
      title={text.stakeAssets.title}
      subtitle={text.stakeAssets.subtitle}
      list={list}
      keyExtractor={(item) => item.asset}
      emptyIcon="stake"
      record={toCard}
    />
  )
}

function toCard(item: StakeAsset): RecordView {
  return {
    title: item.asset,
    subtitle: item.title,
    status: {
      label: item.isEnabled ? f.enabled : (item.status ?? text.no),
      tone: item.isEnabled ? 'success' : 'neutral',
    },
    amount: item.totalStaked,
    fields: [
      { label: f.maxSize, amount: item.maxSize },
      { label: f.used, amount: item.usedMaxSize },
    ],
    details: [
      { label: f.status, value: item.status },
      {
        label: f.updatedAt,
        value: item.updatedAt ? formatDate(item.updatedAt) : undefined,
      },
    ],
  }
}
