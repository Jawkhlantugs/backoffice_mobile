import { toMenuTree } from '@/data/auth/admin-menu-dto'

import { buildMenu, countByTeam, hasMenuPath } from '../menu-view'

const payload = {
  groups: [
    { id: 'g1', name: 'General' },
    { id: 'g2', name: 'Office' },
  ],
  menus: [
    {
      id: 'm1',
      name: 'Supports',
      icon: 'Heart',
      groupId: 'g1',
      order: 2,
      children: [
        { id: 'm1a', name: 'Tickets', path: '/support/tickets' },
        { id: 'm1b', name: 'Macros', path: '/support/macros' },
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
    { id: 'm3', name: 'Dashboard', icon: 'LayoutDashboard', path: '/', order: 1 },
  ],
}

const options = { ungroupedTitle: 'Бусад' }

describe('buildMenu', () => {
  it('зөвхөн тухайн багийн цэсийг буцаана', () => {
    const view = buildMenu(toMenuTree(payload), 'office', options)

    expect(view.groups).toHaveLength(1)
    expect(view.groups[0]?.title).toBe('Office')
    expect(view.groups[0]?.entries[0]?.label).toBe('Чөлөө хүсэлт')
  })

  it('бүлэггүй мөрийг сүүлд, өгсөн гарчигтайгаар нэмнэ', () => {
    const view = buildMenu(toMenuTree(payload), 'portal', options)

    expect(view.groups.map((group) => group.title)).toEqual([
      'General',
      'Бусад',
    ])
  })

  it('mobile-д хийгдсэн замд route, бусдад нь null өгнө', () => {
    const office = buildMenu(toMenuTree(payload), 'office', options)
    const portal = buildMenu(toMenuTree(payload), 'portal', options)

    expect(office.groups[0]?.entries[0]?.route).toBe('/leave')
    expect(portal.groups[1]?.entries[0]?.route).toBe('/dashboard')
    // `/portal`-гүй хуучин зам — mobile-д бүртгэлгүй.
    expect(portal.groups[0]?.entries[0]?.children[0]?.route).toBeNull()
  })

  it('дэд мөрийг тоолж, бэлэн байгааг нь тусад нь хэлнэ', () => {
    const portal = buildMenu(toMenuTree(payload), 'portal', options)

    // Tickets, Macros (`/portal`-гүй зам) бэлэн биш, Dashboard бэлэн.
    expect(portal.total).toBe(3)
    expect(portal.ready).toBe(1)

    const office = buildMenu(toMenuTree(payload), 'office', options)
    expect(office).toMatchObject({ total: 1, ready: 1 })
  })

  it('хайлт дэд мөрөнд таарвал эцэг мөр нь хэвээр үлдэнэ', () => {
    const view = buildMenu(toMenuTree(payload), 'portal', {
      ...options,
      query: 'ticket',
    })

    expect(view.groups).toHaveLength(1)
    expect(view.groups[0]?.entries[0]?.label).toBe('Supports')
    expect(view.groups[0]?.entries[0]?.children).toHaveLength(1)
  })

  it('хайлтад юу ч таарахгүй бол бүлэг үлдэхгүй', () => {
    const view = buildMenu(toMenuTree(payload), 'portal', {
      ...options,
      query: 'олдохгүй',
    })

    expect(view.groups).toHaveLength(0)
  })
})

describe('countByTeam', () => {
  it('баг тус бүрийн цэсний тоог гаргана', () => {
    expect(countByTeam(toMenuTree(payload))).toEqual({ portal: 2, office: 1 })
  })

  it('цэсгүй баг огт гарахгүй — сонгогч дээр 0 гэж харагдана', () => {
    expect(countByTeam(toMenuTree(payload)).partner).toBeUndefined()
  })
})

describe('hasMenuPath', () => {
  it('дэд цэс дотор байгаа замыг ч олно', () => {
    const tree = toMenuTree(payload)

    expect(hasMenuPath(tree, '/support/tickets')).toBe(true)
    expect(hasMenuPath(tree, '/office/leave-request')).toBe(true)
    expect(hasMenuPath(tree, '/bank/deposit')).toBe(false)
  })
})
