import {
  Archive,
  ArchiveRestore,
  ArrowRightLeft,
  ArrowUpRight,
  Ban,
  BadgeCheck,
  Bell,
  BellRing,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChartPie,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleUser,
  CircleX,
  Clock,
  Coins,
  Ellipsis,
  FileText,
  Gift,
  Globe,
  Heart,
  History,
  House,
  Inbox,
  Info,
  KeyRound,
  Landmark,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  ListFilter,
  Lock,
  LockOpen,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  MonitorCog,
  Moon,
  Paperclip,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCw,
  Repeat,
  RotateCcw,
  ScanFace,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Square,
  SquareCheckBig,
  Smartphone,
  Sun,
  SunMoon,
  Ticket,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Undo2,
  UserCog,
  Users,
  Wallet,
  WifiOff,
  X,
  type LucideIcon,
} from 'lucide-react-native'

import { iconSize, iconStroke, type AppColors } from '@/theme/tokens'
import { useAppColors } from '@/theme/use-theme'

/**
 * Дүрсний ганц эх сурвалж — lucide, вэб админтай ижил сан. Дуудагч нь
 * lucide-ийн нэрийг мэдэхгүй: `<AppIcon name="leave" />`. Бүх санг биш,
 * энд нэрлэсэн дүрсийг л импортолж bundle-ыг жижиг байлгана.
 */
const ICONS = {
  menu: Menu,
  close: X,
  back: ChevronLeft,
  forward: ChevronRight,
  expand: ChevronDown,
  collapse: ChevronUp,
  search: Search,
  refresh: RefreshCw,
  add: Plus,
  check: Check,
  checkCircle: CircleCheck,
  cancel: CircleX,
  warning: TriangleAlert,
  info: Info,
  filter: ListFilter,
  more: Ellipsis,
  external: ArrowUpRight,
  signOut: LogOut,
  settings: Settings,
  themeDark: Moon,
  themeLight: Sun,
  themeAuto: SunMoon,
  lock: Lock,
  unlock: LockOpen,
  key: KeyRound,
  biometric: ScanFace,
  bell: Bell,
  clock: Clock,
  offline: WifiOff,
  retry: RotateCcw,
  refund: Undo2,
  edit: Pencil,
  trash: Trash2,
  archive: Archive,
  unarchive: ArchiveRestore,
  checkbox: Square,
  checkboxChecked: SquareCheckBig,
  attachment: Paperclip,
  comment: MessageCircle,
  checklist: ListChecks,

  home: House,
  modules: LayoutGrid,
  work: BriefcaseBusiness,
  profile: CircleUser,

  dashboard: LayoutDashboard,
  users: Users,
  admin: UserCog,
  kyc: BadgeCheck,
  shield: ShieldCheck,
  wallet: Wallet,
  bank: Landmark,
  transfer: ArrowRightLeft,
  transaction: ReceiptText,
  convert: Repeat,
  crypto: Coins,
  trading: TrendingUp,
  stake: ChartPie,
  reward: Gift,
  news: FileText,
  mobile: Smartphone,
  push: BellRing,
  support: Heart,
  ticket: Ticket,
  chat: MessageSquare,
  compliance: ShieldAlert,
  monitor: MonitorCog,
  config: SlidersHorizontal,
  globe: Globe,
  history: History,
  block: Ban,
  send: Send,
  leave: CalendarDays,
  takeAction: BookOpenCheck,
  inbox: Inbox,
  folder: Layers,
} satisfies Record<string, LucideIcon>

export type AppIconName = keyof typeof ICONS

/**
 * Дүрс үргэлж өнгөгүй — цагаан (`default`), саарал (`muted`), эсвэл
 * primary товч дээр (`inverse`). Статусын өнгө дүрсэнд биш, pill/текстэд.
 */
export type IconTone = 'default' | 'muted' | 'inverse'

export type AppIconProps = {
  name: AppIconName
  size?: number
  tone?: IconTone
}

function toneColors(colors: AppColors): Record<IconTone, string> {
  return {
    default: colors.foreground,
    muted: colors.mutedForeground,
    inverse: colors.primaryForeground,
  }
}

export function AppIcon({
  name,
  size = iconSize.md,
  tone = 'default',
}: AppIconProps) {
  const { colors } = useAppColors()
  const Glyph = ICONS[name]

  return (
    <Glyph
      size={size}
      color={toneColors(colors)[tone]}
      strokeWidth={iconStroke}
    />
  )
}
