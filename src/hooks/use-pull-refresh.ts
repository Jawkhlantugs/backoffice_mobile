import { useState } from 'react'

export type PullRefresh = {
  refreshing: boolean
  onRefresh: () => void
}

/**
 * Татаж шинэчлэх (pull-to-refresh) төлөв.
 *
 * `query.isRefetching`-ийг шууд холбож болохгүй: нэг query key-г хэд хэдэн
 * дэлгэц хуваалцдаг тул нөгөө дэлгэц дээр татахад энэ дэлгэцийн
 * `UIRefreshControl` харагдахгүй байж эхэлдэг — iOS түүнийг
 * "offscreen beginRefreshing" гэж хаяна. Тиймээс энэ дэлгэц дээр
 * **өөрөө эхлүүлсэн** татах үйлдлийг л тоолно.
 */
export function usePullRefresh(refresh: () => Promise<unknown>): PullRefresh {
  const [refreshing, setRefreshing] = useState(false)

  return {
    refreshing,
    onRefresh: () => {
      if (refreshing) return
      setRefreshing(true)
      void refresh().finally(() => setRefreshing(false))
    },
  }
}
