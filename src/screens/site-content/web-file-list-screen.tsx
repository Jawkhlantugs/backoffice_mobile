import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type {
  WebFile,
  WebFileType,
} from '@/data/site-content/site-content-model'
import { useWebFiles } from '@/hooks/use-site-content'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields

/** Вэбийн шүүлтүүрт зураг, видео хоёр л байдаг. */
const FILTER_TYPES: readonly WebFileType[] = ['image', 'video']

/** Вэбийн `footer-menu/web-files/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [f.type, f.preview, f.createdAt, f.updatedAt] as const

function toRecord(item: WebFile): RecordView {
  return {
    title: item.name,
    subtitle: labelOf(text.fileTypes, item.fileType),
    image: item.fileType === 'image' && item.path ? item.path : undefined,
    fields: [
      { label: f.type, value: labelOf(text.fileTypes, item.fileType) },
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [
      { label: f.name, value: item.name },
      { label: f.preview, value: item.path },
    ],
    columns: COLUMNS,
  }
}

export function WebFileListScreen() {
  const [fileType, setFileType] = useState<WebFileType>('image')
  const list = useWebFiles(fileType)

  return (
    <PagedListScreen
      title={text.webFiles.title}
      subtitle={text.webFiles.subtitle}
      list={list}
      keyExtractor={(item) => item.name}
      emptyIcon="files"
      statusChips={{
        chips: FILTER_TYPES.map((value) => ({
          value,
          label: text.fileTypes[value],
        })),
        value: fileType,
        onChange: setFileType,
      }}
      record={toRecord}
      tableLabels={{ title: f.name }}
    />
  )
}
