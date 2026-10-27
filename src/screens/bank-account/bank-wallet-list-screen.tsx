import { useState } from 'react'

import {
  ListFilterSheet,
  PagedListScreen,
  TextButton,
  type RecordView,
} from '@/components'
import {
  BANK_WALLET_STATUSES,
  type BankWalletStatus,
  type UserBankWallet,
} from '@/data/bank-account/bank-account-model'
import { useUserBankWallets } from '@/hooks/use-bank-accounts'
import { formatDate } from '@/lib/date'
import { activeFilterCount, type ListFilters } from '@/lib/list-filters'
import { messages } from '@/lib/messages'

const text = messages.lists
const f = text.fields
const finance = messages.finance
const ALL = 'all'

/** Вэбийн `bank/wallets/components/columns.tsx`-ийн дараалал. */
const COLUMNS = [
  f.subAccountId,
  f.code,
  f.accountName,
  f.accountNumber,
  f.iban,
  f.bank,
  'status',
  f.verifiedAt,
] as const

export function BankWalletListScreen() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BankWalletStatus | typeof ALL>(ALL)
  const [filters, setFilters] = useState<ListFilters>({})
  const [filterOpen, setFilterOpen] = useState(false)
  const list = useUserBankWallets(search, {
    status: status === ALL ? undefined : status,
    filters,
  })
  const activeCount = activeFilterCount(filters)

  return (
    <>
      <PagedListScreen
        title={text.bankWallets.title}
        subtitle={text.bankWallets.subtitle}
        list={list}
        keyExtractor={(item) => item.id}
        emptyIcon="bank"
        headerActions={[
          {
            icon: 'filter',
            label: finance.filters.open,
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
            ...BANK_WALLET_STATUSES.map((value) => ({
              value,
              label: finance.walletStatuses[value],
            })),
          ],
          value: status,
          onChange: setStatus,
        }}
        filters={
          activeCount > 0 ? (
            <TextButton
              label={`${finance.filters.clear} (${activeCount})`}
              onPress={() => setFilters({})}
              className="self-start"
            />
          ) : undefined
        }
        record={toCard}
        tableLabels={{ title: f.id }}
      />
      {/* Вэбийн `WALLET_FILTER_FIELDS` — статус чип дээр. */}
      <ListFilterSheet
        visible={filterOpen}
        fields={[
          { key: 'id', label: finance.filters.accountId },
          {
            key: 'accountNumber',
            label: f.accountNumber,
            keyboardType: 'number-pad',
          },
          {
            key: 'accountName',
            label: f.accountName,
            autoCapitalize: 'characters',
          },
        ]}
        value={filters}
        onApply={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </>
  )
}

function toCard(item: UserBankWallet): RecordView {
  return {
    title: item.owner ?? item.accountName ?? item.id,
    tableTitle: item.id,
    subtitle: [item.bankName, item.accountNumber].filter(Boolean).join(' · '),
    // Вэб статусыг outline Badge-аар (өнгөгүй) харуулдаг.
    status: item.status ? { label: item.status, tone: 'neutral' } : undefined,
    fields: [
      { label: f.accountName, value: item.accountName },
      { label: f.accountNumber, value: item.accountNumber },
      { label: f.iban, value: item.iban },
      { label: f.bank, value: item.bankName },
    ],
    details: [
      { label: f.subAccountId, value: item.subAccountId },
      { label: f.code, value: item.walletCode },
      {
        label: f.verifiedAt,
        value: item.verifiedAt ? formatDate(item.verifiedAt) : undefined,
      },
    ],
    columns: COLUMNS,
  }
}
