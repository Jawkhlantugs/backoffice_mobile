import { spotRepository } from '@/data/spot/spot-repository'

import { usePagedList } from './use-paged-list'

export const useSpotOrders = (search: string) =>
  usePagedList('spot-orders', spotRepository.orders, { search })
export const useSpotFills = (search: string) =>
  usePagedList('spot-fills', spotRepository.fills, { search })
export const useSpotTrades = (search: string) =>
  usePagedList('spot-trades', spotRepository.trades, { search })
export const useSpotCommissions = (search: string) =>
  usePagedList('spot-commissions', spotRepository.commissions, { search })
export const useSpotSymbols = (search: string) =>
  usePagedList('spot-symbols', spotRepository.symbols, { search })
