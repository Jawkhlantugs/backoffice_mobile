import { PagedListScreen, type RecordView } from '@/components'
import type { StakeContract } from '@/data/stake/stake-model'
import { useStakeContracts } from '@/hooks/use-stake'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields

export function StakeContractListScreen() {
  const list = useStakeContracts()

  return (
    <PagedListScreen
      title={text.stakeContracts.title}
      subtitle={text.stakeContracts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="stake"
      record={toCard}
      tableLabels={{ title: f.contractName, amount: f.totalStaked }}
    />
  )
}

/** Вэбийн `stake/contract/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [f.asset, f.duration, f.apr, f.min, f.max, 'amount'] as const

function toCard(item: StakeContract): RecordView {
  return {
    title: item.name,
    subtitle: `${item.asset} · ${item.durationDays} ${text.stake.days}`,
    status: {
      label: item.isEnabled ? f.enabled : (item.status ?? text.no),
      tone: item.isEnabled ? 'success' : 'neutral',
    },
    amount: item.totalStaked,
    fields: [
      {
        label: f.apr,
        value: item.apr === undefined ? undefined : `${item.apr}%`,
      },
      { label: f.duration, value: `${item.durationDays} ${text.stake.days}` },
      { label: f.min, amount: item.minAmount },
      { label: f.max, amount: item.maxAmount },
    ],
    details: [
      { label: f.asset, value: item.asset },
      {
        label: text.stake.policies,
        value: item.cancelPolicies
          .map(
            (policy) =>
              `${policy.fromDay}–${policy.toDay} ${text.stake.days}: ${policy.apr}%`,
          )
          .join('\n'),
      },
    ],
    columns: COLUMNS,
  }
}
