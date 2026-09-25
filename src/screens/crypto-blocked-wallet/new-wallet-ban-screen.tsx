import { useState } from 'react'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'

import {
  AppButton,
  AppHeader,
  AppInput,
  ConfirmSheet,
  Screen,
  SelectField,
} from '@/components'
import { matchesAddressRule } from '@/data/crypto-coin/crypto-coin-model'
import { useBanWallet } from '@/hooks/use-crypto-blocked-wallets'
import { useCryptoCoins } from '@/hooks/use-crypto-coins'
import { messages } from '@/lib/messages'

type Field = 'coin' | 'network' | 'address' | 'reason'
type FormErrors = Partial<Record<Field, string>>

const text = messages.finance.walletBan

export function NewWalletBanScreen() {
  const router = useRouter()
  const coinsQuery = useCryptoCoins()
  const ban = useBanWallet()

  const [coin, setCoin] = useState<string>()
  const [network, setNetwork] = useState<string>()
  const [address, setAddress] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [confirming, setConfirming] = useState(false)

  const coins = coinsQuery.data ?? []
  const selectedCoin = coins.find((item) => item.coin === coin)
  const networks = selectedCoin?.networks ?? []
  const selectedNetwork = networks.find((item) => item.network === network)

  function handleSubmit() {
    const found: FormErrors = {}
    if (!coin) found.coin = text.required
    if (!network) found.network = text.required
    if (!address.trim()) found.address = text.required
    else if (!matchesAddressRule(selectedNetwork, address.trim())) {
      found.address = text.invalidAddress
    }
    if (!reason.trim()) found.reason = text.required

    setErrors(found)
    if (Object.keys(found).length === 0) setConfirming(true)
  }

  return (
    <Screen>
      <AppHeader
        title={text.newButton}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />

      <ScrollView
        contentContainerClassName="gap-4 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <SelectField
          label={text.coin}
          placeholder={text.coinPlaceholder}
          options={coins.map((item) => ({
            value: item.coin,
            label: item.coin,
            description: item.name,
          }))}
          value={coin}
          onChange={(value) => {
            setCoin(value)
            // Сүлжээ нь coin-оос хамаарна — вэб ч мөн адил цэвэрлэдэг.
            setNetwork(undefined)
          }}
          error={errors.coin}
          loading={coinsQuery.isPending}
          loadError={coinsQuery.error}
          onRetry={() => coinsQuery.refetch()}
        />

        <SelectField
          label={text.network}
          placeholder={
            selectedCoin ? messages.common.select : text.networkPlaceholder
          }
          options={networks.map((item) => ({
            value: item.network,
            label: item.network,
            description: item.name,
          }))}
          value={network}
          onChange={setNetwork}
          error={errors.network}
          disabled={networks.length === 0}
        />

        <AppInput
          label={text.address}
          placeholder={text.addressPlaceholder}
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.address}
        />

        <AppInput
          label={text.reason}
          placeholder={text.reasonPlaceholder}
          value={reason}
          onChangeText={setReason}
          multiline
          error={errors.reason}
        />

        <View className="pt-2">
          <AppButton
            label={text.submit}
            icon="block"
            variant="destructive"
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={confirming}
        title={text.confirmTitle}
        description={`${coin} · ${network}\n${address.trim()}\n${reason.trim()}`}
        confirmLabel={text.submit}
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={async () => {
          if (!coin || !network) return
          await ban.mutateAsync({
            coin,
            network,
            address: address.trim(),
            reason: reason.trim(),
          })
          setConfirming(false)
          router.back()
        }}
      />
    </Screen>
  )
}
