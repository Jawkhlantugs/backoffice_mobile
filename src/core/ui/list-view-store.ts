import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

/**
 * Жагсаалт карт эсвэл хүснэгтээр харагдах — бүх жагсаалтад нэг сонголт.
 * Горим нь дискэнд хадгалагдах зөвшөөрөгдсөн UI тохиргоо (§11.4, хувийн
 * мэдээлэл биш); нуусан багана зөвхөн санах ойд.
 */
export type ListViewMode = 'cards' | 'table'

const STORAGE_KEY = 'list-view-mode'
const DEFAULT_MODE: ListViewMode = 'cards'

type ListViewState = {
  mode: ListViewMode
  /** Хүснэгт тус бүрийн нуусан баганын түлхүүр. */
  hidden: Readonly<Record<string, readonly string[]>>
  restore: () => Promise<void>
  setMode: (mode: ListViewMode) => Promise<void>
  toggleColumn: (tableId: string, columnKey: string) => void
  showAllColumns: (tableId: string) => void
}

function isMode(value: string | null): value is ListViewMode {
  return value === 'cards' || value === 'table'
}

export const useListViewStore = create<ListViewState>((set) => ({
  mode: DEFAULT_MODE,
  hidden: {},
  restore: async () => {
    let stored: string | null = null
    try {
      stored = await AsyncStorage.getItem(STORAGE_KEY)
    } catch {
      // Уншигдахгүй бол анхны горимоор — харагдацын тохиргоо л.
    }
    set({ mode: isMode(stored) ? stored : DEFAULT_MODE })
  },
  setMode: async (mode) => {
    set({ mode })
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Хадгалагдаагүй ч энэ session-д сонгосон горим хэвээр.
    }
  },
  toggleColumn: (tableId, columnKey) =>
    set((state) => {
      const current = state.hidden[tableId] ?? []
      const next = current.includes(columnKey)
        ? current.filter((key) => key !== columnKey)
        : [...current, columnKey]
      return { hidden: { ...state.hidden, [tableId]: next } }
    }),
  showAllColumns: (tableId) =>
    set((state) => ({ hidden: { ...state.hidden, [tableId]: [] } })),
}))
