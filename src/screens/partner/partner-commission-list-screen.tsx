import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  COMMISSION_STATUSES,
  type PartnerCommission,
} from '@/data/partner/partner-model'
import { usePartnerCommissions } from '@/hooks/use-partners'
import { formatDate } from '@/lib/date'
import { formatRatio } from '@/lib/format-ratio'
import { messages } from '@/lib/messages'

import { ALL, partnerStatus, partnerStatusChips } from './partner-status'

const text = messages.partner
const f = text.fields

function toRecord(item: PartnerCommission): RecordView {
  return {
    title: item.referredUser ?? item.id,
    subtitle: [item.marketId, formatDate(item.tradeDate)]
      .filter(Boolean)
      .join(' · '),
    status: partnerStatus(item.status),
    amount: item.commission,
    fields: [
      { label: f.partner, value: item.partner },
      { label: f.volume, amount: item.volumeUsd },
      { label: f.rate, value: formatRatio(item.commissionRate) },
      { label: f.rebate, amount: item.rebate },
    ],
    details: [
      { label: f.market, value: item.marketId },
      { label: f.asset, value: item.asset },
      { label: f.positionId, value: item.positionId },
      { label: f.tradeDate, value: formatDate(item.tradeDate) },
    ],
  }
}

/** Excel-ээс импортлох нь вэб дээр (файл сонгох, урьдчилан харах). */
export function PartnerCommissionListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = usePartnerCommissions(
    search,
    status === ALL ? undefined : status,
  )

  return (
    <PagedListScreen
      title={text.commissions.title}
      subtitle={text.commissions.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="percent"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: partnerStatusChips(COMMISSION_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.referredUser, amount: f.commission }}
      record={toRecord}
    />
  )
}
