import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { KycInfo } from '@/data/kyc-info/kyc-info-model'
import { useKycInfos } from '@/hooks/use-kyc-info'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'
import { webStatusTone } from '@/lib/web-badge'

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
      record={toCard}
      tableLabels={{ title: f.createdAt }}
    />
  )
}

/** Вэбийн `user-management/kyc-info/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.kycLevel,
  f.email,
  f.subAccountId,
  f.country,
  f.document,
  f.residenceCountry,
  f.dob,
  f.documentId,
  f.nationality,
  f.riskScore,
  f.sanctionResult,
  f.firstName,
  f.updatedAt,
  f.lastName,
  f.riskLevel,
] as const

function toCard(item: KycInfo): RecordView {
  const status = item.kycStatus ?? item.verificationStatus
  const flag = (value: boolean) => (value ? text.yes : text.no)
  return {
    title: item.email ?? item.uid,
    tableTitle: formatDate(item.createdAt),
    subtitle: [item.fullName, formatDate(item.createdAt)]
      .filter(Boolean)
      .join(' · '),
    status: status
      ? { label: status, tone: webStatusTone(status, 'kyc') }
      : undefined,
    fields: [
      { label: f.level, value: item.levelName },
      // Вэб `link_riskLevel`-ийг `kyc` өнгөөр (SUCCESS/FAILED/бусад шар).
      item.riskLevel
        ? {
            label: f.riskLevel,
            value: item.riskLevel,
            tone: webStatusTone(item.riskLevel, 'kyc'),
          }
        : { label: f.riskLevel },
      { label: f.pep, value: flag(item.pep) },
      { label: f.sanction, value: flag(item.sanctionHit) },
    ],
    details: [
      { label: f.kycLevel, value: item.kycLevel },
      { label: f.email, value: item.email },
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.verification, value: item.verificationStatus },
      { label: f.failReason, value: item.failReason },
      { label: f.country, value: item.country },
      { label: f.document, value: item.documentType },
      { label: f.residenceCountry, value: item.residenceCountry },
      { label: f.dob, value: item.dob },
      { label: f.documentId, value: item.documentId },
      { label: f.nationality, value: item.nationality },
      { label: f.riskScore, value: item.riskScore },
      { label: f.sanctionResult, value: item.sanctionResult },
      { label: f.firstName, value: item.firstName },
      { label: f.lastName, value: item.lastName },
      { label: f.expiry, value: item.expiryDate },
      {
        label: f.updatedAt,
        value: item.updatedAt ? formatDate(item.updatedAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
