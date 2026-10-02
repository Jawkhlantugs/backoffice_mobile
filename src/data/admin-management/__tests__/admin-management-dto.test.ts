import { flattenAdminMenus, toAdminRoleGroup } from '../admin-management-dto'

describe('admin management dto', () => {
  it('цэсний модыг order-оор, эцэг → хүүхэд дарааллаар хавтгайлна', () => {
    const rows = flattenAdminMenus([
      {
        id: 'b',
        name: 'Bank',
        order: 2,
        children: [
          { id: 'b2', name: 'Withdraw', order: 2 },
          { id: 'b1', name: 'Deposit', order: 1 },
        ],
      },
      { id: 'a', name: 'Users', order: 1 },
    ])
    expect(rows.map((row) => [row.id, row.depth, row.parent])).toEqual([
      ['a', 0, undefined],
      ['b', 0, undefined],
      ['b1', 1, 'Bank'],
      ['b2', 1, 'Bank'],
    ])
    expect(rows.find((row) => row.id === 'b')?.childCount).toBe(2)
  })

  it('бүлгийн эрхүүдийг нэрээр нь гаргана', () => {
    expect(
      toAdminRoleGroup({
        id: 'g',
        name: 'Ops',
        permissions: [{ id: '1', name: 'bank.read' }, { id: '2' }],
      }).permissions,
    ).toEqual(['bank.read', '2'])
  })
})
