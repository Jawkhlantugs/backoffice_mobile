import { create } from 'zustand'

/**
 * Идэвхтэй баг (Portal · Office · Partner · Futures) — вэбийн баг сонгогчтой
 * ижил үүрэг. Drawer ба Цэс таб хоёр нэг утгыг хардаг.
 *
 * Дискэнд хадгалахгүй: аль багт ажилладаг нь ажилтны тухай мэдээлэл (§11.4).
 */
type TeamState = {
  /** `null` бол хараахан сонгоогүй — цэсэн дэх эхний баг хэрэглэгдэнэ. */
  selected: string | null
  select: (team: string) => void
}

export const useTeamStore = create<TeamState>((set) => ({
  selected: null,
  select: (team) => set({ selected: team }),
}))
