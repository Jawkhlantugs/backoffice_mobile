import type { BankExchangeBankTxn } from './bank-exchange-bank-txn-model'

export type BankExchangeBankTxnDto = {
  id?: string
  created_at?: string
  amount?: number
  amountType?: string
  beginBalance?: number
  currency?: string
  endBalance?: number
  processStatus?: string
  relatedAccountNumber?: string
  txnTime?: string
}

export function toBankExchangeBankTxn(
  dto: BankExchangeBankTxnDto,
): BankExchangeBankTxn {
  const currency = dto.currency ?? ''

  return {
    id: dto.id ?? '',
    amount:
      dto.amount === undefined ? undefined : { raw: dto.amount, currency },
    amountType: dto.amountType,
    beginBalance:
      dto.beginBalance === undefined
        ? undefined
        : { raw: dto.beginBalance, currency },
    endBalance:
      dto.endBalance === undefined
        ? undefined
        : { raw: dto.endBalance, currency },
    relatedAccountNumber: dto.relatedAccountNumber,
    processStatus: dto.processStatus,
    txnTime: dto.txnTime,
    createdAt: dto.created_at,
  }
}
