import { DateTimePicker, Host } from '@expo/ui/jetpack-compose'

/** Android: Material 3 календарь. iOS хувилбар нь `.ios.tsx`. */
export function NativeDatePicker({
  value,
  onChange,
}: {
  value: Date
  onChange: (date: Date) => void
}) {
  return (
    <Host matchContents>
      <DateTimePicker
        initialDate={value.toISOString()}
        displayedComponents="date"
        variant="picker"
        onDateSelected={onChange}
      />
    </Host>
  )
}
