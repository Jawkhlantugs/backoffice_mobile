import type { BankExchangeTxnTask } from './bank-exchange-txn-task-model'

export type BankExchangeTxnTaskDto = {
  id?: string
  created_at?: string
  amount?: number
  currency?: string
  reason?: string
  receiverName?: string
  receiverIBAN?: string
  senderIBAN?: string
  bankResponse?: { journalNo?: string }
  metadata?: { userId?: string }
  status?: string
  transferTime?: string
  requestTime?: string
}

export function toBankExchangeTxnTask(
  dto: BankExchangeTxnTaskDto,
): BankExchangeTxnTask {
  const currency = dto.currency ?? ''
  return {
    id: dto.id ?? '',
    amount: { raw: dto.amount ?? 0, currency },
    currency,
    reason: dto.reason,
    receiverName: dto.receiverName,
    receiverIban: dto.receiverIBAN,
    senderIban: dto.senderIBAN,
    journalNo: dto.bankResponse?.journalNo,
    userId: dto.metadata?.userId,
    status: dto.status ?? '',
    transferTime: dto.transferTime,
    requestTime: dto.requestTime,
    createdAt: dto.created_at,
  }
}
