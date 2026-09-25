import { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { useColorScheme } from 'nativewind'

import {
  AppButton,
  AppCard,
  AppIcon,
  AppLoader,
  AppText,
  Avatar,
  Badge,
  ConfirmSheet,
  EmptyState,
  FilterChips,
  IconChip,
  RecordActions,
  SelectField,
  ListRow,
  Screen,
  SearchInput,
  SectionHeader,
  SegmentedControl,
  Skeleton,
  StatCard,
  StateView,
  StatusPill,
  type StatusTone,
} from '@/components'
import { AppErrors } from '@/core/errors/app-exception'
import { formatMoney } from '@/core/money/format'
import { parseMoney } from '@/core/money/money'
import { formatDate } from '@/lib/date'
import { iconSize } from '@/theme/tokens'

/**
 * Design system gallery. Компонент бүрийг хоёр theme дээр нэг дор харах
 * газар — §5-ийн "хар, цагаан хоёр theme дээр шалгасан" шалгуурыг энд
 * хийнэ.
 */
export default function GalleryScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('one')
  const [chip, setChip] = useState('all')
  const [network, setNetwork] = useState<string>()

  const tones: StatusTone[] = [
    'neutral',
    'success',
    'warning',
    'danger',
    'info',
  ]

  return (
    <Screen padded={false}>
      <ScrollView contentContainerClassName="gap-6 p-4 pb-12">
        <View className="flex-row items-center justify-between">
          <AppText variant="heading">Gallery</AppText>
          <AppButton
            label={colorScheme === 'dark' ? 'Light' : 'Dark'}
            variant="secondary"
            onPress={toggleColorScheme}
          />
        </View>

        <Section title="Typography">
          <AppText variant="display">Display 28</AppText>
          <AppText variant="heading">Heading 22</AppText>
          <AppText variant="title">Title 18</AppText>
          <AppText variant="bodyLarge">Body large 16</AppText>
          <AppText variant="body">Body 14 — үндсэн текст</AppText>
          <AppText variant="caption">Caption 12 — тайлбар</AppText>
          <AppText variant="label">LABEL</AppText>
        </Section>

        <Section title="Товч">
          <AppButton label="Primary" onPress={() => {}} />
          <AppButton label="Secondary" variant="secondary" onPress={() => {}} />
          <AppButton
            label="Destructive"
            variant="destructive"
            onPress={() => {}}
          />
          <AppButton label="Ghost" variant="ghost" onPress={() => {}} />
          <AppButton label="Disabled" disabled onPress={() => {}} />
          <AppButton label="Loading" loading onPress={() => {}} />
          <AppButton
            label="Async (2 сек түгжигдэнэ)"
            onPress={() => new Promise((resolve) => setTimeout(resolve, 2000))}
          />
        </Section>

        <Section title="Статус">
          <View className="flex-row flex-wrap gap-2">
            {tones.map((tone) => (
              <StatusPill key={tone} label={tone} tone={tone} />
            ))}
          </View>
        </Section>

        <Section title="Дүрс">
          <View className="flex-row flex-wrap gap-2">
            <IconChip name="wallet" size="sm" />
            <IconChip name="leave" />
            <IconChip name="checkCircle" size="lg" />
          </View>
          <View className="flex-row flex-wrap items-center gap-4 pt-2">
            <AppIcon name="home" />
            <AppIcon name="modules" tone="muted" />
            <AppIcon name="bank" size={iconSize.sm} />
            <AppIcon name="warning" size={iconSize.lg} />
            <Avatar source="bat.erdene@xmeta.mn" />
            <Badge value={12} tone="danger" />
            <Badge value={3} />
          </View>
        </Section>

        <Section title="Жагсаалтын мөр">
          <AppCard className="p-0">
            <ListRow
              title="Чөлөө хүсэлт"
              subtitle="Office · Дотоод удирдлага"
              icon="leave"
              onPress={() => {}}
            />
            <ListRow
              title="Bank Deposit"
              icon="bank"
              divider
              trailing={<Badge value={4} tone="warning" />}
              onPress={() => {}}
            />
            <ListRow
              title="Crypto Withdrawal"
              icon="crypto"
              divider
              trailing={<AppText variant="tiny">Вэб дээр</AppText>}
            />
          </AppCard>
        </Section>

        <Section title="Тоон хайрцаг">
          <View className="flex-row gap-3">
            <StatCard label="Батлах чөлөө" value={3} icon="leave" />
            <StatCard label="Ачаалж байна" value={0} icon="work" loading />
          </View>
        </Section>

        <Section title="Шүүлтүүр">
          <SearchInput value={search} onChangeText={setSearch} />
          <SegmentedControl
            value={segment}
            onChange={setSegment}
            options={[
              { value: 'one', label: 'Батлах', icon: 'check', count: 3 },
              { value: 'two', label: 'Миний', icon: 'profile' },
            ]}
          />
          <FilterChips
            chips={[
              { value: 'all', label: 'Бүгд' },
              { value: 'pending', label: 'Хүлээгдэж буй' },
              { value: 'done', label: 'Зөвшөөрсөн' },
            ]}
            value={chip}
            onChange={setChip}
          />
          <SectionHeader
            title="Хэсгийн гарчиг"
            action={{ label: 'Бүгдийг', onPress: () => {} }}
          />
        </Section>

        <Section title="Skeleton ба хоосон төлөв">
          <View className="gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </View>
          <AppCard className="p-0">
            <EmptyState
              icon="inbox"
              title="Хүсэлт алга"
              description="Шинэ хүсэлт ирэхэд энд гарч ирнэ"
              action={{ label: 'Шинэчлэх', onPress: () => {} }}
            />
          </AppCard>
        </Section>

        <Section title="Үйлдэл ба сонголт">
          <SelectField
            label="Сүлжээ"
            placeholder="Сонгоно уу"
            options={[
              { value: 'TRX', label: 'TRON (TRC20)' },
              { value: 'ETH', label: 'Ethereum (ERC20)' },
              { value: 'BSC', label: 'BNB Smart Chain', description: 'BEP20' },
            ]}
            value={network}
            onChange={setNetwork}
          />
          <RecordActions
            actions={[
              {
                key: 'retry',
                label: 'Дахин оролдох',
                icon: 'retry',
                confirm: {
                  title: 'Дахин оролдох уу?',
                  description: 'bat@xmeta.mn',
                },
                run: async () => {},
              },
              {
                key: 'refund',
                label: 'Буцаах',
                icon: 'refund',
                destructive: true,
                confirm: {
                  title: 'Буцаах уу?',
                  description: 'bat@xmeta.mn · 120 USDT',
                  reason: { label: 'Шалтгаан', required: true },
                },
                run: async () => {},
              },
            ]}
          />
        </Section>

        <Section title="Мөнгө — bigint minor units">
          <Row
            label="USDT (8 орон, 6 харуулна)"
            value={formatMoney(parseMoney('9.02962042', 'USDT'), {
              withSymbol: true,
            })}
          />
          <Row
            label="MNT"
            value={formatMoney(parseMoney('310557.20', 'MNT'), {
              withSymbol: true,
            })}
          />
          <Row
            label="Том дүн (number алддаг хязгаар)"
            value={formatMoney(parseMoney('123456789.12345678', 'USDT'))}
          />
          <Row label="Огноо" value={formatDate(1700000000)} />
        </Section>

        <Section title="Төлөвүүд">
          <AppCard>
            <StateView loading>{null}</StateView>
          </AppCard>
          <AppCard>
            <StateView isEmpty>{null}</StateView>
          </AppCard>
          <AppCard>
            <StateView
              error={AppErrors.api(500, 'demo', { message: 'Сервер алдаа' })}
              onRetry={() => {}}
            >
              {null}
            </StateView>
          </AppCard>
          <AppCard>
            <AppLoader size="small" />
          </AppCard>
        </Section>

        <Section title="Баталгаажуулалт">
          <AppButton
            label="Шалтгаантай баталгаажуулалт нээх"
            variant="destructive"
            onPress={() => setConfirmOpen(true)}
          />
        </Section>
      </ScrollView>

      <ConfirmSheet
        visible={confirmOpen}
        title="Гүйлгээ татгалзах"
        description="user@example.com — 1,500.00 USDT зарлагыг татгалзах гэж байна. Энэ үйлдлийг буцаах боломжгүй."
        reason={{
          label: 'Татгалзах шалтгаан',
          required: true,
          placeholder: 'Шалтгаанаа бичнэ үү',
        }}
        confirmLabel="Татгалзах"
        destructive
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
      />
    </Screen>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View className="gap-3">
      <AppText variant="label">{title.toUpperCase()}</AppText>
      <View className="gap-2">{children}</View>
    </View>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between gap-4">
      <AppText variant="caption" className="flex-1">
        {label}
      </AppText>
      <AppText variant="body" numeric className="font-medium">
        {value}
      </AppText>
    </View>
  )
}
