/** Хариултын загвар (macro). Endpoint `support/marcos/list` — backend-ийн
 * үсгийн алдаа (`marcos`), CLAUDE.md §8-ийн дагуу засахгүй. */
export type TicketMacro = {
  id: string
  name: string
  description?: string
  value: string
  isActive: boolean
}
