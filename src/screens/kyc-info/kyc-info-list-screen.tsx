import { useState } from 'react'

import { PagedListScreen, RecordCard } from '@/components'
import type { KycInfo } from '@/data/kyc-info/kyc-info-model'
import { useKycInfos } from '@/hooks/use-kyc-info'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.lists
const f = text.fields

export function KycInfoListScreen() {
  const [search, setSearch] = useState('')
  const list = useKycInfos(search)

  return (
    <PagedListScreen
      title={text.kycInfo.title}
      subtitle={text.kycInfo.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="kyc"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      renderItem={({ item }) => <RecordCard {...toCard(item)} />}
    />
  )
}

function toCard(item: KycInfo): React.ComponentProps<typeof RecordCard> {
  const status = item.kycStatus ?? item.verificationStatus
  const flag = (value: boolean) => (value ? text.yes : text.no)
  return {
    title: item.email ?? item.uid,
    subtitle: [item.fullName, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: status ? { label: status, tone: statusTone(status) } : undefined,
    fields: [
      { label: f.level, value: item.levelName },
      { label: f.risk, value: item.riskLevel },
      { label: f.pep, value: flag(item.pep) },
      { label: f.sanction, value: flag(item.sanctionHit) },
    ],
    details: [
      { label: f.verification, value: item.verificationStatus },
      { label: f.failReason, value: item.failReason },
      { label: f.country, value: item.country },
      { label: f.nationality, value: item.nationality },
      { label: f.dob, value: item.dob },
      { label: f.document, value: item.documentType },
      { label: f.documentId, value: item.documentId },
      { label: f.expiry, value: item.expiryDate },
      { label: f.user, value: item.uid },
    ],
  }
}
