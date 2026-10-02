import { QueryListScreen, type RecordView } from '@/components'
import type { PartnerTier } from '@/data/partner/partner-model'
import { usePartnerTiers } from '@/hooks/use-partners'
import { formatAmountSafe } from '@/core/money/format'
import { formatRatio } from '@/lib/format-ratio'
import { messages } from '@/lib/messages'

const text = messages.partner
const f = text.fields

function toRecord(tier: PartnerTier): RecordView {
  return {
    title: tier.name,
    subtitle: `${f.level} ${tier.level}`,
    status: tier.isDefault ? { label: f.isDefault, tone: 'info' } : undefined,
    fields: [
      { label: f.rate, value: formatRatio(tier.commissionRate) },
      { label: f.minClients, value: tier.minActiveClients },
      { label: f.minVolume, amount: tier.minVolume },
      {
        label: f.maxVolume,
        value: tier.maxVolume
          ? formatAmountSafe(tier.maxVolume.raw, tier.maxVolume.currency)
          : text.unlimited,
      },
    ],
  }
}

/** Түвшин нэмэх/засах/устгах нь вэб дээр (өнгө, хязгаарын форм). */
export function PartnerTierListScreen() {
  const query = usePartnerTiers()

  return (
    <QueryListScreen
      title={text.tiers.title}
      subtitle={text.tiers.subtitle}
      query={query}
      keyExtractor={(tier) => tier.id}
      emptyIcon="trophy"
      tableLabels={{ title: f.tier }}
      record={toRecord}
    />
  )
}
