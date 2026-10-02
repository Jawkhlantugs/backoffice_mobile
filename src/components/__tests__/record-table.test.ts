import {
  buildRecordTable,
  fitColumns,
  nextSort,
  sortTableRows,
} from '../record-table'
import type { RecordView } from '../record-view'

const LABELS = { title: 'Record', status: 'Status', amount: 'Amount' }

const row = (key: string, view: Partial<RecordView>) => ({
  key,
  view: { title: key, ...view },
})

describe('buildRecordTable', () => {
  it('гарчиг → статус → дүн → fields → details дарааллаар багана гаргана', () => {
    const { columns } = buildRecordTable(
      [
        row('a', {
          status: { label: 'DONE', tone: 'success' },
          amount: { raw: '10', currency: 'USDT' },
          fields: [{ label: 'Side', value: 'BUY' }],
          details: [{ label: 'Txn', value: 'x1' }],
        }),
      ],
      LABELS,
    )
    expect(columns.map((column) => column.label)).toEqual([
      'Record',
      'Status',
      'Amount',
      'Side',
      'Txn',
    ])
    expect(columns[0]?.sticky).toBe(true)
    expect(columns.find((c) => c.label === 'Amount')?.align).toBe('right')
  })

  it('мөр бүрийн талбарыг нэгтгэж, хоосон утгатай нүдийг үүсгэхгүй', () => {
    const { columns, rows } = buildRecordTable(
      [
        row('a', { fields: [{ label: 'Bank', value: '' }] }),
        row('b', { fields: [{ label: 'Note', value: 'hi' }] }),
      ],
      LABELS,
    )
    expect(columns.map((column) => column.label)).toEqual([
      'Record',
      'Bank',
      'Note',
    ])
    expect(rows[0]?.cells['field:Bank']).toBeUndefined()
    expect(rows[1]?.cells['field:Note']).toEqual({ kind: 'text', text: 'hi' })
  })

  it('статус, дүнгүй жагсаалтад тэр баганууд гарахгүй', () => {
    const { columns } = buildRecordTable([row('a', {})], LABELS)
    expect(columns.map((column) => column.key)).toEqual(['title'])
  })
})

describe('sortTableRows', () => {
  const { rows } = buildRecordTable(
    [
      row('a', { amount: { raw: '0.30000001', currency: 'USDT' } }),
      row('b', { amount: { raw: '0.3', currency: 'USDT' } }),
      row('c', {}),
      row('d', { amount: { raw: '12', currency: 'USDT' } }),
    ],
    LABELS,
  )

  it('дүнг number-гүйгээр эрэмбэлж, хоосныг сүүлд тавина', () => {
    const asc = sortTableRows(rows, { key: 'amount', direction: 'asc' })
    expect(asc.map((r) => r.key)).toEqual(['b', 'a', 'd', 'c'])
    const desc = sortTableRows(rows, { key: 'amount', direction: 'desc' })
    expect(desc.map((r) => r.key)).toEqual(['d', 'a', 'b', 'c'])
  })

  it('эрэмбэгүй үед анхны дарааллыг өөрчлөхгүй', () => {
    expect(sortTableRows(rows, null)).toBe(rows)
  })
})

describe('nextSort', () => {
  it('эрэмбэгүй → өсөх → буурах → эрэмбэгүй', () => {
    const first = nextSort(null, 'amount')
    expect(first).toEqual({ key: 'amount', direction: 'asc' })
    const second = nextSort(first, 'amount')
    expect(second).toEqual({ key: 'amount', direction: 'desc' })
    expect(nextSort(second, 'amount')).toBeNull()
    expect(nextSort(second, 'status')).toEqual({
      key: 'status',
      direction: 'asc',
    })
  })
})

describe('fitColumns', () => {
  const columns = [
    { key: 'title', label: 'T', width: 120, align: 'left', sticky: true },
    { key: 'a', label: 'A', width: 100, align: 'left', sticky: false },
    { key: 'b', label: 'B', width: 100, align: 'left', sticky: false },
  ] as const

  it('илүү зайг sticky биш баганад хуваана', () => {
    const fitted = fitColumns(columns, 520)
    expect(fitted.map((column) => column.width)).toEqual([120, 200, 200])
  })

  it('дэлгэцээс өргөн бол өөрчлөхгүй', () => {
    expect(fitColumns(columns, 200).map((c) => c.width)).toEqual([
      120, 100, 100,
    ])
  })
})
