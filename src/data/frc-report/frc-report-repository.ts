import { clients } from '@/core/network/clients'
import type { PageParams } from '@/core/network/envelope'
import { fetchList } from '@/data/shared/fetch-list'

import {
  toFrcBankDeposit,
  toFrcBankWithdraw,
  toFrcConvert,
  toFrcCryptoDeposit,
  toFrcCryptoWithdraw,
  toFrcTrade,
} from './frc-report-dto'

export type FrcParams = PageParams & { start_day?: string; end_day?: string }

/** Хугацааг вэбийн `useFilterParams` шиг `sortDate` объект болгоно. */
const body = ({ start_day, end_day, ...rest }: FrcParams) => ({
  ...rest,
  sortDate: start_day || end_day ? { start_day, end_day } : undefined,
})

const report =
  <Dto, Model>(name: string, toModel: (dto: Dto) => Model) =>
  (params: FrcParams) =>
    fetchList(
      clients.backoffice,
      `/admin/reports/${name}`,
      body(params),
      toModel,
    )

/** Endpoint: `report.service.ts` — `POST {backoffice}/admin/reports/frc-*`. */
export const frcReportRepository = {
  cryptoDeposit: report('frc-crypto-deposit', toFrcCryptoDeposit),
  cryptoWithdraw: report('frc-crypto-withdraw', toFrcCryptoWithdraw),
  trade: report('frc-trade', toFrcTrade),
  bankDeposit: report('frc-bank-deposit', toFrcBankDeposit),
  bankWithdraw: report('frc-bank-withdraw', toFrcBankWithdraw),
  convert: report('frc-convert', toFrcConvert),
}
