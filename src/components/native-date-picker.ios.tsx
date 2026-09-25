import { DatePicker, Host } from '@expo/ui/swift-ui'
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers'

/** iOS: SwiftUI-ийн календарь (graphical) — системийн харагдацтай. */
export function NativeDatePicker({
  value,
  onChange,
}: {
  value: Date
  onChange: (date: Date) => void
}) {
  return (
    <Host matchContents>
      <DatePicker
        selection={value}
        displayedComponents={['date']}
        onDateChange={onChange}
        modifiers={[datePickerStyle('graphical')]}
      />
    </Host>
  )
}
