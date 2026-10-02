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

function toRecord(item: WebFile): RecordView {
  return {
    title: item.name,
    subtitle: labelOf(text.fileTypes, item.fileType),
    image: item.fileType === 'image' && item.path ? item.path : undefined,
    fields: [
      { label: f.createdAt, value: formatDate(item.createdAt) },
      { label: f.updatedAt, value: formatDate(item.updatedAt) },
    ],
    details: [{ label: f.path, value: item.path }],
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
    />
  )
}
