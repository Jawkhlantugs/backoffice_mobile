import { create } from 'zustand'

/**
 * Богино мэдэгдэл. Алдааг дэлгэц бүрт гараар байрлуулахын оронд нэг газраас
 * харуулна — ямар ч үйлдлийн хариу нэг ижил байрлалд гарна.
 */
export type ToastTone = 'error' | 'success' | 'info'

export type Toast = {
  /** Дараалсан ижил мессежийг ялгах — шинэ toast бүр дахин анивчина. */
  id: number
  message: string
  tone: ToastTone
}

type ToastState = {
  current: Toast | null
  show: (message: string, tone: ToastTone) => void
  dismiss: () => void
}

let nextId = 0

export const useToastStore = create<ToastState>((set) => ({
  current: null,
  show: (message, tone) => set({ current: { id: ++nextId, message, tone } }),
  dismiss: () => set({ current: null }),
}))

/** React-ээс гадуур (hook, repository) дуудахад. */
export const toast = {
  error: (message: string) => useToastStore.getState().show(message, 'error'),
  success: (message: string) =>
    useToastStore.getState().show(message, 'success'),
  info: (message: string) => useToastStore.getState().show(message, 'info'),
}
