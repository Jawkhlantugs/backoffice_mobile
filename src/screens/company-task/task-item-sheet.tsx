import { useState } from 'react'
import { View } from 'react-native'

import { AppButton, AppInput, BottomSheet } from '@/components'
import type { TaskItem } from '@/data/company-task/company-task-model'
import { messages } from '@/lib/messages'

const text = messages.tasks

/** Checklist-ийн мөрийг удаан дарахад: нэр солих эсвэл устгах. */
export function TaskItemSheet({
  item,
  onRename,
  onRemove,
  onClose,
}: {
  item: TaskItem | null
  onRename: (item: TaskItem, title: string) => Promise<void>
  onRemove: (item: TaskItem) => Promise<void>
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [shown, setShown] = useState<TaskItem | null>(null)
  if (item !== shown) {
    setShown(item)
    setTitle(item?.title ?? '')
  }

  return (
    <BottomSheet
      visible={item !== null}
      title={text.itemActions}
      onClose={onClose}
    >
      <AppInput
        label={text.rename}
        value={title}
        onChangeText={setTitle}
        autoFocus
      />
      <View className="gap-2">
        <AppButton
          label={messages.form.save}
          icon="check"
          disabled={!title.trim() || title.trim() === item?.title}
          onPress={async () => {
            if (item) await onRename(item, title.trim())
            onClose()
          }}
        />
        <AppButton
          label={text.delete}
          icon="trash"
          variant="destructive"
          onPress={async () => {
            if (item) await onRemove(item)
            onClose()
          }}
        />
      </View>
    </BottomSheet>
  )
}
