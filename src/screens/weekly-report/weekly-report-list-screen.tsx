import { useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'

import {
  FilterChips,
  PagedListScreen,
  type RecordView,
  SegmentedControl,
  SelectField,
} from '@/components'
import { isOfficePrivileged } from '@/core/session/privileges'
import { useSessionStore } from '@/core/session/session-store'
import {
  ADMIN_DEPARTMENTS,
  WEEKLY_REPORT_STATUSES,
  type WeeklyReport,
  type WeeklyReportStatus,
} from '@/data/weekly-report/weekly-report-model'
import { useReportAuthors, useWeeklyReports } from '@/hooks/use-weekly-reports'
import { formatDate, formatDateOnly } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.weeklyReports
const ALL = 'all'

type Mode = 'mine' | 'department'

/**
 * Энгийн ажилтан: өөрийн тайлан (статусаар шүүнэ). Удирдлага: хэлтэс →
 * ажилтан сонгож тухайн хүний тайлангийн түүх (вэбийн department timeline).
 */
export function WeeklyReportListScreen() {
  const router = useRouter()
  const user = useSessionStore((store) => store.user)
  const privileged = isOfficePrivileged(user)

  const [mode, setMode] = useState<Mode>('mine')
  const [status, setStatus] = useState<WeeklyReportStatus | typeof ALL>(ALL)
  const [department, setDepartment] = useState<string>(
    user?.department ?? ADMIN_DEPARTMENTS[0],
  )
  const [authorId, setAuthorId] = useState<string>()
  const [search, setSearch] = useState('')

  const inDepartment = privileged && mode === 'department'
  const authors = useReportAuthors(inDepartment ? department : undefined)
  const list = useWeeklyReports(
    inDepartment ? '' : search,
    inDepartment
      ? { department, adminUserId: authorId }
      : {
          status: status === ALL ? undefined : status,
          adminUserId: privileged ? user?.id : undefined,
        },
  )

  const filters = (
    <View className="gap-3">
      {privileged ? (
        <SegmentedControl
          options={[
            { value: 'mine' as const, label: text.mine },
            { value: 'department' as const, label: text.department },
          ]}
          value={mode}
          onChange={setMode}
        />
      ) : null}
      {inDepartment ? (
        <>
          <FilterChips
            chips={ADMIN_DEPARTMENTS.map((value) => ({ value, label: value }))}
            value={department}
            onChange={(value) => {
              setDepartment(value)
              setAuthorId(undefined)
            }}
          />
          <SelectField
            label={text.fields.author}
            placeholder={messages.common.all}
            options={[
              { value: ALL, label: messages.common.all },
              ...(authors.data ?? []).map((author) => ({
                value: author.id,
                label: author.email,
              })),
            ]}
            value={authorId ?? ALL}
            onChange={(value) => setAuthorId(value === ALL ? undefined : value)}
            loading={authors.isPending}
            loadError={authors.error}
            onRetry={() => authors.refetch()}
          />
        </>
      ) : (
        <FilterChips
          chips={[
            { value: ALL, label: messages.common.all },
            ...WEEKLY_REPORT_STATUSES.map((value) => ({
              value,
              label: text.statuses[value],
            })),
          ]}
          value={status}
          onChange={setStatus}
        />
      )}
    </View>
  )

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="news"
      emptyLabel={text.empty}
      headerActions={[
        {
          icon: 'add',
          label: text.new,
          onPress: () => router.push('/office/weekly-reports/new'),
        },
      ]}
      search={inDepartment ? undefined : { value: search, onChange: setSearch }}
      filters={filters}
      record={(item) => ({
        ...toCard(item),
        onPress: () =>
          router.push({
            pathname: '/office/weekly-reports/[id]',
            params: { id: item.id },
          }),
      })}
    />
  )
}

function toCard(item: WeeklyReport): RecordView {
  const f = text.fields
  return {
    title: item.title,
    subtitle: `${formatDateOnly(item.weekStart)} – ${formatDateOnly(item.weekEnd)}`,
    status: {
      label: text.statuses[item.status],
      tone: item.status === 'SUBMITTED' ? 'success' : 'warning',
    },
    fields: [
      { label: f.author, value: item.author?.email },
      { label: f.completedWork, value: item.completedWork.length },
      {
        label: f.submittedAt,
        value: item.submittedAt
          ? formatDate(item.submittedAt, 'MM/DD HH:mm')
          : undefined,
      },
    ],
  }
}
