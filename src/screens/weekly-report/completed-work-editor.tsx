import { View } from 'react-native'

import { AppButton, AppInput, AppText, IconButton } from '@/components'
import { messages } from '@/lib/messages'

const text = messages.weeklyReports.fields

/**
 * Вэбийн "Completed Work": дугаартай мөр бүр нэг ажил, хогийн саваар хасна,
 * "Мөр нэмэх" / "Даалгавраас" товч. Сүүлийн мөрийг хасахад хоосон мөр үлдэнэ.
 */
export function CompletedWorkEditor({
  items,
  onChange,
  onPickTasks,
  error,
}: {
  items: string[]
  onChange: (items: string[]) => void
  onPickTasks: () => void
  error?: string
}) {
  const update = (index: number, value: string) =>
    onChange(items.map((item, each) => (each === index ? value : item)))
  const remove = (index: number) => {
    const next = items.filter((_, each) => each !== index)
    onChange(next.length > 0 ? next : [''])
  }

  return (
    <View className="gap-3">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start gap-2">
          <View className="h-11 w-7 items-center justify-center">
            <AppText variant="caption" numeric>
              {index + 1}
            </AppText>
          </View>
          <View className="flex-1">
            <AppInput
              value={item}
              onChangeText={(value) => update(index, value)}
              placeholder={text.completedPlaceholder}
              multiline
              className="min-h-11"
            />
          </View>
          <IconButton
            icon="trash"
            label={messages.tasks.delete}
            glass={false}
            tone="muted"
            onPress={() => remove(index)}
          />
        </View>
      ))}
      {error ? (
        <AppText variant="caption" className="text-destructive">
          {error}
        </AppText>
      ) : null}
      <View className="flex-row gap-2">
        <AppButton
          label={text.fromTasks}
          icon="checklist"
          variant="secondary"
          size="md"
          className="flex-1"
          onPress={onPickTasks}
        />
        <AppButton
          label={text.addItem}
          icon="add"
          variant="secondary"
          size="md"
          className="flex-1"
          onPress={() => onChange([...items, ''])}
        />
      </View>
    </View>
  )
}
