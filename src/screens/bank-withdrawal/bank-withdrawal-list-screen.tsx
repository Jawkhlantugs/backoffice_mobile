import { useState } from 'react'

import { PagedListScreen, TextButton } from '@/components'
import {
  BANK_WITHDRAWAL_STATUSES,
  type BankWithdrawalStatus,
} from '@/data/bank-withdrawal/bank-withdrawal-model'
import {
  useBankWithdrawals,
  type BankWithdrawalFilters,
} from '@/hooks/use-bank-withdrawals'
import { messages } from '@/lib/messages'

import { BankWithdrawalFilterSheet } from './bank-withdrawal-filter-sheet'
import { useBankWithdrawalRecord } from './use-bank-withdrawal-record'

const ALL = 'all'
const text = messages.finance

export function BankWithdrawalListScreen() {
  const record = useBankWithdrawalRecord()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BankWithdrawalStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<BankWithdrawalFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useBankWithdrawals({
    search,
    status: status === ALL ? undefined : status,
    filters,
  })

  // `condition` нь дүнгийн хамт л утгатай тул тусад нь тоолохгүй.
  const activeCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'condition' && value !== undefined,
  ).length

  return (
    <>
      <PagedListScreen
        title={text.bankWithdrawals.title}
        subtitle={text.bankWithdrawals.subtitle}
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
          placeholder: text.searchPlaceholder,
        }}
        statusChips={{
          chips: [
            { value: ALL, label: messages.common.all },
            ...BANK_WITHDRAWAL_STATUSES.map((value) => ({
              value,
              label: text.bankStatuses[value],
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
        tableLabels={{ title: text.fields.id, amount: text.fields.totalAmount }}
      />
      <BankWithdrawalFilterSheet
        visible={filterOpen}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}
