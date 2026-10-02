import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import { PARTNER_STATUSES, type Partner } from '@/data/partner/partner-model'
import { usePartners, useUpdatePartnerStatus } from '@/hooks/use-partners'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, partnerStatus, partnerStatusChips } from './partner-status'

const text = messages.partner
const f = text.fields

export function PartnerListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = usePartners(search, status === ALL ? undefined : status)
  const update = useUpdatePartnerStatus()

  function toRecord(item: Partner): RecordView {
    const label = item.email ?? item.companyName ?? item.id
    return {
      title: label,
      subtitle: [item.name, item.companyName].filter(Boolean).join(' · '),
      status: partnerStatus(item.status),
      amount: item.totalEarnings,
      fields: [
        { label: f.tier, value: item.tier },
        { label: f.referralCode, value: item.referralCode },
        { label: f.referrals, value: item.totalReferrals },
        { label: f.createdAt, value: formatDate(item.createdAt) },
      ],
      details: [
        { label: f.name, value: item.name },
        { label: f.company, value: item.companyName },
        { label: f.website, value: item.website },
        { label: f.kyc, value: item.kycLevel },
      ],
      actions: [
        {
          key: 'activate',
          label: text.activate,
          icon: 'check',
          hidden: item.status === 'active',
          confirm: { title: text.activateTitle, description: label },
          run: () => update.mutateAsync({ id: item.id, status: 'active' }),
        },
        {
          key: 'suspend',
          label: text.suspend,
          icon: 'block',
          destructive: true,
          hidden: item.status === 'suspended',
          confirm: { title: text.suspendTitle, description: label },
          run: () => update.mutateAsync({ id: item.id, status: 'suspended' }),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.partners.title}
      subtitle={text.partners.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="partner"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: partnerStatusChips(PARTNER_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.email, amount: f.earnings }}
      record={toRecord}
    />
  )
}
