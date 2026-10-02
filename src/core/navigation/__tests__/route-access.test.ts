import requireContext from 'expo-router/build/testing-library/require-context-ponyfill'

import { env } from '@/core/config/env'
import { toMenuTree } from '@/data/auth/admin-menu-dto'

import { menuRouteEntries } from '../menu-items'
import {
  canOpenRoute,
  grantingMenuPaths,
  routePathFromName,
} from '../route-access'

/** `src/app`-ийн route бүрийн expo-router нэр (`leave/[id]`, `(drawer)/(tabs)/index`). */
function appRouteNames(): string[] {
  return requireContext('src/app', true, /\.tsx$/)
    .keys()
    .map((file) => file.replace(/^\.\//, '').replace(/\.tsx$/, ''))
    .filter((name) => !name.endsWith('_layout'))
}

const menu = (...paths: string[]) =>
  toMenuTree({
    groups: [],
    menus: paths.map((menuPath, index) => ({
      id: `m${index}`,
      name: menuPath,
      path: menuPath,
    })),
  })

const prod = { allowDevRoutes: false }

describe('routePathFromName', () => {
  it('group, index хэсгийг хасна', () => {
    expect(routePathFromName('finance/bank-deposits/index')).toBe(
      '/finance/bank-deposits',
    )
    expect(routePathFromName('(drawer)')).toBe('/')
    expect(routePathFromName('(drawer)/(tabs)/leave')).toBe('/leave')
    expect(routePathFromName('leave/[id]')).toBe('/leave/[id]')
  })
})

describe('grantingMenuPaths', () => {
  it('хамгийн урт таарсан route-ийн цэсийг өгнө', () => {
    expect(grantingMenuPaths('/futures/users')).toEqual(['/futures/users'])
    expect(grantingMenuPaths('/futures')).toEqual(['/futures/master-risk'])
    expect(grantingMenuPaths('/take-action/responses')).toEqual([
      '/portal/take-action/user-take-action-list',
    ])
  })

  it('дэд route эх route-ийнхоо эрхийг өвлөнө', () => {
    expect(grantingMenuPaths('/leave/[id]')).toEqual(['/office/leave-request'])
    expect(grantingMenuPaths('/users/[id]')).toEqual([
      '/portal/user-information',
    ])
  })

  it('нэг дэлгэцэд хоёр цэс эрх өгч болно', () => {
    expect(grantingMenuPaths('/transfer').sort()).toEqual([
      '/portal/exchange-management/mnt-transfer',
      '/portal/exchange-management/sub-transfer',
    ])
  })

  it('`/support` нь `/support-admin`-д эрх өгөхгүй', () => {
    expect(grantingMenuPaths('/support-admin/macros')).toEqual([
      '/portal/support/macros',
    ])
  })
})

describe('canOpenRoute', () => {
  it('цэсэнд байгаа замыг л нээнэ', () => {
    const tree = menu('/portal/bank/deposit')

    expect(canOpenRoute(tree, 'finance/bank-deposits/index', prod)).toBe(true)
    expect(canOpenRoute(tree, 'finance/bank-withdrawals/index', prod)).toBe(
      false,
    )
    expect(canOpenRoute(tree, 'transfer/index', prod)).toBe(false)
  })

  it('Нүүр, Цэс, Профайл цэсгүй админд ч нээгдэнэ', () => {
    const empty = menu()

    expect(canOpenRoute(empty, '(drawer)', prod)).toBe(true)
    expect(canOpenRoute(empty, 'index', prod)).toBe(true)
    expect(canOpenRoute(empty, 'menu', prod)).toBe(true)
    expect(canOpenRoute(empty, 'profile', prod)).toBe(true)
  })

  it('Ажил таб чөлөөний цэсгүй бол хаалттай', () => {
    expect(canOpenRoute(menu(), 'leave', prod)).toBe(false)
    expect(canOpenRoute(menu('/office/leave-request'), 'leave', prod)).toBe(
      true,
    )
  })

  it('gallery, sitemap зөвхөн хөгжүүлэлтэд', () => {
    expect(canOpenRoute(menu(), 'gallery', prod)).toBe(false)
    expect(canOpenRoute(menu(), '_sitemap', prod)).toBe(false)
    expect(canOpenRoute(menu(), 'gallery', { allowDevRoutes: true })).toBe(
      true,
    )
  })

  it('зураглалд байхгүй route анхдагчаар хаалттай', () => {
    expect(canOpenRoute(menu('/'), 'secret/index', prod)).toBe(false)
  })

  it('partner host тохируулаагүй бол partner дэлгэц хаалттай', () => {
    const tree = menu('/partner/partners')

    expect(canOpenRoute(tree, 'partner/index', prod)).toBe(false)
  })
})

describe('src/app route бүр', () => {
  const dev = { allowDevRoutes: true }

  beforeEach(() => {
    jest
      .spyOn(env, 'partnerApiUrl', 'get')
      .mockReturnValue('https://partner.example.com')
  })
  afterEach(() => jest.restoreAllMocks())

  it('цэсний зураглалтай — шинэ route-ийг MOBILE_ROUTES-д нэмээгүй бол унана', () => {
    const everyMenu = menu(...menuRouteEntries().map(([menuPath]) => menuPath))

    const unreachable = appRouteNames().filter(
      (name) => !canOpenRoute(everyMenu, name, dev),
    )

    expect(unreachable).toEqual([])
  })

  it('цэсгүй админд зөвхөн Нүүр, Цэс, Профайл нээгдэнэ', () => {
    const open = appRouteNames().filter((name) =>
      canOpenRoute(menu(), name, prod),
    )

    expect(open.sort()).toEqual([
      '(drawer)/(tabs)/index',
      '(drawer)/(tabs)/menu',
      '(drawer)/(tabs)/profile',
    ])
  })
})
