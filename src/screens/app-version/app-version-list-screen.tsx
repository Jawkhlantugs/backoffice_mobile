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

function toCard(item: AppVersion): RecordView {
  const f = text.fields
  return {
    title: `${text.os[item.os]} ${item.version}`,
    subtitle: item.titleMn || item.titleEn,
    status: {
      label: text.statuses[item.status],
      tone: item.status === 'active' ? 'success' : 'neutral',
    },
    fields: [
      { label: f.requiredVersion, value: item.requiredVersion },
      { label: f.updateMode, value: text.updateModes[item.updateMode] },
      { label: f.createdBy, value: item.createdBy },
      {
        label: f.updatedAt,
        value: formatDate(item.updateTime ?? item.createTime),
      },
    ],
  }
}
