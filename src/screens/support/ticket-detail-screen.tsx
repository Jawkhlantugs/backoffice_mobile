import { useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppText,
  IconButton,
  Screen,
  StateView,
  TextButton,
} from '@/components'
import type { TicketMacro } from '@/data/support-ticket/ticket-macro-model'
import {
  openingMessage,
  type TicketMessage,
} from '@/data/support-ticket/ticket-conversation-model'
import {
  useSupportTicket,
  useUpdateTicketStatus,
} from '@/hooks/use-support-tickets'
import { useTicketConversation } from '@/hooks/use-ticket-conversation'
import { messages, translateUnknownError } from '@/lib/messages'
import { useAppColors } from '@/theme/use-theme'

import { TicketInfoSheet } from './ticket-info-sheet'
import { TicketMacroSheet } from './ticket-macro-sheet'
import { TicketMessageBubble } from './ticket-message-bubble'
import { TicketStatusSelect } from './ticket-status-select'

/** Доороос энэ зайд байвал шинэ мессеж ирэхэд доош гүйлгэнэ (вэбийн 120px). */
const NEAR_BOTTOM_PX = 120

const connectionLabel = () => ({
  idle: '',
  connecting: messages.supportTickets.reply.connecting,
  connected: messages.supportTickets.reply.connected,
  error: messages.supportTickets.reply.error,
})

export function TicketDetailScreen() {
  const router = useRouter()
  const { colors } = useAppColors()
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const ticketId = id ?? ''

  const query = useSupportTicket(ticketId)
  const updateStatus = useUpdateTicketStatus()
  const conversation = useTicketConversation(ticketId)

  const [draft, setDraft] = useState('')
  const [macroVisible, setMacroVisible] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [infoVisible, setInfoVisible] = useState(false)

  const listRef = useRef<FlatList<TicketMessage>>(null)
  // Хуучин мессеж уншиж байхад шинэ мессеж ирвэл үсрэхгүй — вэбийн адил.
  const nearBottomRef = useRef(true)

  function scrollToLatest(animated: boolean) {
    if (nearBottomRef.current) listRef.current?.scrollToEnd({ animated })
  }

  function trackScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    nearBottomRef.current =
      contentSize.height - contentOffset.y - layoutMeasurement.height <
      NEAR_BOTTOM_PX
  }

  const ticket = query.data
  const messagesList = conversation.messages
  const opening = ticket ? openingMessage(ticket) : null
  const thread = opening ? [opening, ...messagesList] : messagesList

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
    nearBottomRef.current = true
    try {
      await conversation.sendMessage(text, ticket?.customerUid)
      setDraft('')
    } catch (error) {
      setSendError(translateUnknownError(error))
    }
  }

  return (
    <Screen edges={['top', 'bottom']} padded={false}>
      <View className="px-4">
        <AppHeader
          title={ticket?.title || messages.supportTickets.title}
          subtitle={ticket?.requesterLabel}
          leading={{
            icon: 'back',
            label: messages.nav.back,
            onPress: () => router.back(),
          }}
          actions={
            ticket
              ? [
                  {
                    icon: 'info',
                    label: messages.supportTickets.info,
                    onPress: () => setInfoVisible(true),
                  },
                ]
              : []
          }
          right={
            ticket ? (
              <TicketStatusSelect
                status={ticket.status}
                disabled={updateStatus.isPending}
                onChange={(status) =>
                  updateStatus.mutate({ id: ticket.id, status })
                }
              />
            ) : undefined
          }
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        // ⚠️ KAV байрлалаа эцэг View-ээс хэмждэг — `Screen`-ий дээд safe area-г
        // нэмэхгүй бол reply мөр keyboard-ийн ард нуугдана.
        keyboardVerticalOffset={insets.top}
      >
        <StateView
          className="px-4"
          loading={query.isPending}
          error={query.error}
          onRetry={() => query.refetch()}
        >
          {ticket ? (
            <FlatList
              ref={listRef}
              data={thread}
              keyExtractor={(item, index) => item.id || String(index)}
              contentContainerClassName="grow gap-3 px-4 py-4"
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              onScroll={trackScroll}
              scrollEventThrottle={100}
              onContentSizeChange={() => scrollToLatest(true)}
              onLayout={() => scrollToLatest(false)}
              renderItem={({ item }) => (
                <TicketMessageBubble
                  message={item}
                  customerLabel={ticket.requesterLabel}
                />
              )}
              ListFooterComponent={
                ticket.note ? (
                  <AppCard className="mt-1 gap-1">
                    <AppText variant="caption">
                      {messages.supportTickets.internalNote}
                    </AppText>
                    <AppText variant="body">{ticket.note}</AppText>
                  </AppCard>
                ) : null
              }
              ListEmptyComponent={
                conversation.query.isPending ? null : conversation.query
                    .error ? (
                  <View className="items-center gap-2 px-4">
                    <AppText
                      variant="caption"
                      className="text-center text-destructive"
                    >
                      {translateUnknownError(conversation.query.error)}
                    </AppText>
                    <TextButton
                      label={messages.common.retry}
                      onPress={() => void conversation.query.refetch()}
                    />
                  </View>
                ) : (
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
              autoCorrect={false}
              spellCheck={false}
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

      {ticket ? (
        <TicketInfoSheet
          ticket={ticket}
          visible={infoVisible}
          onClose={() => setInfoVisible(false)}
        />
      ) : null}

      <TicketMacroSheet
        visible={macroVisible}
        onSelect={selectMacro}
        onClose={() => setMacroVisible(false)}
      />
    </Screen>
  )
}
