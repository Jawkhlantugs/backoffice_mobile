import { useQuery } from '@tanstack/react-query'

import type { WebFileType } from '@/data/site-content/site-content-model'
import { siteContentRepository } from '@/data/site-content/site-content-repository'

import { useCursorList } from './use-cursor-list'

export const useFooterCategories = () =>
  useCursorList('footer-categories', siteContentRepository.footerCategories)
export const useFooterItems = (categoryId?: string) =>
  useCursorList('footer-items', siteContentRepository.footerItems, {
    filters: { categoryId },
  })
export const useSitePages = (status?: string) =>
  useCursorList('site-pages', siteContentRepository.pages, {
    filters: { status },
  })
export const usePageCategories = (search: string, status?: string) =>
  useCursorList('page-categories', siteContentRepository.pageCategories, {
    search,
    filters: { status },
  })
export const useWebFiles = (fileType: WebFileType) =>
  useCursorList('web-files', siteContentRepository.webFiles, {
    filters: { fileType },
  })
export const useHeadConfigs = () =>
  useCursorList('head-configs', siteContentRepository.headConfigs)
export const useNews = (search: string, status?: string) =>
  useCursorList('news', siteContentRepository.news, {
    search,
    filters: { status },
  })

export const useFooterContact = () =>
  useQuery({
    queryKey: ['footer-contact'],
    queryFn: siteContentRepository.footerContact,
  })
export const useWithdrawalLimit = () =>
  useQuery({
    queryKey: ['withdrawal-limit'],
    queryFn: siteContentRepository.withdrawalLimit,
  })
