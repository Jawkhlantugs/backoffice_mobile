import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import type { FooterItem } from '@/data/site-content/site-content-model'
import { useFooterCategories, useFooterItems } from '@/hooks/use-site-content'
import { activeStatus } from '@/lib/active-status'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'

const text = messages.siteContent
const f = text.fields
const ALL = 'all'

/** Ангиллын нэрийг вэб шиг идэвхтэй ангиллын жагсаалтаас тааруулна. */
export function FooterItemListScreen() {
  const [category, setCategory] = useState<string>(ALL)
  const categories = useFooterCategories()
  const list = useFooterItems(category === ALL ? undefined : category)

  const names = new Map(
    categories.items.map((item) => [item.id, item.nameMn || item.nameEn]),
  )

  function toRecord(item: FooterItem): RecordView {
    return {
      title: item.nameMn || item.nameEn || item.id,
      subtitle: item.nameEn,
      status: activeStatus(item.isActive),
      fields: [
        {
          label: f.category,
          value: item.categoryId
            ? (names.get(item.categoryId) ?? item.categoryId)
            : undefined,
        },
        { label: f.order, value: item.order },
        { label: f.type, value: labelOf(text.itemTypes, item.type) },
        { label: f.target, value: item.target },
      ],
      details: [
        { label: f.link, value: item.link },
        { label: f.createdAt, value: formatDate(item.createdAt) },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.footerItems.title}
      subtitle={text.footerItems.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="tree"
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...categories.items.map((item) => ({
            value: item.id,
            label: item.nameMn || item.nameEn,
          })),
        ],
        value: category,
        onChange: setCategory,
      }}
      tableLabels={{ title: f.nameMn }}
      record={toRecord}
    />
  )
}
