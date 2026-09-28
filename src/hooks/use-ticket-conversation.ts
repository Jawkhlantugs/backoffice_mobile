import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { appendDemoTicketMessage } from '@/core/demo/demo-backend'
import { demoMode } from '@/core/demo/demo-mode'
import { useSessionStore } from '@/core/session/session-store'
import { ticketConversationRepository } from '@/data/support-ticket/ticket-conversation-repository'
import { wrapAsHtmlParagraph } from '@/lib/html'
import { logger } from '@/lib/logger'
import { messages } from '@/lib/messages'
import {
  TICKET_WS_PING_INTERVAL_MS,
  conversationSendMessage,
  fetchTicketWsToken,
  pingMessage,
  ticketWsUrl,
} from '@/services/support/ticket-socket-service'

export type TicketSocketStatus = 'idle' | 'connecting' | 'connected' | 'error'

const REFETCH_DELAY_MS = 800

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
  })

  const socketRef = useRef<WebSocket | null>(null)
  const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [status, setStatus] = useState<TicketSocketStatus>('idle')

  const disconnect = useCallback(() => {
    if (pingTimerRef.current) clearInterval(pingTimerRef.current)
    pingTimerRef.current = null
    socketRef.current?.close()
    socketRef.current = null
    setStatus('idle')
  }, [])

  const connect = useCallback(async () => {
    if (socketRef.current) return
    // Демо горимд WebSocket нээхгүй — илгээлтийг `sendMessage` дуурайна.
    if (demoMode.isActive()) {
      setStatus('connected')
      return
    }

    setStatus('connecting')
    try {
      const token = await fetchTicketWsToken()
      const socket = new WebSocket(ticketWsUrl(token))

      socket.onopen = () => {
        setStatus('connected')
        pingTimerRef.current = setInterval(() => {
          socket.send(pingMessage())
        }, TICKET_WS_PING_INTERVAL_MS)
      }
      socket.onerror = () => setStatus('error')
      socket.onclose = () => {
        if (pingTimerRef.current) clearInterval(pingTimerRef.current)
        pingTimerRef.current = null
        socketRef.current = null
        setStatus('idle')
      }

      socketRef.current = socket
    } catch (error) {
      logger.warn('Ticket WS холболт амжилтгүй', error)
      setStatus('error')
    }
  }, [])

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
      if (socketRef.current?.readyState === WebSocket.OPEN) return

      void connect()
      void queryClient.refetchQueries({ queryKey: conversationKey(ticketId) })
    }

    const subscription = AppState.addEventListener('change', handleAppState)
    return () => {
      cancelled = true
      subscription.remove()
      disconnect()
    }
  }, [ticketId, connect, disconnect, queryClient])

  async function sendMessage(text: string): Promise<void> {
    if (!senderId) throw new Error(messages.supportTickets.reply.sessionMissing)

    if (demoMode.isActive()) {
      appendDemoTicketMessage(ticketId, wrapAsHtmlParagraph(text))
      await queryClient.invalidateQueries({
        queryKey: conversationKey(ticketId),
      })
      return
    }

    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      await connect()
    }
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      throw new Error(messages.supportTickets.reply.notConnected)
    }

    socketRef.current.send(
      conversationSendMessage({
        ticketId,
        message: wrapAsHtmlParagraph(text),
        senderId,
      }),
    )

    await new Promise((resolve) => setTimeout(resolve, REFETCH_DELAY_MS))
    await queryClient.invalidateQueries({ queryKey: conversationKey(ticketId) })
  }

  return { query, status, sendMessage, reconnect: connect }
}
