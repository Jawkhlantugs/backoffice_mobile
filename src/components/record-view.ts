import type { AmountField } from '@/core/money/format'

import type { RecordAction } from './record-actions'
import type { RecordField } from './record-field'
import type { StatusTone } from './status-pill'

/**
 * Жагсаалтын нэг бичлэгийн дэлгэцийн хэлбэр. Нэг `RecordView`-ээс карт
 * (`RecordCard`) ч, хүснэгтийн мөр (`DataTable`) ч зурагдана — дэлгэц
 * бүр зөвхөн `item → RecordView` функц бичнэ.
 */
export type RecordView = {
  title: string
  subtitle?: string
  status?: { label: string; tone: StatusTone }
  amount?: AmountField
  /** Картан дээр харагдах гол талбарууд (4 хүртэл). Хүснэгтэд эхний баганууд. */
  fields?: RecordField[]
  /** Картад зөвхөн дэлгэрэнгүйд; хүснэгтэд дараагийн баганууд. */
  details?: RecordField[]
  actions?: RecordAction[]
  /** Картын дээд хэсэгт харагдах зураг (banner гэх мэт). */
  image?: string
  /** Өгвөл дэлгэрэнгүй хавтангийн оронд үүнийг дуудна — засах дэлгэц рүү. */
  onPress?: () => void
}
