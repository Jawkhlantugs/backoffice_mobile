import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { appendDemoTicketMessage } from '@/core/demo/demo-backend'
import { demoMode } from '@/core/demo/demo-mode'
import { useSessionStore } from '@/core/session/session-store'
import { readSocketFrame } from '@/data/support-ticket/ticket-conversation-dto'
import {
  LOCAL_MESSAGE_PREFIX,
  mergeConversation,
  type TicketMessage,
} from '@/data/support-ticket/ticket-conversation-model'
import { ticketConversationRepository } from '@/data/support-ticket/ticket-conversation-repository'
import { wrapAsHtmlParagraphs } from '@/lib/html'
import { logger } from '@/lib/logger'
import { messages } from '@/lib/messages'
import {
  TICKET_WS_OPEN_TIMEOUT_MS,
  TICKET_WS_PING_INTERVAL_MS,
  conversationSendMessage,
  fetchTicketWsToken,
  isPingMessage,
  pingMessage,
  pongMessage,
  ticketWsUrl,
  waitForOpen,
} from '@/services/support/ticket-socket-service'

export type TicketSocketStatus = 'idle' | 'connecting' | 'connected' | 'error'

/** WS frame алдагдсан ч харилцагчийн мессеж хоцрохгүй — нээлттэй үед л. */
const POLL_INTERVAL_MS = 15_000

function conversationKey(ticketId: string) {
  return ['ticket-conversation', ticketId] as const
}

/**
 * Ticket яриа: REST-ээр уншиж (`ticket-conversation-repository`), WS-ээр
 * илгээнэ. RN-ийн WebSocket background-д тасардаг тул AppState идэвхжих
 * бүрт дахин холбогдоно (`use-app-lock.ts`-ийн адил хэв маяг).
 */
export function useTicketConversation(ticketId: string) {
  const queryClient = useQueryClient()
  const senderId = useSessionStore((store) => store.user?.id)

  const query = useQuery({
    queryKey: conversationKey(ticketId),
    queryFn: () =>
      ticketConversationRepository.list({ ticketId, pageSize: 50 }),
    enabled: ticketId.length > 0,
    // Дэлгэц нээх бүрт серверээс — өөр төхөөрөмжөөс бичсэн хариу алдагдахгүй.
    staleTime: 0,
    refetchInterval: POLL_INTERVAL_MS,
  })

  // Вэбийн `liveMessages`: WS-ээр ирсэн болон илгээсэн мессеж.
  const [live, setLive] = useState<TicketMessage[]>([])
  const appendLive = useCallback((incoming: TicketMessage[]) => {
    setLive((current) => [...current, ...incoming])
  }, [])

  const fetched = query.data?.items
  const conversation = useMemo(
    () => mergeConversation(fetched ?? [], live),
    [fetched, live],
  )

  const socketRef = useRef<WebSocket | null>(null)
  const openingRef = useRef<Promise<void> | null>(null)
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [status, setStatus] = useState<TicketSocketStatus>('idle')

  const disconnect = useCallback(() => {
    if (pingTimerRef.current) clearInterval(pingTimerRef.current)
    pingTimerRef.current = null
    socketRef.current?.close()
    socketRef.current = null
    openingRef.current = null
    setStatus('idle')
  }, [])

  const open = useCallback(async () => {
    setStatus('connecting')
    const token = await fetchTicketWsToken()
    const socket = new WebSocket(ticketWsUrl(token))
    socketRef.current = socket

    socket.onopen = () => {
      setStatus('connected')
      pingTimerRef.current = setInterval(() => {
        socket.send(pingMessage())
      }, TICKET_WS_PING_INTERVAL_MS)
    }
    socket.onmessage = (event) => {
      if (isPingMessage(event.data)) {
        socket.send(pongMessage())
        return
      }
      const frame = readSocketFrame(event.data, ticketId)
      if (!frame) return
      if (frame.messages.length > 0) appendLive(frame.messages)
      // Frame-ийн хэлбэр таарахгүй байсан ч серверийн жагсаалт үнэн.
      if (frame.isNewMessage) {
        void queryClient.invalidateQueries({
          queryKey: conversationKey(ticketId),
        })
      }
    }
    socket.onerror = () => setStatus('error')
    socket.onclose = () => {
      // Хуучин socket хаагдахдаа шинээр нээгдсэнийг арилгахгүй.
      if (socketRef.current !== socket) return
      if (pingTimerRef.current) clearInterval(pingTimerRef.current)
      pingTimerRef.current = null
      socketRef.current = null
      setStatus('idle')
    }

    try {
      await waitForOpen(socket, TICKET_WS_OPEN_TIMEOUT_MS)
    } catch (error) {
      if (socketRef.current === socket) socketRef.current = null
      socket.close()
      throw error
    }
  }, [ticketId, appendLive, queryClient])

  /** Нээгдэж буй холболт байвал түүнийг хүлээнэ — давхар socket нээхгүй. */
  const connect = useCallback(async () => {
    // Демо горимд WebSocket нээхгүй — илгээлтийг `sendMessage` дуурайна.
    if (demoMode.isActive()) {
      setStatus('connected')
      return
    }
    if (socketRef.current?.readyState === WebSocket.OPEN) return

    if (!openingRef.current) {
      const opening = open().finally(() => {
        if (openingRef.current === opening) openingRef.current = null
      })
      openingRef.current = opening
    }
    try {
      await openingRef.current
    } catch (error) {
      logger.warn('Ticket WS холболт амжилтгүй', error)
      setStatus('error')
    }
  }, [open])

  useEffect(() => {
    if (ticketId.length === 0) return

    // `connect()` эхний мөрөндөө `setStatus` дуудна — effect-ийн синхрон
    // явцад шууд дуудвал cascading render lint-д баригдана, тиймээс microtask
    // болгож хойшлуулав (тайлбар: React "set-state-in-effect" дүрэм).
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) void connect()
    })

    function handleAppState(next: AppStateStatus) {
      if (next !== 'active') return

      // Background-д байх зуур ирсэн мессежийг socket нээлттэй байсан ч татна.
      void queryClient.refetchQueries({ queryKey: conversationKey(ticketId) })
      if (socketRef.current?.readyState !== WebSocket.OPEN) void connect()
    }

    const subscription = AppState.addEventListener('change', handleAppState)
    return () => {
      cancelled = true
      subscription.remove()
      disconnect()
    }
  }, [ticketId, connect, disconnect, queryClient])

  async function sendMessage(
    text: string,
    customerUid: string | undefined,
  ): Promise<void> {
    if (!senderId) throw new Error(messages.supportTickets.reply.sessionMissing)

    if (demoMode.isActive()) {
      appendDemoTicketMessage(ticketId, wrapAsHtmlParagraphs(text))
      await queryClient.invalidateQueries({
        queryKey: conversationKey(ticketId),
      })
      return
    }

    // Вэб `uid`-гүй мессеж илгээдэггүй — харилцагчид хүрэхгүй.
    if (!customerUid) {
      throw new Error(messages.supportTickets.reply.customerMissing)
    }

    await connect()
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      throw new Error(messages.supportTickets.reply.notConnected)
    }

    const html = wrapAsHtmlParagraphs(text)
    socketRef.current.send(
      conversationSendMessage({
        ticketId,
        message: html,
        senderId,
        uid: customerUid,
      }),
    )

    appendLive([
      {
        id: `${LOCAL_MESSAGE_PREFIX}${Date.now()}`,
        ticketId,
        message: html,
        senderId,
        fromCustomer: false,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  return {
    query,
    messages: conversation,
    status,
    sendMessage,
    reconnect: connect,
  }
}
