import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { AppText, Badge } from '@/components'
import type { TeamOption } from '@/hooks/use-admin-menu'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'

import { Collapsible } from './collapsible'
import { ExpandChevron } from './expand-chevron'

/**
 * Вэб админы sidebar-ийн дээд талын баг сонгогч (`team-switcher.tsx`).
 *
 * Дөрвүүлээ **үргэлж** жагсана — эрхгүй баг нуугдахгүй, "Эрх байхгүй" гэж
 * харагдана. Вэб дээр ч ялгаагүй дөрөв харагддаг.
 */
export function TeamSwitcher({
  teams,
  activeTeam,
  onSelect,
}: {
  teams: TeamOption[]
  activeTeam: string
  onSelect: (team: string) => void
}) {
  const [open, setOpen] = useState(false)
  const active = teams.find((team) => team.key === activeTeam)

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={messages.nav.team}
        onPress={() => setOpen(!open)}
        className={cn(
          'h-14 flex-row items-center gap-3 rounded-lg px-2',
          open && 'bg-accent',
        )}
      >
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <AppText variant="body" className="font-bold text-primary-foreground">
            X
          </AppText>
        </View>

        <View className="flex-1">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {active?.name ?? messages.nav.team}
          </AppText>
          <AppText variant="caption" numberOfLines={1}>
            {active?.description ?? messages.nav.teamHint}
          </AppText>
        </View>

        <ExpandChevron open={open} />
      </Pressable>

      <Collapsible open={open}>
        <View className="gap-1 pt-1">
          {teams.map((team) => (
            <TeamRow
              key={team.key}
              team={team}
              active={team.key === activeTeam}
              onPress={() => {
                onSelect(team.key)
                setOpen(false)
              }}
            />
          ))}
        </View>
      </Collapsible>
    </View>
  )
}

function TeamRow({
  team,
  active,
  onPress,
}: {
  team: TeamOption
  active: boolean
  onPress: () => void
}) {
  const available = team.count > 0

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled: !available }}
      disabled={!available}
      onPress={onPress}
      className={cn(
        'h-12 flex-row items-center gap-3 rounded-lg px-2',
        active && 'bg-accent',
      )}
    >
      <View className="h-6 w-6 items-center justify-center rounded-md bg-muted">
        <AppText variant="tiny" className="font-semibold text-foreground">
          {team.name.slice(0, 1)}
        </AppText>
      </View>

      <AppText
        variant="body"
        numberOfLines={1}
        className={cn(
          'flex-1',
          available ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {team.name}
      </AppText>

      {available ? (
        <Badge value={team.count} tone={active ? 'primary' : 'neutral'} />
      ) : (
        <AppText variant="tiny">{messages.nav.teamNoAccess}</AppText>
      )}
    </Pressable>
  )
}
