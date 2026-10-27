import { useState } from 'react'

import { ListFilterSheet, PagedListScreen, TextButton } from '@/components'
import {
  CRYPTO_WITHDRAWAL_STATUSES,
  type CryptoWithdrawalStatus,
} from '@/data/crypto-withdrawal/crypto-withdrawal-model'
import {
  COIN_AMOUNT_CURRENCY,
  isValidAmountFilter,
} from '@/data/shared/amount-filter'
import { useCryptoWithdrawals } from '@/hooks/use-crypto-withdrawals'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

import { useCryptoWithdrawalRecord } from './use-crypto-withdrawal-record'

const ALL = 'all'
const text = messages.finance

export function CryptoWithdrawalListScreen() {
  const record = useCryptoWithdrawalRecord()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CryptoWithdrawalStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useCryptoWithdrawals({
    search,
    status: status === ALL ? undefined : status,
    filters,
  })
  const activeCount = activeFilterCount(filters)

  return (
    <>
      <PagedListScreen
        title={text.cryptoWithdrawal.title}
        subtitle={text.cryptoWithdrawal.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="crypto"
        emptyLabel={text.empty}
        headerActions={[
          {
            icon: 'filter',
            label: text.filters.open,
            onPress: () => setFilterOpen(true),
          },
        ]}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: text.searchPlaceholder,
        }}
        statusChips={{
          chips: [
            { value: ALL, label: messages.common.all },
            ...CRYPTO_WITHDRAWAL_STATUSES.map((value) => ({
              value,
              label: text.cryptoWithdrawalStatuses[value],
            })),
          ],
          value: status,
          onChange: setStatus,
        }}
        filters={
          activeCount > 0 ? (
            <TextButton
              label={`${text.filters.clear} (${activeCount})`}
              onPress={() => setFilters({})}
              className="self-start"
            />
          ) : undefined
        }
        record={record}
        tableLabels={{ title: text.fields.id }}
      />
      {/* Вэбийн `CRYPTO_WITHDRAWAL_FILTER_FIELDS` — статус чип дээр. */}
      <ListFilterSheet
        visible={filterOpen}
        fields={[
          { key: 'id', label: text.filters.withdrawalId },
          {
            key: 'amount',
            label: text.fields.amount,
            amount: {
              conditionKey: 'amountCondition',
              isValid: (raw) => isValidAmountFilter(raw, COIN_AMOUNT_CURRENCY),
            },
          },
          {
            key: 'usdtValuation',
            label: text.fields.usdtValuation,
            amount: {
              conditionKey: 'usdtValuationCondition',
              isValid: (raw) => isValidAmountFilter(raw, 'USDT'),
            },
          },
          {
            key: 'coin',
            label: text.fields.coin,
            placeholder: `${text.filters.example} BTC`,
            autoCapitalize: 'characters',
          },
          {
            key: 'network',
            label: text.fields.network,
            placeholder: `${text.filters.example} BSC`,
            autoCapitalize: 'characters',
          },
          { key: 'txId', label: text.fields.txnId },
          { key: 'address', label: text.fields.address },
        ]}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
