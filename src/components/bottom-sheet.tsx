import { Modal, Pressable, View } from 'react-native'

import { cn } from '@/lib/cn'

import { AppText } from './app-text'
import { GlassSurface } from './glass-surface'

/**
 * Доороос гарах glass хавтан — ConfirmSheet, SelectSheet, macro сонголт
 * бүгд үүн дээр. Ард дарвал хаагдана; контент дээр дарвал үгүй.
 */
export function BottomSheet({
  visible,
  title,
  onClose,
  className,
  children,
}: {
  visible: boolean
  title?: string
  onClose: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="max-h-[80%]"
          onPress={(event) => event.stopPropagation()}
        >
          <GlassSurface
            fallbackClassName="border-t border-border bg-elevated"
            className={cn('shrink gap-4 rounded-t-3xl p-5 pb-8', className)}
          >
            <View className="h-1 w-10 self-center rounded-full bg-border" />
            {title ? <AppText variant="title">{title}</AppText> : null}
            {children}
          </GlassSurface>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
