import { useState } from 'react'

import { PagedListScreen, TextButton } from '@/components'
import {
  EXCHANGE_BANK_TXN_STATUSES,
  type ExchangeBankTxnStatus,
} from '@/data/bank-exchange-bank-txn/bank-exchange-bank-txn-model'
import {
  useBankExchangeBankTxns,
  type BankExchangeBankTxnFilters,
} from '@/hooks/use-bank-exchange-bank-txn'
import { messages } from '@/lib/messages'

import { BankExchangeBankTxnFilterSheet } from './bank-exchange-bank-txn-filter-sheet'
import { useBankExchangeBankTxnRecord } from './use-bank-exchange-bank-txn-record'

const ALL = 'all'
const text = messages.finance

export function BankExchangeBankTxnListScreen() {
  const record = useBankExchangeBankTxnRecord()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExchangeBankTxnStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<BankExchangeBankTxnFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useBankExchangeBankTxns({
    search,
    processStatus: status === ALL ? undefined : status,
    filters,
  })

  // `condition` нь дүнгийн хамт л утгатай тул тусад нь тоолохгүй.
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'condition' && value !== undefined,
  ).length

  return (
    <>
      <PagedListScreen
        title={text.bankExchangeBankTxn.title}
        subtitle={text.bankExchangeBankTxn.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="bank"
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
          placeholder: text.bankExchangeBankTxn.searchPlaceholder,
        }}
        statusChips={{
          chips: [
            { value: ALL, label: messages.common.all },
            ...EXCHANGE_BANK_TXN_STATUSES.map((value) => ({
              value,
              label: text.processStatuses[value],
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
      <BankExchangeBankTxnFilterSheet
        visible={filterOpen}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
