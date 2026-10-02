import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  REFERRAL_STATUSES,
  type PartnerReferral,
} from '@/data/partner/partner-model'
import { usePartnerReferrals } from '@/hooks/use-partners'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

import { ALL, partnerStatus, partnerStatusChips } from './partner-status'

const text = messages.partner
const f = text.fields

const dateOrUndefined = (value: string | undefined) =>
  value ? formatDate(value) : undefined

function toRecord(item: PartnerReferral): RecordView {
  return {
    title: item.referredUser ?? item.id,
    subtitle: item.referredName,
    status: partnerStatus(item.status),
    fields: [
      { label: f.partner, value: item.partner },
      { label: f.referralCode, value: item.code },
      { label: f.kyc, value: item.kycLevel },
      { label: f.registeredAt, value: dateOrUndefined(item.registeredAt) },
    ],
    details: [
      { label: f.firstDeposit, value: dateOrUndefined(item.firstDepositAt) },
      { label: f.firstTrade, value: dateOrUndefined(item.firstTradeAt) },
      { label: f.unlinkedAt, value: dateOrUndefined(item.endedAt) },
    ],
  }
}

export function PartnerReferralListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>(ALL)
  const list = usePartnerReferrals(search, status === ALL ? undefined : status)

  return (
    <PagedListScreen
      title={text.referrals.title}
      subtitle={text.referrals.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="link"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      statusChips={{
        chips: partnerStatusChips(REFERRAL_STATUSES),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.referredUser }}
      record={toRecord}
    />
  )
}
