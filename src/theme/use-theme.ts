import { useColorScheme } from 'nativewind'

import { palette, type AppColors, type ColorScheme } from './tokens'

/**
 * Tailwind class бичиж болохгүй газарт (navigation theme, StatusBar,
 * ActivityIndicator өнгө) идэвхтэй schemes-ийн түүхий утгыг өгнө.
 */
export function useAppColors(): { scheme: ColorScheme; colors: AppColors } {
  const { colorScheme } = useColorScheme()
  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light'
  return { scheme, colors: palette[scheme] }
}
