import { PagedListScreen, type RecordView } from '@/components'
import type { HeadConfig } from '@/data/site-content/site-content-model'
import { useHeadConfigs } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields

function toRecord(item: HeadConfig): RecordView {
  return {
    title: item.route || item.id,
    subtitle: item.app,
    status: activeStatus(item.enabled),
    fields: [
      { label: f.locale, value: item.locale },
      { label: f.meta, value: item.metaCount },
      { label: f.links, value: item.linkCount },
      { label: f.scripts, value: item.scriptCount },
    ],
    details: [{ label: f.updatedAt, value: formatDate(item.updatedAt) }],
  }
}

/**
 * Тохируулсан route-ууд. Вэб sitemap-тай нийлүүлж "тохируулаагүй" мөрийг
 * ч харуулдаг — sitemap URL нь вэбийн env тул энд зөвхөн тохируулсан нь.
 */
export function HeadConfigListScreen() {
  const list = useHeadConfigs()

  return (
    <PagedListScreen
      title={text.headConfig.title}
      subtitle={text.headConfig.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="globe"
      tableLabels={{ title: f.route }}
      record={toRecord}
    />
  )
}
