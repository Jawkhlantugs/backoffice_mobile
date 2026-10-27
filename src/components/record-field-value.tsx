import { formatAmountField } from '@/core/money/format'
import { cn } from '@/lib/cn'

import { AppText, type AppTextProps } from './app-text'
import type { RecordField } from './record-field'
import { StatusPill, TONE_TEXT } from './status-pill'

/** Талбарын утга — дүн бол тоон фонтоор. Удаан дарж хуулж болно. */
export function RecordFieldValue({
  field,
  className,
  ...rest
}: { field: RecordField } & Omit<AppTextProps, 'children'>) {
  if (field.tone && !field.amount) {
    return <StatusPill label={String(field.value)} tone={field.tone} />
  }
  const text = field.amount
    ? formatAmountField(field.amount)
    : String(field.value)

  return (
    <AppText
      selectable
      numeric={field.amount !== undefined}
      className={cn(className, field.tone && TONE_TEXT[field.tone])}
      {...rest}
    >
      {text}
    </AppText>
  )
}
