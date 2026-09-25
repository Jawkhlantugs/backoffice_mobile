import { ActivityIndicator, Pressable, View } from 'react-native'
import { Image } from 'expo-image'

import { cn } from '@/lib/cn'
import { messages } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

import { AppIcon } from './app-icon'
import { AppText } from './app-text'

/**
 * Зураг сонгох талбар: урьдчилан харах + дарахад солих. Сонгох/upload-ыг
 * дуудагч хийнэ (`onPick`) — компонент зөвхөн төлөв харуулна.
 */
export function ImageField({
  label,
  uri,
  onPick,
  uploading = false,
  error,
}: {
  label: string
  uri?: string
  onPick: () => void
  uploading?: boolean
  error?: string
}) {
  const { colors } = useAppColors()

  return (
    <View className="gap-1.5">
      <AppText variant="label">{label}</AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          uri ? messages.form.replaceImage : messages.form.pickImage
        }
        disabled={uploading}
        onPress={onPick}
        className={cn(
          'aspect-video items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted',
          error ? 'border-destructive' : 'border-border',
        )}
      >
        {uri ? (
          <Image
            source={{ uri }}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <View className="items-center gap-2">
            <AppIcon name="add" size={iconSize.lg} tone="muted" />
            <AppText variant="caption">{messages.form.pickImage}</AppText>
          </View>
        )}
        {uploading ? (
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <ActivityIndicator color={colors.primaryForeground} />
          </View>
        ) : null}
      </Pressable>
      {uri && !uploading ? (
        <AppText variant="caption">{messages.form.tapToReplace}</AppText>
      ) : null}
      {error ? (
        <AppText variant="caption" className="text-destructive">
          {error}
        </AppText>
      ) : null}
    </View>
  )
}
