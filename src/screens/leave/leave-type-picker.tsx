import { Pressable, View } from 'react-native'

import { AppText } from '@/components'
import {
  LEAVE_TYPES,
  type LeaveType,
} from '@/data/leave-request/leave-request-model'
import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'

/** Дөрвөн төрөл — 2x2 сонголт. Dropdown-оос хурдан, нэг хүрэлтээр сонгоно. */
export function LeaveTypePicker({
  value,
  onChange,
}: {
  value: LeaveType
  onChange: (type: LeaveType) => void
}) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {LEAVE_TYPES.map((type) => {
        const selected = type === value
        return (
          <Pressable
            key={type}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(type)}
            className={cn(
              'h-11 flex-1 basis-[45%] items-center justify-center rounded-lg border',
              selected ? 'border-primary bg-primary' : 'border-border bg-muted',
            )}
          >
            <AppText
              variant="body"
              className={cn(
                'font-medium',
                selected ? 'text-primary-foreground' : 'text-foreground',
              )}
            >
              {messages.leave.types[type]}
            </AppText>
          </Pressable>
        )
      })}
    </View>
  )
}
