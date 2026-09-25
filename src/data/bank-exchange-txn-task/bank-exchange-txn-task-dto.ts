import type { BankExchangeTxnTask } from './bank-exchange-txn-task-model'

export type BankExchangeTxnTaskDto = {
  id?: string
  created_at?: string
  amount?: number
  currency?: string
  receiverIBAN?: string
  senderIBAN?: string
  status?: string
  transferTime?: string
  requestTime?: string
}

export function toBankExchangeTxnTask(
  dto: BankExchangeTxnTaskDto,
): BankExchangeTxnTask {
  return {
    id: dto.id ?? '',
    amount: { raw: dto.amount ?? 0, currency: dto.currency ?? '' },
    receiverIban: dto.receiverIBAN,
    senderIban: dto.senderIBAN,
    status: dto.status ?? '',
    transferTime: dto.transferTime,
    requestTime: dto.requestTime,
    createdAt: dto.created_at,
  }
}
