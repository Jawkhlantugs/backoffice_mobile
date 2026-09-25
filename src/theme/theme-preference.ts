import AsyncStorage from '@react-native-async-storage/async-storage'
import { colorScheme } from 'nativewind'
import { create } from 'zustand'

/**
 * Theme нь дискэнд хадгалагдах зөвшөөрөгдсөн цөөн зүйлийн нэг (§1.4) —
 * хувийн мэдээлэл биш.
 *
 * Анхны утга **dark**: админууд ихэвчлэн шөнийн ээлжинд, бага гэрэлтэй
 * өрөөнд ажилладаг бөгөөд вэб админ ч харанхуйгаар тохируулагдсан байдаг.
 */
export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'
const DEFAULT: ThemePreference = 'dark'

function apply(preference: ThemePreference) {
  colorScheme.set(preference)
}

type ThemeState = {
  preference: ThemePreference
  /** Апп асахад дискнээс уншиж хэрэглэнэ. */
  restore: () => Promise<void>
  set: (preference: ThemePreference) => Promise<void>
}

function isPreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export const useThemeStore = create<ThemeState>((set) => ({
  preference: DEFAULT,
  restore: async () => {
    let stored: string | null = null
    try {
      stored = await AsyncStorage.getItem(STORAGE_KEY)
    } catch {
      // Хадгалалт уншигдахгүй бол анхны утгаараа явна — theme нь апп
      // ажиллахад саад болох зүйл биш.
    }

    const preference = isPreference(stored) ? stored : DEFAULT
    apply(preference)
    set({ preference })
  },
  set: async (preference) => {
    apply(preference)
    set({ preference })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, preference)
    } catch {
      // Хадгалагдаагүй ч энэ session-д theme солигдсон хэвээр.
    }
  },
}))
