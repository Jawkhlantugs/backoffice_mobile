import {
  flattenSupportCategories,
  toSupportAgent,
  toSupportMacro,
} from '../support-admin-dto'

describe('support admin dto', () => {
  it('snake_case ба camelCase хоёуланг уншина', () => {
    const snake = toSupportMacro({
      id: 3,
      name: 'Hi',
      value: '<p>Сайн уу</p>',
      is_active: false,
      created_at: '2026-01-01',
      admin_user: { email: 'a@x.mn' },
    })
    expect(snake).toMatchObject({
      id: '3',
      value: 'Сайн уу',
      isActive: false,
      createdBy: 'a@x.mn',
    })
    const camel = toSupportMacro({ ID: 4, isActive: true, createUser: 'u1' })
    expect(camel).toMatchObject({ id: '4', isActive: true, createdBy: 'u1' })
  })

  it('agent-ийн role/team нь холбоотой объектын нэрээс', () => {
    const agent = toSupportAgent({
      id: 'a',
      user: { email: 'agent@x.mn' },
      role: 'r-id',
      supportRole: { name: 'Lead' },
      team: 't-id',
    })
    expect(agent).toMatchObject({
      email: 'agent@x.mn',
      role: 'Lead',
      team: 't-id',
    })
  })

  it('ангиллыг эцэг → дэд дарааллаар задална', () => {
    const rows = flattenSupportCategories([
      {
        id: 1,
        category_name_en: 'Deposit',
        children: [{ id: 2, categoryNameEn: 'Bank', parent_id: '1' }],
      },
      { id: 3, category_name_en: 'KYC' },
    ])
    expect(rows.map((row) => [row.id, row.parent])).toEqual([
      ['1', undefined],
      ['2', 'Deposit'],
      ['3', undefined],
    ])
  })
})
