import type { StatusTone } from '@/components'
import type {
  TaskPriority,
  TaskStatus,
} from '@/data/company-task/company-task-model'

/** Вэбийн `KANBAN_COLUMNS` өнгөний утга — pill-ийн tone болгосон. */
export const STATUS_TONE: Record<TaskStatus, StatusTone> = {
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
}

export const PRIORITY_TONE: Record<TaskPriority, StatusTone> = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'neutral',
}
