import { View } from 'react-native'

import { AppText } from './app-text'
import { SegmentedControl, type SegmentedOption } from './segmented-control'

/**
 * 2–4 сонголттой талбар (статус, OS, төрөл). Dropdown-оос хурдан — нэг
 * хүрэлтээр сонгоно, бүх сонголт харагдана. Олон сонголтод `SelectField`.
 */
export function ChoiceField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <View className="gap-1.5">
      <AppText variant="label">{label}</AppText>
      <SegmentedControl options={options} value={value} onChange={onChange} />
    </View>
  )
}
