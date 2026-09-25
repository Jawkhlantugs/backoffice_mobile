/**
 * Tailwind class-аар илэрхийлэгдэхгүй газарт (Animated, navigation theme,
 * StatusBar, lucide дүрсний color) хэрэглэх токенууд. Энэ файл ба
 * `global.css` хоёр **гар аргаар** синк байх ёстой — хоёулаа
 * design-tokens.md-ээс гардаг.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  pill: 999,
} as const

/** Дэлгэцийн хажуугийн зай — design-tokens.md §2 (375 дэлгэц, 343 контент). */
export const screenPadding = spacing.lg

/** Хөдөлгөөний хугацаа — бүх шилжилт нэг хэмнэлтэй байхын тулд. */
export const duration = {
  fast: 120,
  normal: 200,
  slow: 320,
} as const

/**
 * Дүрсний хэмжээ — текстээс томроод давамгайлахгүй байхаар жижигрүүлсэн.
 * Хүрэлтийн бай 44pt хэвээр, зөвхөн зураас нь жижиг.
 */
export const iconSize = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 20,
  xl: 28,
} as const

/** lucide-ийн анхны 2 нь утсан дээр бүдүүн харагддаг. */
export const iconStroke = 1.75

/** Доод таб — design-tokens.md §2. */
export const tabBar = {
  height: 60,
  iconSize: 20,
} as const

export type AppColors = {
  background: string
  foreground: string
  card: string
  elevated: string
  border: string
  borderStrong: string
  primary: string
  primaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  destructive: string
  success: string
  warning: string
  /** Drawer, modal-ийн ард харлах давхарга — зөвхөн RN, CSS токен байхгүй. */
  overlay: string
}

const light: AppColors = {
  background: '#ffffff',
  foreground: '#020618',
  card: '#ffffff',
  elevated: '#ffffff',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  primary: '#0f172b',
  primaryForeground: '#f8fafc',
  muted: '#f1f5f9',
  mutedForeground: '#62748e',
  accent: '#f1f5f9',
  destructive: '#e7000b',
  success: '#12b76a',
  warning: '#f79009',
  overlay: 'rgba(15, 23, 43, 0.35)',
}

const dark: AppColors = {
  background: '#020618',
  foreground: '#f8fafc',
  card: '#020919',
  elevated: '#0f172b',
  border: '#1b1f2f',
  borderStrong: '#334155',
  primary: '#e2e8f0',
  primaryForeground: '#0f172b',
  muted: '#1d293d',
  mutedForeground: '#90a1b9',
  accent: '#1d293d',
  destructive: '#ff6467',
  success: '#32d583',
  warning: '#fdb022',
  overlay: 'rgba(2, 6, 23, 0.65)',
}

export const palette = { light, dark } as const

export type ColorScheme = keyof typeof palette
