import { useRef, useState } from 'react'
import { KeyboardAvoidingView, View, type ViewProps } from 'react-native'

import { cn } from '@/lib/cn'

/**
 * Keyboard нээгдэхэд доод хэсгээ (товч, reply мөр) дээш гаргана. RN-ийн KAV
 * байрлалаа зөвхөн эцгээсээ хэмждэг тул толгой, safe area-г тооцохгүй —
 * энд цонхон дахь байрлалыг өөрөө хэмжиж offset болгоно.
 */
export function KeyboardAvoider({ className, ...rest }: ViewProps) {
  const ref = useRef<View>(null)
  const [offset, setOffset] = useState(0)

  return (
    <View
      ref={ref}
      className="flex-1"
      pointerEvents="box-none"
      onLayout={() => ref.current?.measureInWindow((_x, y) => setOffset(y))}
    >
      {/* Android-д ч padding: edge-to-edge цонх keyboard-оор агшдаггүй. */}
      <KeyboardAvoidingView
        className={cn('flex-1', className)}
        behavior="padding"
        keyboardVerticalOffset={offset}
        {...rest}
      />
    </View>
  )
}
