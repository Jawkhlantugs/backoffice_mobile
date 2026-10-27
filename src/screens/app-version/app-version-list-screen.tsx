import { useState } from 'react'
import { useRouter } from 'expo-router'

import { PagedListScreen, type RecordView } from '@/components'
import {
  APP_OS,
  type AppOs,
  type AppVersion,
} from '@/data/app-version/app-version-model'
import { useAppVersions } from '@/hooks/use-app-versions'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.mobileContent
const ALL = 'all'

export function AppVersionListScreen() {
  const router = useRouter()
  const [os, setOs] = useState<AppOs | typeof ALL>(ALL)
  const list = useAppVersions(os === ALL ? undefined : os)

  return (
    <PagedListScreen
      title={text.versions.title}
      subtitle={text.versions.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="mobile"
      headerActions={[
        {
          icon: 'add',
          label: text.versions.new,
          onPress: () => router.push('/mobile/versions/new'),
        },
      ]}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...APP_OS.map((value) => ({ value, label: text.os[value] })),
        ],
        value: os,
        onChange: setOs,
      }}
      tableLabels={{ title: text.fields.os }}
      record={(item) => ({
        ...toCard(item),
        onPress: () =>
          router.push({
            pathname: '/mobile/versions/[id]',
            params: { id: item.id },
          }),
      })}
    />
  )
}

/** Вэбийн `mobile/app-versions/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  text.fields.version,
  text.fields.requiredVersion,
  text.fields.updateMode,
  text.fields.titleEn,
  'status',
  text.fields.createdAt,
] as const

function toCard(item: AppVersion): RecordView {
  const f = text.fields
  return {
    title: `${text.os[item.os]} ${item.version}`,
    tableTitle: text.os[item.os],
    subtitle: item.titleMn || item.titleEn,
    status: {
      label: text.statuses[item.status],
      // Вэб статусыг өнгөгүй, `required` горимыг улаан Badge-аар.
      tone: 'neutral',
    },
    fields: [
      { label: f.requiredVersion, value: item.requiredVersion },
      {
        label: f.updateMode,
        value: text.updateModes[item.updateMode],
        tone: item.updateMode === 'required' ? 'danger' : 'neutral',
      },
      { label: f.createdBy, value: item.createdBy },
      {
        label: f.updatedAt,
        value: formatDate(item.updateTime ?? item.createTime),
      },
    ],
    details: [
      { label: f.version, value: item.version },
      { label: f.titleEn, value: item.titleEn },
      { label: f.createdAt, value: formatDate(item.createTime) },
    ],
    columns: COLUMNS,
  }
}
