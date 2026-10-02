import { QueryListScreen, type RecordView } from '@/components'
import type { WelcomeTask } from '@/data/reward-hub/reward-hub-model'
import { useWelcomeTasks } from '@/hooks/use-reward-hub'
import { messages } from '@/lib/messages'

const text = messages.rewardHub
const f = text.fields

function toRecord(item: WelcomeTask): RecordView {
  return {
    title: item.title || item.taskCode,
    subtitle: `#${item.orderId} · ${item.taskCode}`,
    amount: item.maxAmount,
    fields: [
      { label: f.task, value: item.taskCode },
      { label: f.minAmount, amount: item.minAmount },
      { label: f.rewardId, value: item.rewardId },
      { label: f.order, value: item.orderId },
    ],
    details: [{ label: f.description, value: item.description }],
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
      tableLabels={{ title: f.title, amount: f.maxAmount }}
      record={toRecord}
    />
  )
}
