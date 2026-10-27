import { useState } from 'react'
import { Pressable } from 'react-native'

import { AppIcon, SelectSheet, type SelectOption } from '@/components'
import {
  TICKET_STATUSES,
  type TicketStatus,
} from '@/data/support-ticket/support-ticket-model'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

import { TicketStatusPill } from './ticket-status-pill'

const statusOptions = (): SelectOption<TicketStatus>[] =>
  TICKET_STATUSES.map((status) => ({
    value: status,
    label: messages.supportTickets.statuses[status],
  }))

/** Толгой дээрх статус — дарахад dropdown (SelectSheet) нээгдэнэ. */
export function TicketStatusSelect({
  status,
  disabled = false,
  onChange,
}: {
  status: TicketStatus
  disabled?: boolean
  onChange: (status: TicketStatus) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={messages.supportTickets.status}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className="min-h-11 flex-row items-center gap-1 active:opacity-70"
      >
        <TicketStatusPill status={status} className="self-center" />
        <AppIcon name="expand" size={iconSize.sm} tone="muted" />
      </Pressable>

      <SelectSheet
        visible={open}
        title={messages.supportTickets.status}
        options={statusOptions()}
        value={status}
        onSelect={(next) => {
          if (next !== status) onChange(next)
        }}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
