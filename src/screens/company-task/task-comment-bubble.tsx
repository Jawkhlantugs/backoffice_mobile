import { Pressable, View } from 'react-native'

import { AppIcon, AppText, Avatar } from '@/components'
import type { TaskComment } from '@/data/company-task/company-task-model'
import { formatDate } from '@/lib/date'
import { iconSize } from '@/theme/tokens'

/** Сэтгэгдэл — зохиогч, огноо, текст, хавсралт (дарж нээнэ). Удаан дарахад устгах. */
export function TaskCommentBubble({
  comment,
  onOpenAttachment,
  onLongPress,
}: {
  comment: TaskComment
  onOpenAttachment: (attachmentId: string) => void
  onLongPress?: () => void
}) {
  const author = comment.author?.email ?? comment.authorId

  return (
    <Pressable onLongPress={onLongPress} className="flex-row gap-3">
      <Avatar source={author} size="sm" />
      <View className="flex-1 gap-1 rounded-xl bg-muted p-3">
        <View className="flex-row items-center justify-between gap-2">
          <AppText
            variant="caption"
            numberOfLines={1}
            className="flex-1 font-semibold text-foreground"
          >
            {author}
          </AppText>
          <AppText variant="tiny">
            {formatDate(comment.createdAt, 'MM/DD HH:mm')}
          </AppText>
        </View>
        {comment.content ? (
          <AppText variant="body" selectable>
            {comment.content}
          </AppText>
        ) : null}
        {comment.attachments.map((file) => (
          <Pressable
            key={file.id}
            accessibilityRole="link"
            onPress={() => onOpenAttachment(file.id)}
            className="min-h-9 flex-row items-center gap-2 rounded-lg border border-border px-2 py-1.5"
          >
            <AppIcon name="attachment" size={iconSize.sm} tone="muted" />
            <AppText
              variant="caption"
              numberOfLines={1}
              className="flex-1 text-foreground"
            >
              {file.fileName}
            </AppText>
          </Pressable>
        ))}
      </View>
    </Pressable>
  )
}
