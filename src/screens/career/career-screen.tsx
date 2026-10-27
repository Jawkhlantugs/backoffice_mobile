import { useState } from 'react'

import {
  PagedListScreen,
  SegmentedControl,
  type RecordView,
  type StatusTone,
} from '@/components'
import {
  JOB_APPLICATION_STATUSES,
  JOB_POSTING_STATUSES,
  type JobApplication,
  type JobPosting,
} from '@/data/career/career-model'
import {
  useJobApplications,
  useJobPostings,
  useUpdateJobApplication,
} from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.careers
const f = text.fields

type Tab = 'postings' | 'applications'

/** Вэбийн `careers/components/*-columns.tsx`-ийн `STATUS_BADGE_MAP`. */
const POSTING_TONE: Record<string, StatusTone> = {
  ACTIVE: 'success',
  CLOSED: 'danger',
}
const APPLICATION_TONE: Record<string, StatusTone> = {
  INTERVIEWING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
}

/** Вэбийн `posting-columns.tsx`-ийн дараалал. */
const POSTING_COLUMNS = [
  f.department,
  f.location,
  f.type,
  f.salary,
  'status',
  f.createdAt,
] as const

/** Вэбийн `application-columns.tsx`-ийн дараалал. */
const APPLICATION_COLUMNS = [
  f.email,
  f.phone,
  f.posting,
  'status',
  f.createdAt,
] as const

function postingRecord(item: JobPosting): RecordView {
  return {
    title: item.title,
    subtitle: [item.department, item.location].filter(Boolean).join(' · '),
    status: {
      label: labelOf(text.postingStatuses, item.status) ?? item.status,
      tone: POSTING_TONE[item.status] ?? 'neutral',
    },
    fields: [
      { label: f.type, value: item.employmentType },
      { label: f.salary, value: item.salary },
      { label: f.position, value: item.position },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [
      { label: f.department, value: item.department },
      { label: f.location, value: item.location },
    ],
    columns: POSTING_COLUMNS,
  }
}

/** Вэбийн "Careers" — зар/анкет хоёр таб. Зар бичих, CV, тэмдэглэл вэб дээр. */
export function CareerScreen() {
  const [tab, setTab] = useState<Tab>('postings')
  const [postingStatus, setPostingStatus] =
    useState<(typeof JOB_POSTING_STATUSES)[number]>('ACTIVE')
  const [applicationStatus, setApplicationStatus] =
    useState<(typeof JOB_APPLICATION_STATUSES)[number]>('NEW')
  const postings = useJobPostings(postingStatus)
  const applications = useJobApplications(applicationStatus)
  const update = useUpdateJobApplication()

  function applicationRecord(item: JobApplication): RecordView {
    return {
      title: item.name || item.email,
      subtitle: item.email,
      status: {
        label: labelOf(text.applicationStatuses, item.status) ?? item.status,
        tone: APPLICATION_TONE[item.status] ?? 'neutral',
      },
      fields: [
        { label: f.phone, value: item.phone },
        { label: f.posting, value: item.postingId },
        { label: f.createdAt, value: formatDate(item.createdAt) },
        { label: f.notes, value: item.notes || undefined },
      ],
      details: [
        { label: f.email, value: item.email },
        { label: f.motivation, value: item.motivation },
        { label: f.cv, value: item.cvFileName },
      ],
      columns: APPLICATION_COLUMNS,
      actions: JOB_APPLICATION_STATUSES.filter(
        (status) => status !== item.status,
      ).map((status) => ({
        key: status,
        label: `${text.moveTo} ${text.applicationStatuses[status]}`,
        destructive: status === 'REJECTED',
        confirm: {
          title: text.moveTitle,
          description: `${item.name} · ${text.applicationStatuses[status]}`,
        },
        run: () => update.mutateAsync({ id: item.id, status }),
      })),
    }
  }

  const tabs = (
    <SegmentedControl
      options={[
        { value: 'postings', label: text.tabs.postings },
        { value: 'applications', label: text.tabs.applications },
      ]}
      value={tab}
      onChange={setTab}
    />
  )

  return tab === 'postings' ? (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={postings}
      keyExtractor={(item) => item.id}
      emptyIcon="work"
      filters={tabs}
      statusChips={{
        chips: JOB_POSTING_STATUSES.map((value) => ({
          value,
          label: text.postingStatuses[value],
        })),
        value: postingStatus,
        onChange: setPostingStatus,
      }}
      tableLabels={{ title: f.title }}
      record={postingRecord}
    />
  ) : (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={applications}
      keyExtractor={(item) => item.id}
      emptyIcon="users"
      filters={tabs}
      statusChips={{
        chips: JOB_APPLICATION_STATUSES.map((value) => ({
          value,
          label: text.applicationStatuses[value],
        })),
        value: applicationStatus,
        onChange: setApplicationStatus,
      }}
      tableLabels={{ title: f.name }}
      record={applicationRecord}
    />
  )
}
