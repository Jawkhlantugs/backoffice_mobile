import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import { formatAmountSafe } from '@/core/money/format'
import {
  PAYOUT_STATUSES,
  type PartnerPayout,
} from '@/data/partner/partner-model'
import {
  useApprovePartnerPayout,
  usePartnerPayouts,
  useRejectPartnerPayout,
} from '@/hooks/use-partners'
import { formatDate, formatDateOnly } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, partnerStatus, partnerStatusChips } from './partner-status'

const text = messages.partner
const f = text.fields

/** Мөнгө хөдөлгөнө — батлах/татгалзах нь зөвхөн `pending` үед (вэбтэй ижил). */
export function PartnerPayoutListScreen() {
  const [status, setStatus] = useState<string>(ALL)
  const list = usePartnerPayouts(status === ALL ? undefined : status)
  const approve = useApprovePartnerPayout()
  const reject = useRejectPartnerPayout()

  function toRecord(item: PartnerPayout): RecordView {
    const pending = item.status === 'pending'
    const description = `${item.partner} · ${formatAmountSafe(item.amount.raw, item.amount.currency)}`
    return {
      title: item.partner,
      subtitle: formatDate(item.createdAt),
      status: partnerStatus(item.status),
      amount: item.amount,
      fields: [
        { label: f.commissionCount, value: item.commissionCount },
        {
          label: f.period,
          value: `${formatDateOnly(item.periodStart)} – ${formatDateOnly(item.periodEnd)}`,
        },
        {
          label: f.processedAt,
          value: item.processedAt ? formatDate(item.processedAt) : undefined,
        },
      ],
      details: [
        { label: f.transactionId, value: item.transactionId },
        { label: f.failureReason, value: item.failureReason },
      ],
      actions: [
        {
          key: 'approve',
          label: text.approve,
          icon: 'check',
          hidden: !pending,
          confirm: { title: text.approvePayoutTitle, description },
          run: () => approve.mutateAsync(item.id),
        },
        {
          key: 'reject',
          label: text.reject,
          icon: 'close',
          destructive: true,
          hidden: !pending,
          confirm: {
            title: text.rejectPayoutTitle,
            description,
            reason: { label: text.reasonPlaceholder, required: true },
          },
          run: (reason = '') => reject.mutateAsync({ id: item.id, reason }),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.payouts.title}
      subtitle={text.payouts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="wallet"
      statusChips={{
        chips: partnerStatusChips(PAYOUT_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.partner }}
      record={toRecord}
    />
  )
}
