import { FlatList, Pressable } from 'react-native'

import { AppText, BottomSheet, StateView } from '@/components'
import type { TicketMacro } from '@/data/support-ticket/ticket-macro-model'
import { useTicketMacros } from '@/hooks/use-ticket-macros'
import { messages } from '@/lib/messages'

export function TicketMacroSheet({
  visible,
  onSelect,
  onClose,
}: {
  visible: boolean
  onSelect: (macro: TicketMacro) => void
  onClose: () => void
}) {
  const query = useTicketMacros()
  const items = query.data?.items ?? []

  return (
    <BottomSheet
      visible={visible}
      title={messages.supportTickets.reply.macros}
      onClose={onClose}
    >
      <StateView
        loading={query.isPending}
        error={query.error}
        isEmpty={items.length === 0}
        emptyLabel={messages.supportTickets.reply.macrosEmpty}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-1"
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelect(item)}
              className="gap-0.5 rounded-lg px-2 py-3"
            >
              <AppText variant="body" className="font-semibold">
                {item.name}
              </AppText>
              <AppText variant="caption" numberOfLines={2}>
                {item.value}
              </AppText>
            </Pressable>
          )}
        />
      </StateView>
    </BottomSheet>
  )
}
