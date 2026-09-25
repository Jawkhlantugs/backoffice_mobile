import type { AppIconName } from '@/components/app-icon'

/**
 * Вэб админы цэс нь lucide дүрсний нэр (`menu.icon`) буцаадаг. Mobile ч
 * lucide, гэхдээ bundle-д зөвхөн `AppIcon`-д бүртгэсэн дүрс орох тул нэрийг
 * тэр жагсаалт руу буулгана.
 *
 * Зөвхөн **төрөл**-ийг components-оос импортолсон — ажиллах үед хамаарал
 * үүсэхгүй (§2 давхаргын чиглэл).
 */
const BY_LUCIDE: Record<string, AppIconName> = {
  LayoutDashboard: 'dashboard',
  Users: 'users',
  UserCog: 'admin',
  UserRoundCog: 'admin',
  ShieldUser: 'admin',
  ShieldCheck: 'shield',
  ShieldOff: 'block',
  Ban: 'block',
  Trash2: 'block',
  AlertTriangle: 'warning',
  FileText: 'news',
  FileStack: 'transaction',
  Receipt: 'transaction',
  Wallet: 'wallet',
  Landmark: 'bank',
  Send: 'send',
  ArrowRightLeft: 'transfer',
  Coins: 'crypto',
  SlidersHorizontal: 'config',
  MonitorCog: 'monitor',
  History: 'history',
  TrendingUp: 'trading',
  Gift: 'reward',
  Smartphone: 'mobile',
  BellRing: 'push',
  Globe: 'globe',
  Heart: 'support',
  MessagesSquare: 'chat',
  MessageSquare: 'chat',
  Bot: 'chat',
  BookOpenCheck: 'takeAction',
  Calendar: 'leave',
  CalendarDays: 'leave',
  Clock: 'clock',
}

/** Дүрс ирээгүй мөрийг замын эхний хэсгээр нь таана. */
const BY_PATH: readonly (readonly [string, AppIconName])[] = [
  ['/office/leave', 'leave'],
  ['/leave', 'leave'],
  ['/bank', 'bank'],
  ['/crypto', 'crypto'],
  ['/spot', 'trading'],
  ['/futures', 'trading'],
  ['/stake', 'stake'],
  ['/convert', 'convert'],
  ['/buynow', 'crypto'],
  ['/support', 'support'],
  ['/chats', 'chat'],
  ['/user-management', 'users'],
  ['/user-information', 'users'],
  ['/take-action', 'takeAction'],
  ['/compliance', 'compliance'],
  ['/crystalintelligence', 'compliance'],
  ['/internal-transaction', 'transaction'],
  ['/exchange-management', 'transfer'],
  ['/reward', 'reward'],
  ['/additional', 'news'],
  ['/config', 'config'],
  ['/mobile', 'mobile'],
  ['/push', 'push'],
]

export function iconForMenu(
  icon: string | undefined,
  path: string | undefined,
): AppIconName {
  const byName = icon ? BY_LUCIDE[icon] : undefined
  if (byName) return byName

  if (path) {
    const match = BY_PATH.find(([prefix]) => path.startsWith(prefix))
    if (match) return match[1]
  }

  return 'folder'
}
