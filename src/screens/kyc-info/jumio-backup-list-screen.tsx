import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { JumioBackup } from '@/data/jumio-backup/jumio-backup-model'
import { useJumioBackups } from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.jumio
const f = text.fields

function toRecord(item: JumioBackup): RecordView {
  return {
    title:
      [item.firstName, item.lastName].filter(Boolean).join(' ') ||
      item.scanReference,
    subtitle: item.scanReference,
    status:
      item.verified === undefined
        ? undefined
        : item.verified
          ? { label: text.verified, tone: 'success' }
          : { label: text.notVerified, tone: 'danger' },
    fields: [
      { label: f.type, value: item.type },
      { label: f.country, value: item.country },
      { label: f.customerId, value: item.customerId },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [{ label: f.scanReference, value: item.scanReference }],
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
      tableLabels={{ title: f.firstName }}
      record={toRecord}
    />
  )
}
