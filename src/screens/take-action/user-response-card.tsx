import { useState } from 'react'
import { Image, Pressable, View } from 'react-native'

import { AppButton, AppCard, AppIcon, AppText, StatusPill } from '@/components'
import type {
  TakeActionSubContent,
  UserTakeAction,
} from '@/data/take-action/take-action-model'
import { useTakeActionImageUrl } from '@/hooks/use-take-actions'
import { formatDate } from '@/lib/date'
import { messages, translateUnknownError } from '@/lib/messages'
import { iconSize } from '@/theme/tokens'

/** Зургийн хариулт эсэхийг тодорхойлно — `fileType` ирсэн бол л зураг. */
function SubContentAnswer({ item }: { item: TakeActionSubContent }) {
  const imageUrl = useTakeActionImageUrl()

  if (!item.fileType || !item.value) {
    return (
      <AppText variant="body" className="text-foreground">
        {item.value || '—'}
      </AppText>
    )
  }

  if (imageUrl.data) {
    return (
      <Image
        source={{ uri: imageUrl.data }}
        className="h-40 w-full rounded-lg"
        resizeMode="cover"
      />
    )
  }

  return (
    <View className="gap-1">
      <AppButton
        label={messages.takeAction.viewImage}
        variant="secondary"
        loading={imageUrl.isPending}
        onPress={async () => {
          await imageUrl.mutateAsync(item.value ?? '')
        }}
      />
      {imageUrl.error ? (
        <AppText variant="tiny" className="text-destructive">
          {translateUnknownError(imageUrl.error)}
        </AppText>
      ) : null}
    </View>
  )
}

export function UserResponseCard({ response }: { response: UserTakeAction }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <AppCard className="gap-3">
      <Pressable
        accessibilityRole="button"
        onPress={() => setExpanded((value) => !value)}
        className="flex-row items-center gap-3"
      >
        <View className="flex-1 gap-0.5">
          <AppText variant="body" numberOfLines={1} className="font-semibold">
            {response.uid}
          </AppText>
          <AppText variant="tiny">{formatDate(response.createdAt)}</AppText>
        </View>

        <StatusPill
          label={messages.takeAction.responseStatuses[response.status]}
          tone={response.status === 'success' ? 'success' : 'warning'}
        />

        <AppIcon
          name={expanded ? 'collapse' : 'expand'}
          size={iconSize.sm}
          tone="muted"
        />
      </Pressable>

      {expanded ? (
        <View className="gap-4 border-t border-border pt-3">
          {response.content.map((block, blockIndex) => (
            <View key={blockIndex} className="gap-3">
              {block.mainTitle ? (
                <AppText variant="label">{block.mainTitle}</AppText>
              ) : null}
              {block.subContent.map((item, itemIndex) => (
                <View key={itemIndex} className="gap-1">
                  <AppText variant="caption">{item.title || item.desc}</AppText>
                  <SubContentAnswer item={item} />
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </AppCard>
  )
}
