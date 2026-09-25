import { useState } from 'react'
import { View } from 'react-native'

import { toast } from '@/core/ui/toast-store'
import { messages } from '@/lib/messages'

import { AppButton } from './app-button'
import type { AppIconName } from './app-icon'
import { ConfirmSheet, type ConfirmSheetProps } from './confirm-sheet'

export type RecordAction = {
  key: string
  label: string
  icon?: AppIconName
  /** Мөнгө буцаах, хориг тавих гэх мэт — Батлах товч улаан болно. */
  destructive?: boolean
  /** Статусаас шалтгаалж харагдахгүй байх үед. */
  hidden?: boolean
  confirm: Pick<
    ConfirmSheetProps,
    'title' | 'description' | 'reason' | 'confirmLabel'
  >
  /** `reason` өгсөн бол бөглөсөн текст ирнэ. */
  run: (reason?: string) => Promise<unknown>
}

/**
 * Бичлэг дээрх үйлдлийн товчнууд + нэг ConfirmSheet. Үйлдэл бүр заавал
 * баталгаажуулалттай (§1.5). Алдаа гарвал (toast нь MutationCache-аас) sheet
 * нээлттэй үлдэж, бичсэн шалтгаан арилахгүй — шууд дахин оролдоно.
 */
export function RecordActions({ actions }: { actions: RecordAction[] }) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const visible = actions.filter((action) => !action.hidden)
  if (visible.length === 0) return null

  const active = visible.find((action) => action.key === activeKey)

  return (
    <>
      <View className="flex-row flex-wrap gap-2">
        {visible.map((action) => (
          <AppButton
            key={action.key}
            label={action.label}
            icon={action.icon}
            variant="secondary"
            size="md"
            className="min-w-[45%] flex-1"
            onPress={() => setActiveKey(action.key)}
          />
        ))}
      </View>

      <ConfirmSheet
        visible={active !== undefined}
        title={active?.confirm.title ?? ''}
        description={active?.confirm.description ?? ''}
        reason={active?.confirm.reason}
        confirmLabel={active?.confirm.confirmLabel ?? active?.label}
        destructive={active?.destructive}
        onCancel={() => setActiveKey(null)}
        onConfirm={async (reason) => {
          if (!active) return
          await active.run(reason)
          toast.success(messages.common.done)
          setActiveKey(null)
        }}
      />
    </>
  )
}
