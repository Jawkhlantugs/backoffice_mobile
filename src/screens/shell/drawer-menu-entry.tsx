import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { AppIcon, AppText } from '@/components'
import type { MenuEntry } from '@/core/navigation/menu-view'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { Collapsible } from './collapsible'
import { ExpandChevron } from './expand-chevron'

/**
 * Drawer-ийн нэг мөр. Дэд цэстэй бол вэбийн sidebar шиг задарна — эцэг мөр
 * өөрөө хуудас биш, зөвхөн бүлэг.
 */
export function DrawerMenuEntry({
  entry,
  activePath,
  onNavigate,
}: {
  entry: MenuEntry
  /** Одоо нээлттэй байгаа route — идэвхтэй мөрийг тодруулна. */
  activePath: string
  onNavigate: (entry: MenuEntry) => void
}) {
  const [open, setOpen] = useState(false)

  if (entry.children.length === 0) {
    return (
      <DrawerRow
        entry={entry}
        activePath={activePath}
        onNavigate={onNavigate}
      />
    )
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        className="h-11 flex-row items-center gap-3 rounded-lg px-3"
      >
        <AppIcon name={entry.icon} size={iconSize.md} />
        <AppText variant="body" numberOfLines={1} className="flex-1">
          {entry.label}
        </AppText>
        <ExpandChevron open={open} />
      </Pressable>

      {/* Дэд мөрүүд зүүн талын нарийн шугамаар эцэгтэйгээ холбогдоно. */}
      <Collapsible open={open}>
        <View className="ml-6 border-l border-border pl-1">
          {entry.children.map((child) => (
            <DrawerRow
              key={child.id}
              entry={child}
              activePath={activePath}
              onNavigate={onNavigate}
              nested
            />
          ))}
        </View>
      </Collapsible>
    </View>
  )
}

function DrawerRow({
  entry,
  activePath,
  onNavigate,
  nested = false,
}: {
  entry: MenuEntry
  activePath: string
  onNavigate: (entry: MenuEntry) => void
  nested?: boolean
}) {
  const available = entry.route !== null
  const active = available && entry.route === activePath

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !available, selected: active }}
      disabled={!available}
      onPress={() => onNavigate(entry)}
      className={cn(
        'h-11 flex-row items-center gap-3 rounded-lg px-3',
        active && 'bg-accent',
      )}
    >
      {/* Идэвхтэйг зүүн ирмэгийн зураасаар — дугуй тодруулга биш. */}
      {active ? (
        <View className="absolute bottom-1 left-0 top-1 w-[3px] rounded-r-full bg-primary" />
      ) : null}

      {nested ? null : <AppIcon name={entry.icon} size={iconSize.md} />}

      <AppText
        variant="body"
        numberOfLines={1}
        className={cn(
          'flex-1',
          active && 'font-semibold text-primary',
          !available && 'text-muted-foreground',
        )}
      >
        {entry.label}
      </AppText>

      {available ? null : (
        <View className="rounded-md bg-muted px-1.5 py-0.5">
          <AppText variant="tiny" className="uppercase">
            {messages.nav.webOnly}
          </AppText>
        </View>
      )}
    </Pressable>
  )
}
