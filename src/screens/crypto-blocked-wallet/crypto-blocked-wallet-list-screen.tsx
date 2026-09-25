import { useState } from 'react'
import { useRouter } from 'expo-router'

import { PagedListScreen } from '@/components'
import { useCryptoBlockedWallets } from '@/hooks/use-crypto-blocked-wallets'
import { messages } from '@/lib/messages'

import { CryptoBlockedWalletCard } from './crypto-blocked-wallet-card'

export function CryptoBlockedWalletListScreen() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const list = useCryptoBlockedWallets({ search })

  return (
    <PagedListScreen
      title={messages.finance.cryptoBlockedWallets.title}
      subtitle={messages.finance.cryptoBlockedWallets.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="block"
      emptyLabel={messages.finance.empty}
      headerActions={[
        {
          icon: 'add',
          label: messages.finance.walletBan.newButton,
          onPress: () => router.push('/finance/crypto-blocked-wallets/new'),
        },
      ]}
      search={{
        value: search,
        onChange: setSearch,
        placeholder: messages.finance.searchPlaceholder,
      }}
      renderItem={({ item }) => <CryptoBlockedWalletCard wallet={item} />}
    />
  )
}
