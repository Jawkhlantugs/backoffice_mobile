import type { AmountField } from '@/core/money/format'
import { compareDecimal } from '@/lib/compare-decimal'

import { visibleFields } from './record-field'
import type { RecordView } from './record-view'
import type { StatusTone } from './status-pill'

export type TableCell =
  | { kind: 'text'; text: string }
  | { kind: 'amount'; amount: AmountField }
  | { kind: 'status'; label: string; tone: StatusTone }

export type TableColumn = {
  key: string
  label: string
  width: number
  align: 'left' | 'right'
  /** Хэвтээ гүйлгэхэд зүүн талд үлдэх гарчгийн багана. */
  sticky: boolean
}

export type TableRow = {
  key: string
  view: RecordView
  cells: Readonly<Record<string, TableCell>>
}

export type TableSort = { key: string; direction: 'asc' | 'desc' }

const TITLE_COLUMN = 'title'
const STATUS_COLUMN = 'status'
const AMOUNT_COLUMN = 'amount'

/** `caption` (12px) фонтын нэг тэмдэгтийн дундаж өргөн. */
const CHAR_WIDTH = 7
/** Нүдний хоёр талын зай + эрэмбийн дүрс. */
const CELL_CHROME = 40
/** Pill-ийн цэг ба дотоод зай. */
const STATUS_CHROME = 28
const MIN_WIDTH = 80
const MAX_WIDTH = 240
const STICKY_MIN_WIDTH = 112
const STICKY_MAX_WIDTH = 144
/** Өргөнийг тооцоход шалгах мөрийн тоо — бүх хуудсыг гүйхгүй. */
const WIDTH_SAMPLE = 60

const fieldKey = (label: string) => `field:${label}`

function cellText(cell: TableCell | undefined): string {
  if (!cell) return ''
  switch (cell.kind) {
    case 'text':
      return cell.text
    case 'amount':
      return `${cell.amount.raw} ${cell.amount.currency}`
    case 'status':
      return cell.label
  }
}

function toCells(view: RecordView): Record<string, TableCell> {
  const cells: Record<string, TableCell> = {
    [TITLE_COLUMN]: { kind: 'text', text: view.title },
  }
  if (view.status) cells[STATUS_COLUMN] = { kind: 'status', ...view.status }
  if (view.amount)
    cells[AMOUNT_COLUMN] = { kind: 'amount', amount: view.amount }
  for (const field of visibleFields([
    ...(view.fields ?? []),
    ...(view.details ?? []),
  ])) {
    const key = fieldKey(field.label)
    if (key in cells) continue
    cells[key] = field.amount
      ? { kind: 'amount', amount: field.amount }
      : { kind: 'text', text: String(field.value) }
  }
  return cells
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function widthOf(column: Omit<TableColumn, 'width'>, rows: TableRow[]): number {
  const longest = rows
    .slice(0, WIDTH_SAMPLE)
    .reduce(
      (max, row) => Math.max(max, cellText(row.cells[column.key]).length),
      0,
    )
  const chars = Math.max(longest, column.label.length)
  const chrome = column.key === STATUS_COLUMN ? STATUS_CHROME : 0
  const width = chars * CHAR_WIDTH + CELL_CHROME + chrome
  return column.sticky
    ? clamp(width, STICKY_MIN_WIDTH, STICKY_MAX_WIDTH)
    : clamp(width, MIN_WIDTH, MAX_WIDTH)
}

/**
 * Картын өгөгдлөөс хүснэгт гаргана: гарчиг (sticky) → статус → дүн →
 * `fields` → `details`. Багана нь ачаалсан мөрүүдийн талбарын нэгдэл —
 * хоосон талбартай мөрөнд нүд нь зураас болно.
 */
export function buildRecordTable(
  records: readonly { key: string; view: RecordView }[],
  labels: { title: string; status: string; amount: string },
): { columns: TableColumn[]; rows: TableRow[] } {
  const rows: TableRow[] = records.map(({ key, view }) => ({
    key,
    view,
    cells: toCells(view),
  }))

  const order: Omit<TableColumn, 'width'>[] = [
    { key: TITLE_COLUMN, label: labels.title, align: 'left', sticky: true },
  ]
  const seen = new Set<string>([TITLE_COLUMN])
  const add = (key: string, label: string, align: TableColumn['align']) => {
    if (seen.has(key)) return
    seen.add(key)
    order.push({ key, label, align, sticky: false })
  }

  if (records.some(({ view }) => view.status))
    add(STATUS_COLUMN, labels.status, 'left')
  if (records.some(({ view }) => view.amount))
    add(AMOUNT_COLUMN, labels.amount, 'right')
  for (const { view } of records) {
    for (const field of [...(view.fields ?? []), ...(view.details ?? [])]) {
      add(fieldKey(field.label), field.label, field.amount ? 'right' : 'left')
    }
  }

  const columns = order.map((column) => ({
    ...column,
    width: widthOf(column, rows),
  }))
  return { columns, rows }
}

function compareCells(a: TableCell, b: TableCell): number {
  const left = a.kind === 'amount' ? String(a.amount.raw) : cellText(a)
  const right = b.kind === 'amount' ? String(b.amount.raw) : cellText(b)
  return compareDecimal(left, right) ?? left.localeCompare(right)
}

/**
 * Ачаалсан мөрүүдийг баганаар эрэмбэлнэ (вэбийн хүснэгт ч одоогийн
 * хуудсаа л эрэмбэлдэг). Дүнг `number` болгохгүй (§10); хоосон нүд
 * чиглэлээс үл хамааран хамгийн сүүлд.
 */
export function sortTableRows(
  rows: readonly TableRow[],
  sort: TableSort | null,
): readonly TableRow[] {
  if (!sort) return rows
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const left = a.cells[sort.key]
    const right = b.cells[sort.key]
    if (!left || !right) return left ? -1 : right ? 1 : 0
    return sign * compareCells(left, right)
  })
}

/** Толгой дээр дарах бүрд: эрэмбэгүй → өсөх → буурах → эрэмбэгүй. */
export function nextSort(
  current: TableSort | null,
  key: string,
): TableSort | null {
  if (current?.key !== key) return { key, direction: 'asc' }
  return current.direction === 'asc' ? { key, direction: 'desc' } : null
}

/**
 * Дэлгэцээс нарийн хүснэгтийн илүү зайг гарчгийн биш баганууд хооронд
 * өргөнийх нь харьцаагаар хуваана — баруун талд хоосон зурвас үлдэхгүй.
 */
export function fitColumns(
  columns: readonly TableColumn[],
  available: number,
): TableColumn[] {
  const total = columns.reduce((sum, column) => sum + column.width, 0)
  const flexible = columns
    .filter((column) => !column.sticky)
    .reduce((sum, column) => sum + column.width, 0)
  if (available <= total || flexible === 0) return [...columns]
  const extra = available - total
  return columns.map((column) =>
    column.sticky
      ? column
      : {
          ...column,
          width: Math.floor(column.width + (extra * column.width) / flexible),
        },
  )
}
