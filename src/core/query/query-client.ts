import { MutationCache, QueryClient } from '@tanstack/react-query'

import type { AppException } from '@/core/errors/app-exception'
import { toast } from '@/core/ui/toast-store'
import { translateUnknownError } from '@/lib/messages'

/**
 * Server state-ийн ганц эх сурвалж. Cache нь **зөвхөн санах ойд** —
 * persister зориуд тохируулаагүй (§1.4: ticket, хэрэглэгчийн мэдээлэл
 * дискэнд үлдэхгүй).
 */
export const queryClient = new QueryClient({
  // Үйлдэл бүтэлгүйтвэл дэлгэц бүр мартахгүйн тулд нэг газраас мэдэгдэнэ.
  mutationCache: new MutationCache({
    onError: (error) => toast.error(translateUnknownError(error)),
  }),
  defaultOptions: {
    queries: {
      // Админ мөнгө хөдөлгөх шийдвэр гаргадаг — хуучирсан тоо харуулахгүй.
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        const failure = error as unknown as AppException
        // Эрхгүй, session дууссан, гэрээ зөрчигдсөн — дахин оролдох утгагүй.
        if (failure?.kind === 'auth' || failure?.kind === 'parse') return false
        if (failure?.kind === 'api' && failure.statusCode < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Мөнгө хөдөлгөх mutation-ыг автоматаар давтахгүй — давхар гүйлгээ
      // үүсгэх эрсдэлтэй. Дахин оролдохыг хэрэглэгч ил шийднэ.
      retry: false,
    },
  },
})
