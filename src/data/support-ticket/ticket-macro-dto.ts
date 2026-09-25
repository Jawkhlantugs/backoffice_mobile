import type { TicketMacro } from './ticket-macro-model'

export type TicketMacroDto = {
  id?: number | string
  name?: string
  description?: string
  value?: string
  is_active?: boolean
}

export function toTicketMacro(dto: TicketMacroDto): TicketMacro {
  return {
    id: String(dto.id ?? ''),
    name: dto.name ?? '',
    description: dto.description,
    value: dto.value ?? '',
    isActive: dto.is_active ?? true,
  }
}
