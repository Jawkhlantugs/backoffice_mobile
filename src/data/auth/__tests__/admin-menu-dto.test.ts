import { toMenuTree } from '../admin-menu-dto'

const payload = {
  groups: [
    { id: 'g1', name: 'Санхүү' },
    { id: 'g2', name: 'Дотоод' },
  ],
  menus: [
    {
      id: 'm1',
      name: 'Support',
      groupId: 'g1',
      order: 2,
      children: [
        { id: 'm1a', name: 'Tickets', path: '/portal/support/tickets' },
      ],
    },
    {
      id: 'm2',
      name: 'Чөлөө хүсэлт',
      path: '/office/leave-request',
      team: 'office',
      groupId: 'g2',
      order: 1,
    },
    { id: 'm3', name: 'Dashboard', path: '/', order: 1 },
  ],
}

describe('toMenuTree', () => {
  it('menus ба groups-ыг задална', () => {
    const tree = toMenuTree(payload)

    expect(tree.groups).toHaveLength(2)
    expect(tree.items).toHaveLength(3)
    expect(tree.items.find((item) => item.id === 'm1')?.children).toEqual([
      expect.objectContaining({ path: '/portal/support/tickets' }),
    ])
  })

  it('team заагаагүй мөрийг portal гэж үзнэ — вэбтэй ижил', () => {
    const tree = toMenuTree(payload)
    expect(tree.items.find((item) => item.id === 'm1')?.team).toBe('portal')
    expect(tree.items.find((item) => item.id === 'm2')?.team).toBe('office')
  })

  it('шууд массив хэлбэрийн хариуг ч задална', () => {
    const tree = toMenuTree([{ id: 'x', name: 'Dashboard', path: '/' }])
    expect(tree.items).toHaveLength(1)
    expect(tree.groups).toHaveLength(0)
  })

  it('хариу гэнэт өөр хэлбэртэй ирвэл хоосон цэс буцаана', () => {
    expect(toMenuTree(null).items).toHaveLength(0)
    expect(toMenuTree('эвдэрсэн').items).toHaveLength(0)
  })
})
