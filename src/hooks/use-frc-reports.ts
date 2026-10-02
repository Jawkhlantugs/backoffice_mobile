import { frcReportRepository } from '@/data/frc-report/frc-report-repository'
import { recentRange, type RangePeriod } from '@/lib/date-range'

import { usePagedList } from './use-paged-list'

const options = (search: string, period: RangePeriod) => ({
  search,
  filters: recentRange(period),
})

export const useFrcCryptoDeposits = (search: string, period: RangePeriod) =>
  usePagedList(
    'frc-crypto-deposit',
    frcReportRepository.cryptoDeposit,
    options(search, period),
  )
export const useFrcCryptoWithdrawals = (search: string, period: RangePeriod) =>
  usePagedList(
    'frc-crypto-withdraw',
    frcReportRepository.cryptoWithdraw,
    options(search, period),
  )
export const useFrcTrades = (search: string, period: RangePeriod) =>
  usePagedList('frc-trade', frcReportRepository.trade, options(search, period))
export const useFrcBankDeposits = (search: string, period: RangePeriod) =>
  usePagedList(
    'frc-bank-deposit',
    frcReportRepository.bankDeposit,
    options(search, period),
  )
export const useFrcBankWithdrawals = (search: string, period: RangePeriod) =>
  usePagedList(
    'frc-bank-withdraw',
    frcReportRepository.bankWithdraw,
    options(search, period),
  )
export const useFrcConverts = (search: string, period: RangePeriod) =>
  usePagedList(
    'frc-convert',
    frcReportRepository.convert,
    options(search, period),
  )
