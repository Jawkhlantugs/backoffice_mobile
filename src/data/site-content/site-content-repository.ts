import { clients } from '@/core/network/clients'
import {
  unwrap,
  unwrapObject,
  type CursorParams,
} from '@/core/network/envelope'
import { fetchCursorList } from '@/data/shared/fetch-cursor-list'

import {
  toFooterCategory,
  toFooterContact,
  toFooterItem,
  toHeadConfig,
  toNewsArticle,
  toPageCategory,
  toSitePage,
  toWebFile,
  toWithdrawalLimit,
  type FooterContactDto,
  type WithdrawalLimitDto,
} from './site-content-dto'
import type {
  FooterContact,
  WebFileType,
  WithdrawalLimit,
} from './site-content-model'

/**
 * Footer-ийн холбоо барих мэдээлэл нэг л бичлэг — вэб яг энэ id-г
 * (`contact/index.tsx`) уншдаг. Нууц биш, backend-ийн бичлэгийн түлхүүр.
 */
const FOOTER_CONTACT_ID = '8a69d455-0589-4c61-b0df-a58b0247ebe1'

type ListFilters = CursorParams & { status?: string }

/**
 * Endpoint: `footer-menu.service.ts`, `page*.service.ts`,
 * `web-files.service.ts`, `head-config.service.ts` (`{content}`),
 * `news.service.ts` (`{news}`). Бүгд DynamoDB cursor.
 */
export const siteContentRepository = {
  footerCategories: (params: ListFilters) =>
    fetchCursorList(
      clients.content,
      '/footer-menu/categories/list',
      params,
      { limit: params.limit },
      toFooterCategory,
    ),
  footerItems: (params: ListFilters & { categoryId?: string }) =>
    fetchCursorList(
      clients.content,
      '/footer-menu/items/list',
      params,
      { limit: params.limit, category_id: params.categoryId },
      toFooterItem,
    ),
  pages: (params: ListFilters) =>
    fetchCursorList(
      clients.content,
      '/pages/list',
      params,
      { limit: params.limit, status: params.status },
      toSitePage,
    ),
  pageCategories: (params: ListFilters) =>
    fetchCursorList(
      clients.content,
      '/page-categories/list',
      params,
      { limit: params.limit, status: params.status, name_mn: params.query },
      toPageCategory,
    ),
  /** `fileType` заавал — вэб ч төрлөөр сонгож харуулдаг. */
  webFiles: (params: CursorParams & { fileType?: WebFileType }) =>
    fetchCursorList(
      clients.content,
      '/web-files/list',
      params,
      { limit: params.limit, fileType: params.fileType ?? 'image' },
      toWebFile,
    ),
  headConfigs: (params: CursorParams) =>
    fetchCursorList(
      clients.content,
      '/head-config/items/list',
      params,
      { limit: params.limit },
      toHeadConfig,
    ),
  /** Хайлт нь монгол гарчгаар (`name_mn`) — вэбийн хайлтын талбар. */
  news: (params: ListFilters & { category?: string }) =>
    fetchCursorList(
      clients.news,
      '/news/list',
      params,
      {
        name_mn: params.query,
        status: params.status,
        category: params.category,
      },
      toNewsArticle,
    ),

  async footerContact(): Promise<FooterContact> {
    const response = await clients.content.get(
      `/footer-menu/contacts/${FOOTER_CONTACT_ID}`,
    )
    return toFooterContact(
      unwrapObject<FooterContactDto>(response.data, 'footer-contact'),
    )
  },

  async withdrawalLimit(): Promise<WithdrawalLimit | null> {
    const response = await clients.content.get('/withdraw-limit')
    const body = unwrap<WithdrawalLimitDto | null>(response.data)
    return body ? toWithdrawalLimit(body) : null
  },
}
