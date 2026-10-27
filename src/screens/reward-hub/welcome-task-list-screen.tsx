import { QueryListScreen, type RecordView } from '@/components'
import type { WelcomeTask } from '@/data/reward-hub/reward-hub-model'
import { useWelcomeTasks } from '@/hooks/use-reward-hub'
import { formatAmountSafe } from '@/core/money/format'
import { messages } from '@/lib/messages'

const text = messages.rewardHub
const f = text.fields

/** Вэбийн `reward-hub/register/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [f.task, f.title, f.rewardId, f.amount] as const

/** Вэб: доод = дээд бол нэг дүн, үгүй бол "доод – дээд asset". */
function rangeOf(item: WelcomeTask): string {
  const min = formatAmountSafe(item.minAmount.raw, item.minAmount.currency)
  const max = formatAmountSafe(item.maxAmount.raw, item.maxAmount.currency)
  const asset = item.maxAmount.currency
  return min === max ? `${min} ${asset}` : `${min} – ${max} ${asset}`
}

function toRecord(item: WelcomeTask): RecordView {
  return {
    title: item.title || item.taskCode,
    tableTitle: String(item.orderId),
    subtitle: `#${item.orderId} · ${item.taskCode}`,
    amount: item.maxAmount,
    fields: [
      { label: f.task, value: item.taskCode },
      { label: f.minAmount, amount: item.minAmount },
      { label: f.rewardId, value: item.rewardId },
      { label: f.order, value: item.orderId },
    ],
    details: [
      { label: f.title, value: item.title },
      { label: f.amount, value: rangeOf(item) },
      { label: f.description, value: item.description },
    ],
    columns: COLUMNS,
  }
}

/** Даалгавар нэмэх/засах (config JSON) нь вэб дээр. */
export function WelcomeTaskListScreen() {
  const query = useWelcomeTasks()

  return (
    <QueryListScreen
      title={text.welcomeTasks.title}
      subtitle={text.welcomeTasks.subtitle}
      query={query}
      keyExtractor={(item) => item.key}
      emptyIcon="reward"
      tableLabels={{ title: f.order }}
      record={toRecord}
    />
  )
}
