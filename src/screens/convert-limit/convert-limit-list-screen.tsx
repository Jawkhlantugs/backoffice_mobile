import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import { formatAmountSafe } from '@/core/money/format'
import {
  CONVERT_LIMIT_STATUSES,
  type ConvertLimitOrder,
  type ConvertLimitStatus,
} from '@/data/convert-limit/convert-limit-model'
import {
  useAcceptConvertLimit,
  useCompleteConvertLimit,
  useConvertLimitOrders,
  useRejectConvertLimit,
  useReopenConvertLimit,
} from '@/hooks/use-portal-extras'
import { formatDate } from '@/lib/date'
import { labelOf } from '@/lib/label-of'
import { messages } from '@/lib/messages'
import { statusTone } from '@/lib/status-tone'

const text = messages.convertLimit
const f = text.fields

/**
 * Мөнгө хөдөлгөнө — товч нь вэбийн `ConvertLimitAction`-тай ижил статусаар:
 * OFFERED → зөвшөөрөх/татгалзах, COUNTER_OFFERED → татгалзах,
 * PROCESSING → дуусгах, FAILED (payout-гүй) → дахин нээх. Эсрэг санал
 * (ханш, дүнгийн форм) вэб дээр.
 */
export function ConvertLimitListScreen() {
  const [status, setStatus] = useState<ConvertLimitStatus>('OFFERED')
  const list = useConvertLimitOrders(status)
  const accept = useAcceptConvertLimit()
  const reject = useRejectConvertLimit()
  const complete = useCompleteConvertLimit()
  const reopen = useReopenConvertLimit()

  function toRecord(item: ConvertLimitOrder): RecordView {
    const description = `${item.uid} · ${formatAmountSafe(item.amount.raw, item.amount.currency)} → ${item.toAsset}`
    const failedWithPayout = item.status === 'FAILED' && !!item.payoutTxnId
    return {
      title: item.uid || item.id,
      subtitle: `${item.fromAsset} → ${item.toAsset} · ${formatDate(item.createdAt)}`,
      status: {
        label: labelOf(text.statuses, item.status) ?? item.status,
        tone: failedWithPayout ? 'danger' : statusTone(item.status),
      },
      amount: item.amount,
      fields: [
        { label: f.rate, value: item.rate },
        { label: f.expected, amount: item.expectedTo },
        { label: f.expiresAt, value: formatDate(item.expiresAt) },
        { label: f.offers, value: item.offers },
      ],
      details: [
        { label: f.agreedRate, value: item.agreedRate },
        { label: f.agreedAmount, amount: item.agreedAmount },
        { label: f.lastActor, value: item.lastActor },
        {
          label: f.note,
          value: failedWithPayout ? text.manualReview : item.note,
        },
        { label: f.hold, value: item.holdTxnId },
        { label: f.payout, value: item.payoutTxnId },
        { label: f.refund, value: item.refundTxnId },
        { label: f.createdAt, value: formatDate(item.createdAt) },
      ],
      actions: [
        {
          key: 'accept',
          label: text.accept,
          icon: 'check',
          hidden: item.status !== 'OFFERED',
          confirm: {
            title: text.acceptTitle,
            description: `${description} · ${text.acceptHint}`,
          },
          run: () => accept.mutateAsync(item.id),
        },
        {
          key: 'complete',
          label: text.complete,
          icon: 'checkCircle',
          hidden: item.status !== 'PROCESSING',
          confirm: {
            title: text.completeTitle,
            description: `${description} · ${text.completeHint}`,
          },
          run: () => complete.mutateAsync(item.id),
        },
        {
          key: 'reopen',
          label: text.reopen,
          icon: 'retry',
          hidden: item.status !== 'FAILED' || failedWithPayout,
          confirm: {
            title: text.reopenTitle,
            description: `${description} · ${text.reopenHint}`,
          },
          run: () => reopen.mutateAsync(item.id),
        },
        {
          key: 'reject',
          label: text.reject,
          icon: 'close',
          destructive: true,
          hidden:
            item.status !== 'OFFERED' && item.status !== 'COUNTER_OFFERED',
          confirm: {
            title: text.rejectTitle,
            description,
            reason: { label: text.reasonPlaceholder, required: true },
          },
          run: (reason = '') => reject.mutateAsync({ id: item.id, reason }),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.title}
      subtitle={text.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="convert"
      statusChips={{
        chips: CONVERT_LIMIT_STATUSES.map((value) => ({
          value,
          label: text.statuses[value],
        })),
        value: status,
        onChange: setStatus,
      }}
      tableLabels={{ title: f.uid, amount: f.amount }}
      record={toRecord}
    />
  )
}
