import type { AdminMenuTree } from '@/data/auth/admin-menu-dto'

import { menuRouteEntries } from './menu-items'
import { hasMenuPath } from './menu-view'

/** Нүүр, Цэс, Профайл — цэсний эрхээс үл хамааран бүх админд. */
const PUBLIC_ROUTES = new Set(['/', '/menu', '/profile', '/+not-found'])

/** `_sitemap` нь expo-router-ийн бүх route-ийн жагсаалт — production-д ч үүсдэг. */
const DEV_ONLY_ROUTES = new Set(['/gallery', '/_sitemap'])

/** `finance/bank-deposits/index` → `/finance/bank-deposits`, `(drawer)` → `/`. */
export function routePathFromName(routeName: string): string {
  const segments = routeName
    .split('/')
    .filter((segment) => segment.length > 0)
    .filter((segment) => !/^\(.*\)$/.test(segment))
    .filter((segment) => segment !== 'index')

  return `/${segments.join('/')}`
}

function covers(route: string, path: string): boolean {
  return path === route || path.startsWith(`${route}/`)
}

/**
 * Тухайн замыг нээх эрх өгдөг цэсний замууд. Хамгийн урт таарсан route
 * ялна: `/futures/users` нь `/futures`-ийн биш, өөрийн цэсний эрхийг шаардана.
 */
export function grantingMenuPaths(path: string): string[] {
  let best: string | null = null
  let grants: string[] = []

  for (const [menuPath, route] of menuRouteEntries()) {
    if (typeof route !== 'string' || !covers(route, path)) continue

    if (best === null || route.length > best.length) {
      best = route
      grants = [menuPath]
    } else if (route === best) {
      grants.push(menuPath)
    }
  }

  return grants
}

/**
 * Цэсэнд байхгүй route-ийг нээхгүй — deep link-ээр орж ирсэн ч. Зураглалд
 * байхгүй шинэ route ч анхдагчаар хаалттай.
 */
export function canOpenRoute(
  tree: AdminMenuTree,
  routeName: string,
  options: { allowDevRoutes: boolean },
): boolean {
  const path = routePathFromName(routeName)

  if (PUBLIC_ROUTES.has(path)) return true
  if (DEV_ONLY_ROUTES.has(path)) return options.allowDevRoutes

  return grantingMenuPaths(path).some((menuPath) =>
    hasMenuPath(tree, menuPath),
  )
}
