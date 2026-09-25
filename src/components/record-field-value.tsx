import { formatAmountSafe } from '@/core/money/format'

import { AppText, type AppTextProps } from './app-text'
import type { RecordField } from './record-field'

/** Талбарын утга — дүн бол тоон фонтоор. Удаан дарж хуулж болно. */
export function RecordFieldValue({
  field,
  ...rest
}: { field: RecordField } & Omit<AppTextProps, 'children'>) {
  const text = field.amount
    ? formatAmountSafe(field.amount.raw, field.amount.currency)
    : String(field.value)

  return (
    <AppText selectable numeric={field.amount !== undefined} {...rest}>
      {text}
    </AppText>
  )
}
