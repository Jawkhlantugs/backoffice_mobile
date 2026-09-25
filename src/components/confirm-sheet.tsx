import { useState } from 'react'
import { View } from 'react-native'

import { messages } from '@/lib/messages'

import { AppButton } from './app-button'
import { AppInput } from './app-input'
import { AppText } from './app-text'
import { BottomSheet } from './bottom-sheet'

export type ConfirmSheetProps = {
  visible: boolean
  title: string
  /** Юу хийх гэж байгаа, хэний, ямар дүн — §1.5. */
  description: string
  /** Буцаах боломжгүй үйлдэлд шалтгаан шаардана. */
  reason?: { label: string; required: boolean; placeholder?: string }
  confirmLabel?: string
  destructive?: boolean
  onConfirm: (reason?: string) => void | Promise<void>
  onCancel: () => void
}

/**
 * Мөнгө хөдөлгөх, эрх өөрчлөх үйлдэл бүрийн өмнө гарах баталгаажуулалт
 * (§1.5). Шалтгаан заавал бол бөглөх хүртэл Батлах товч идэвхгүй.
 */
export function ConfirmSheet({
  visible,
  title,
  description,
  reason,
  confirmLabel = messages.common.confirm,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const [text, setText] = useState('')

  const blocked = reason?.required === true && text.trim().length === 0

  // Хаагдах үед л цэвэрлэнэ — алдаа гарвал бичсэн шалтгаан хэвээр үлдэнэ.
  const [wasVisible, setWasVisible] = useState(visible)
  if (visible !== wasVisible) {
    setWasVisible(visible)
    if (!visible) setText('')
  }

  return (
    <BottomSheet visible={visible} title={title} onClose={onCancel}>
      <AppText variant="body" className="text-muted-foreground">
        {description}
      </AppText>

      {reason ? (
        <AppInput
          label={reason.required ? `${reason.label} *` : reason.label}
          value={text}
          onChangeText={setText}
          placeholder={reason.placeholder}
          multiline
        />
      ) : null}

      <View className="gap-2">
        <AppButton
          label={confirmLabel}
          variant={destructive ? 'destructive' : 'primary'}
          disabled={blocked}
          onPress={() => onConfirm(reason ? text.trim() : undefined)}
        />
        <AppButton
          label={messages.common.cancel}
          variant="ghost"
          onPress={onCancel}
        />
      </View>
    </BottomSheet>
  )
}
