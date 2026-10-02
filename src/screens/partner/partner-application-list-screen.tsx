import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  APPLICATION_STATUSES,
  type PartnerApplication,
} from '@/data/partner/partner-model'
import {
  useApprovePartnerApplication,
  usePartnerApplications,
  useRejectPartnerApplication,
} from '@/hooks/use-partners'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, partnerStatus, partnerStatusChips } from './partner-status'

const text = messages.partner
const f = text.fields

export function PartnerApplicationListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = usePartnerApplications(
    search,
    status === ALL ? undefined : status,
  )
  const approve = useApprovePartnerApplication()
  const reject = useRejectPartnerApplication()

  function toRecord(item: PartnerApplication): RecordView {
    const label = item.email ?? item.companyName ?? item.id
    const decided = item.status !== 'pending'
    return {
      title: label,
      subtitle: [item.name, formatDate(item.createdAt)]
        .filter(Boolean)
        .join(' · '),
      status: partnerStatus(item.status),
      fields: [
        { label: f.company, value: item.companyName },
        { label: f.audience, value: item.audienceSize },
        {
          label: f.reviewedAt,
          value: item.reviewedAt ? formatDate(item.reviewedAt) : undefined,
        },
        { label: f.reviewer, value: item.reviewer },
      ],
      details: [
        { label: f.name, value: item.name },
        { label: f.kyc, value: item.kycLevel },
        { label: f.website, value: item.website },
        { label: f.promotionPlan, value: item.promotionPlan },
        { label: f.appliedAt, value: formatDate(item.createdAt) },
        { label: f.rejectionReason, value: item.rejectionReason },
      ],
      actions: [
        {
          key: 'approve',
          label: text.approve,
          icon: 'check',
          hidden: decided,
          confirm: { title: text.approveApplicationTitle, description: label },
          run: () => approve.mutateAsync(item.id),
        },
        {
          key: 'reject',
          label: text.reject,
          icon: 'close',
          destructive: true,
          hidden: decided,
          confirm: {
            title: text.rejectApplicationTitle,
            description: label,
            reason: { label: text.reasonPlaceholder, required: true },
          },
          run: (reason = '') => reject.mutateAsync({ id: item.id, reason }),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.applications.title}
      subtitle={text.applications.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="partner"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: partnerStatusChips(APPLICATION_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.email }}
      record={toRecord}
    />
  )
}
