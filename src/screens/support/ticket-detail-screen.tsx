import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
} from 'react-native'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppText,
  FilterChips,
  IconButton,
  InfoRow,
  Screen,
  StateView,
  TextButton,
  type FilterChip,
} from '@/components'
import type { TicketStatus } from '@/data/support-ticket/support-ticket-model'
import type { TicketMacro } from '@/data/support-ticket/ticket-macro-model'
import {
  useSupportTicket,
  useUpdateTicketStatus,
} from '@/hooks/use-support-tickets'
import { useTicketConversation } from '@/hooks/use-ticket-conversation'
import { formatDate } from '@/lib/date'
import { messages, translateUnknownError } from '@/lib/messages'
import { useAppColors } from '@/theme/use-theme'

import { TicketMacroSheet } from './ticket-macro-sheet'
import { TicketMessageBubble } from './ticket-message-bubble'
import { TicketStatusPill } from './ticket-status-pill'

const statusChips = (): FilterChip<TicketStatus>[] => [
  { value: 'new', label: messages.supportTickets.statuses.new },
  { value: 'open', label: messages.supportTickets.statuses.open },
  { value: 'pending', label: messages.supportTickets.statuses.pending },
  { value: 'solved', label: messages.supportTickets.statuses.solved },
]

const connectionLabel = () => ({
  idle: '',
  connecting: messages.supportTickets.reply.connecting,
  connected: messages.supportTickets.reply.connected,
  error: messages.supportTickets.reply.error,
})

export function TicketDetailScreen() {
  const router = useRouter()
  const { colors } = useAppColors()
  const { id } = useLocalSearchParams<{ id: string }>()
  const ticketId = id ?? ''

  const query = useSupportTicket(ticketId)
  const updateStatus = useUpdateTicketStatus()
  const conversation = useTicketConversation(ticketId)

  const [draft, setDraft] = useState('')
  const [macroVisible, setMacroVisible] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const ticket = query.data
  const messagesList = conversation.query.data?.items ?? []

  function selectMacro(macro: TicketMacro) {
    setDraft((current) =>
      current ? `${current}\n${macro.value}` : macro.value,
    )
    setMacroVisible(false)
  }

  async function handleSend() {
    const text = draft.trim()
    if (!text) return
    setSendError(null)
    try {
      await conversation.sendMessage(text)
      setDraft('')
    } catch (error) {
      setSendError(translateUnknownError(error))
    }
  }

  return (
    <Screen edges={['top', 'bottom']} padded={false}>
      <View className="px-4">
        <AppHeader
          title={messages.supportTickets.title}
          leading={{
            icon: 'back',
            label: messages.nav.back,
            onPress: () => router.back(),
          }}
          right={
            ticket ? <TicketStatusPill status={ticket.status} /> : undefined
          }
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={12}
      >
        <StateView
          className="px-4"
          loading={query.isPending}
          error={query.error}
          onRetry={() => query.refetch()}
        >
          {ticket ? (
            <FlatList
              data={messagesList}
              keyExtractor={(item, index) => item.id || String(index)}
              contentContainerClassName="gap-3 px-4 pb-4"
              renderItem={({ item }) => <TicketMessageBubble message={item} />}
              ListHeaderComponent={
                <View className="gap-4 pb-4">
                  <AppCard className="gap-3">
                    <AppText variant="label">{ticket.title}</AppText>
                    <InfoRow
                      label={messages.supportTickets.requester}
                      value={ticket.requesterLabel}
                    />
                    {ticket.assignee ? (
                      <InfoRow
                        label={messages.supportTickets.assignee}
                        value={ticket.assignee}
                      />
                    ) : null}
                    {ticket.categoryLabel ? (
                      <InfoRow
                        label={messages.supportTickets.category}
                        value={ticket.categoryLabel}
                      />
                    ) : null}
                    {ticket.priority ? (
                      <InfoRow
                        label={messages.supportTickets.priority}
                        value={
                          messages.supportTickets.priorities[ticket.priority]
                        }
                      />
                    ) : null}
                    <InfoRow
                      label={messages.supportTickets.createdAt}
                      value={formatDate(ticket.createdAt)}
                    />
                  </AppCard>

                  <FilterChips
                    chips={statusChips()}
                    value={ticket.status}
                    onChange={(status) =>
                      updateStatus.mutate({ id: ticket.id, status })
                    }
                  />
                </View>
              }
              ListEmptyComponent={
                conversation.query.isPending ? null : (
                  <AppText variant="caption" className="px-4 text-center">
                    {messages.supportTickets.reply.empty}
                  </AppText>
                )
              }
            />
          ) : null}
        </StateView>

        <View className="gap-2 border-t border-border bg-background px-4 pt-2">
          {sendError ? (
            <AppText variant="tiny" className="text-destructive">
              {sendError}
            </AppText>
          ) : connectionLabel()[conversation.status] ? (
            <View className="flex-row items-center justify-between">
              <AppText variant="tiny">
                {connectionLabel()[conversation.status]}
              </AppText>
              {conversation.status === 'error' ? (
                <TextButton
                  label={messages.supportTickets.reply.reconnect}
                  onPress={() => void conversation.reconnect()}
                />
              ) : null}
            </View>
          ) : null}

          <View className="flex-row items-end gap-2 pb-3">
            <IconButton
              icon="chat"
              label={messages.supportTickets.reply.macros}
              onPress={() => setMacroVisible(true)}
            />

            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={messages.supportTickets.reply.placeholder}
              placeholderTextColor={colors.mutedForeground}
              multiline
              className="min-h-11 flex-1 rounded-lg border border-input bg-card px-3 py-2.5 text-body text-foreground"
            />

            <AppButton
              label={messages.supportTickets.reply.send}
              size="md"
              disabled={draft.trim().length === 0}
              onPress={handleSend}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <TicketMacroSheet
        visible={macroVisible}
        onSelect={selectMacro}
        onClose={() => setMacroVisible(false)}
      />
    </Screen>
  )
}
