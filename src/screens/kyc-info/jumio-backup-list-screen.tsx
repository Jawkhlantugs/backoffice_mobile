import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { JumioBackup } from '@/data/jumio-backup/jumio-backup-model'
import { useJumioBackups } from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.jumio
const f = text.fields

/** Вэбийн `user-management/jumio-backup/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.customerId,
  f.firstName,
  f.lastName,
  f.type,
  'status',
  f.country,
  f.createdAt,
] as const

function toRecord(item: JumioBackup): RecordView {
  return {
    tableTitle: item.scanReference,
    title:
      [item.firstName, item.lastName].filter(Boolean).join(' ') ||
      item.scanReference,
    subtitle: item.scanReference,
    status:
      item.verified === undefined
        ? undefined
        : item.verified
          ? // Вэб "Verified"-ийг өнгөгүй (default) Badge-аар.
            { label: text.verified, tone: 'neutral' }
          : { label: text.notVerified, tone: 'danger' },
    fields: [
      { label: f.type, value: item.type },
      { label: f.country, value: item.country },
      { label: f.customerId, value: item.customerId },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [
      { label: f.scanReference, value: item.scanReference },
      { label: f.firstName, value: item.firstName },
      { label: f.lastName, value: item.lastName },
    ],
    columns: COLUMNS,
  }
}

/** Бичиг баримтын зураг утсанд татахгүй, харуулахгүй (CLAUDE.md §4). */
export function JumioBackupListScreen() {
  const [search, setSearch] = useState('')
  const list = useJumioBackups(search)

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.imagesHint}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="kyc"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.searchPlaceholder,
      }}
      tableLabels={{ title: f.scanReference, status: f.status }}
      record={toRecord}
    />
  )
}
