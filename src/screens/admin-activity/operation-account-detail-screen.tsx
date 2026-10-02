import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import {
  AmountText,
  AppCard,
  AppText,
  EmptyState,
  InfoRow,
  SectionHeader,
  StateView,
  SummaryScreen,
} from '@/components'
import { MASTER_OPERATION_SUB_ACCOUNT_ID } from '@/data/operation-account/operation-account-balance-model'
import {
  useOperationAccount,
  useOperationAccountBalance,
} from '@/hooks/use-portal-extras'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.operationAccount
const f = messages.lists.fields

/**
 * Вэбийн `operation-accounts/$subAccountId` — дансны мэдээлэл ба үлдэгдэл.
 * Master данс futures master-balances-аас уншдаг тул энд зөвхөн тайлбар.
 */
export function OperationAccountDetailScreen() {
  const { subAccountId = '' } = useLocalSearchParams<{ subAccountId: string }>()
  const isMaster = subAccountId === MASTER_OPERATION_SUB_ACCOUNT_ID
  const account = useOperationAccount(subAccountId)
  const balance = useOperationAccountBalance(isMaster ? '' : subAccountId)
  const yesNo = (value: boolean) =>
    value ? messages.lists.yes : messages.lists.no

  return (
    <SummaryScreen
      title={account.data?.name ?? text.title}
      subtitle={subAccountId}
      onRefresh={() => Promise.all([account.refetch(), balance.refetch()])}
    >
      <StateView
        loading={account.isPending}
        error={account.error}
        onRetry={() => void account.refetch()}
      >
        {account.data ? (
          <AppCard className="gap-0 py-1">
            {[
              { label: f.subAccountId, value: account.data.subAccountId },
              { label: f.binanceEmail, value: account.data.binanceEmail },
              { label: f.canTrade, value: yesNo(account.data.canTrade) },
              { label: f.canWithdraw, value: yesNo(account.data.canWithdraw) },
              { label: f.description, value: account.data.description },
            ]
              .filter((row) => row.value)
              .map((row, index) => (
                <InfoRow
                  key={row.label}
                  label={row.label}
                  value={row.value ?? ''}
                  className={cn(
                    'py-2.5',
                    index > 0 && 'border-t border-border',
                  )}
                />
              ))}
          </AppCard>
        ) : null}
      </StateView>

      {isMaster ? (
        <AppText variant="caption">{text.masterHint}</AppText>
      ) : (
        <StateView
          loading={balance.isPending}
          error={balance.error}
          onRetry={() => void balance.refetch()}
        >
          <View className="gap-2">
            <SectionHeader title={text.assets} />
            {balance.data?.assets.length ? (
              <AppCard className="gap-0 py-1">
                {balance.data.assets.map((item, index) => (
                  <View
                    key={item.asset}
                    className={cn(
                      'flex-row items-center justify-between py-2.5',
                      index > 0 && 'border-t border-border',
                    )}
                  >
                    <AppText variant="body" className="font-medium">
                      {item.asset}
                    </AppText>
                    <View className="items-end">
                      <AmountText amount={item.free} variant="body" />
                      {item.locked ? (
                        <AppText variant="tiny">
                          {text.locked}:{' '}
                          <AmountText amount={item.locked} variant="tiny" />
                        </AppText>
                      ) : null}
                    </View>
                  </View>
                ))}
              </AppCard>
            ) : (
              <EmptyState icon="wallet" title={text.empty} />
            )}
          </View>

          {balance.data?.balances.length ? (
            <View className="gap-2">
              <SectionHeader title={text.balances} />
              <AppCard className="gap-0 py-1">
                {balance.data.balances.map((item, index) => (
                  <View
                    key={item.asset}
                    className={cn(
                      'flex-row items-center justify-between py-2.5',
                      index > 0 && 'border-t border-border',
                    )}
                  >
                    <View className="gap-0.5">
                      <AppText variant="body" className="font-medium">
                        {item.asset}
                      </AppText>
                      <AppText variant="tiny">
                        {formatDate(item.updatedAt)}
                      </AppText>
                    </View>
                    <AmountText amount={item.balance} variant="body" />
                  </View>
                ))}
              </AppCard>
            </View>
          ) : null}
        </StateView>
      )}
    </SummaryScreen>
  )
}
