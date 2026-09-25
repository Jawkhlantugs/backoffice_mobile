/** `company-task.types.ts` — вэбтэй ижил утгууд. */
export const TASK_STATUSES = [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
] as const
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]
export type TaskPriority = (typeof TASK_PRIORITIES)[number]
/** `mine` нь таб биш — weekly report-ын "Даалгавраас" сонгоход (вэбтэй ижил). */
export type TaskScope = 'assigned_to_me' | 'created_by_me' | 'mine' | 'all'

export type TaskPerson = { id: string; email: string; department?: string }

export type TaskItem = {
  id: string
  title: string
  isDone: boolean
  dueDate?: string
  assignee?: TaskPerson
  estimatedHours?: number
  position: number
}

export type TaskAttachment = {
  id: string
  fileName: string
  contentType: string
  fileSize: number
}

export type TaskComment = {
  id: string
  author?: TaskPerson
  authorId: string
  content: string
  attachments: TaskAttachment[]
  createdAt: string
}

export type CompanyTask = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  position: number
  assignees: TaskPerson[]
  createdBy?: TaskPerson
  createdById: string
  dueDate?: string
  rejectReason?: string
  isArchived: boolean
  items: TaskItem[]
  comments: TaskComment[]
  createdAt: string
  updatedAt: string
}

/** Нэмэх/засах форм — вэбийн `saveMutation`-ы payload. */
export type TaskInput = {
  title: string
  description: string
  priority: TaskPriority
  assigneeIds: string[]
  /** `YYYY-MM-DD` эсвэл `null`. */
  dueDate: string | null
}

export const EMPTY_TASK: TaskInput = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  assigneeIds: [],
  dueDate: null,
}

export function taskToInput(task: CompanyTask): TaskInput {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    assigneeIds: task.assignees.map((person) => person.id),
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
  }
}

/** Вэб progress-ыг checklist-ээс тооцоолдог (дууссан / нийт, бүхэл хувь). */
export function taskProgress(items: readonly TaskItem[]): {
  done: number
  total: number
  percent: number
} {
  const done = items.filter((item) => item.isDone).length
  const total = items.length
  return {
    done,
    total,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  }
}

/** Вэбийн `canArchive`: дууссан/буцаасан, архивлагдаагүй. */
export function canArchive(task: CompanyTask): boolean {
  return (
    (task.status === 'COMPLETED' || task.status === 'REJECTED') &&
    !task.isArchived
  )
}

/** Хугацаа хэтэрсэн эсэх — дуусаагүй, өнөөдрөөс өмнөх огноотой. */
export function isOverdue(
  task: Pick<CompanyTask, 'dueDate' | 'status'>,
  today: string,
): boolean {
  if (
    !task.dueDate ||
    task.status === 'COMPLETED' ||
    task.status === 'CANCELLED'
  )
    return false
  return task.dueDate.slice(0, 10) < today
}

/** Статус бүрийн тоо — шүүлтүүрийн чипэнд. */
export function countByStatus(
  tasks: readonly CompanyTask[],
): Record<TaskStatus, number> {
  const counts = Object.fromEntries(
    TASK_STATUSES.map((status) => [status, 0]),
  ) as Record<TaskStatus, number>
  for (const task of tasks) counts[task.status] += 1
  return counts
}
