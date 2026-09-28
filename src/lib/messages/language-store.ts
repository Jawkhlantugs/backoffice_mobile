import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

/**
 * Хэл нь дискэнд хадгалагдах зөвшөөрөгдсөн цөөн зүйлийн нэг (§11.4).
 * Анхдагч нь англи — вэб админ англи, App Store reviewer ч англиар уншина.
 */
export type Language = 'en' | 'mn'

const STORAGE_KEY = 'language'
export const DEFAULT_LANGUAGE: Language = 'en'

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'mn'
}

type LanguageState = {
  language: Language
  restore: () => Promise<void>
  set: (language: Language) => Promise<void>
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: DEFAULT_LANGUAGE,
  restore: async () => {
    let stored: string | null = null
    try {
      stored = await AsyncStorage.getItem(STORAGE_KEY)
    } catch {
      // Уншигдахгүй бол анхдагч хэлээр явна — апп ажиллахад саад биш.
    }
    set({ language: isLanguage(stored) ? stored : DEFAULT_LANGUAGE })
  },
  set: async (language) => {
    set({ language })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Хадгалагдаагүй ч энэ session-д хэл солигдсон хэвээр.
    }
  },
}))
