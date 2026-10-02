import { useState } from 'react'
import { useRouter } from 'expo-router'

import { PagedListScreen, type RecordView } from '@/components'
import {
  BANNER_TYPES,
  type BannerType,
  type MobileBanner,
} from '@/data/mobile-banner/mobile-banner-model'
import { useMobileBanners } from '@/hooks/use-mobile-banners'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.mobileContent
const ALL = 'all'

export function MobileBannerListScreen() {
  const router = useRouter()
  const [type, setType] = useState<BannerType | typeof ALL>(ALL)
  const list = useMobileBanners(type === ALL ? undefined : type)

  return (
    <PagedListScreen
      title={text.banners.title}
      subtitle={text.banners.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="mobile"
      headerActions={[
        {
          icon: 'add',
          label: text.banners.new,
          onPress: () => router.push('/mobile/banners/new'),
        },
      ]}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...BANNER_TYPES.map((value) => ({ value, label: text.types[value] })),
        ],
        value: type,
        onChange: setType,
      }}
      record={(item) => ({
        ...toCard(item),
        onPress: () =>
          router.push({
            pathname: '/mobile/banners/[id]',
            params: { id: item.id },
          }),
      })}
    />
  )
}

function toCard(item: MobileBanner): RecordView {
  const f = text.fields
  return {
    title: item.titleMn || item.titleEn,
    subtitle: item.titleEn,
    image: item.image || undefined,
    status: {
      label: text.statuses[item.status],
      tone: item.status === 'active' ? 'success' : 'neutral',
    },
    fields: [
      { label: f.type, value: text.types[item.type] },
      { label: f.target, value: text.targets[item.target] },
      { label: f.priority, value: item.priority },
      {
        label: f.updatedAt,
        value: formatDate(item.updateTime ?? item.createTime),
      },
    ],
  }
}
