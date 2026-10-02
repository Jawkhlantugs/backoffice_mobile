import { AppText, StateView, SummaryScreen } from '@/components'
import { useWithdrawalLimit } from '@/hooks/use-site-content'
import { formatDate } from '@/lib/date'
import { groupDigits } from '@/lib/group-digits'
import { messages } from '@/lib/messages'

import { InfoSection } from './info-section'

const text = messages.siteContent
const f = text.fields

/**
 * Хэрэглэгчийн татан авалтын хязгаар. Мөнгөний хязгаар тул утсаар
 * өөрчлөхгүй — вэб дээрх форм (бүхэл тоо, баталгаажуулалт) ашиглана.
 */
export function WithdrawalLimitScreen() {
  const query = useWithdrawalLimit()
  const limit = query.data

  return (
    <SummaryScreen
      title={text.withdrawalLimit.title}
      subtitle={text.withdrawalLimit.subtitle}
      onRefresh={() => query.refetch()}
    >
      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={limit === null}
        emptyIcon="wallet"
        onRetry={() => void query.refetch()}
      >
        {limit ? (
          <>
            <InfoSection
              title={text.sections.bank}
              rows={[
                { label: f.bankMin, value: groupDigits(limit.bankMin) },
                { label: f.bankLimit, value: groupDigits(limit.bankLimit) },
              ]}
            />
            <InfoSection
              title={text.sections.crypto}
              rows={[
                { label: f.cryptoLimit, value: groupDigits(limit.cryptoLimit) },
              ]}
            />
            <InfoSection
              title={f.updatedAt}
              rows={[
                { label: f.updatedBy, value: limit.updatedBy },
                {
                  label: f.updatedAt,
                  value: limit.updatedAt
                    ? formatDate(limit.updatedAt)
                    : undefined,
                },
              ]}
            />
          </>
        ) : null}
        <AppText variant="caption">{text.webOnlyHint}</AppText>
      </StateView>
    </SummaryScreen>
  )
}
