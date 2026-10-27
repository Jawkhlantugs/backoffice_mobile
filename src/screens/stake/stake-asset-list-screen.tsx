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
      tableLabels={{ title: f.asset, amount: f.totalStaked }}
    />
  )
}

/** Вэбийн `stake/asset/components/columns.tsx`-ийн дараалал (Image-гүй). */
const COLUMNS = [f.title, 'amount', 'status', f.createdAt] as const

/** Вэб `status === 'active'`-ийг ногоон, бусдыг саарал Badge-аар. */
function toCard(item: StakeAsset): RecordView {
  return {
    title: item.asset,
    subtitle: item.title,
    status: {
      label: item.status ?? 'N/A',
      tone: item.status === 'active' ? 'success' : 'neutral',
    },
    amount: item.totalStaked,
    fields: [
      { label: f.maxSize, amount: item.maxSize },
      { label: f.used, amount: item.usedMaxSize },
      { label: f.enabled, value: item.isEnabled ? text.yes : text.no },
    ],
    details: [
      { label: f.title, value: item.title },
      {
        label: f.createdAt,
        value: item.createdAt ? formatDate(item.createdAt) : undefined,
      },
      {
        label: f.updatedAt,
        value: item.updatedAt ? formatDate(item.updatedAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
