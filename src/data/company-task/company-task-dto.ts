import type {
  CompanyTask,
  TaskComment,
  TaskInput,
  TaskItem,
  TaskPerson,
  TaskPriority,
  TaskStatus,
} from './company-task-model'
import { TASK_PRIORITIES, TASK_STATUSES } from './company-task-model'

export type TaskPersonDto = {
  id: string
  email?: string
  department?: string | null
}

export type TaskItemDto = {
  id: string
  title?: string
  isDone?: boolean
  dueDate?: string | null
  assignee?: TaskPersonDto | null
  estimatedHours?: number | null
  position?: number
}

export type TaskCommentDto = {
  id: string
  adminUserId?: string
  adminUser?: TaskPersonDto | null
  content?: string
  attachments?: {
    id: string
    fileName?: string
    contentType?: string
    fileSize?: number
  }[]
  created_at?: string
}

export type CompanyTaskDto = {
  id: string
  title?: string
  description?: string
  status?: string
  priority?: string
  position?: number
  assigneeId?: string | null
  assignee?: TaskPersonDto | null
  assignees?: TaskPersonDto[]
  dueDate?: string | null
  createdById?: string
  createdBy?: TaskPersonDto | null
  rejectReason?: string
  isArchived?: boolean
  items?: TaskItemDto[]
  comments?: TaskCommentDto[]
  created_at?: string
  updated_at?: string
}

export function toPerson(dto: TaskPersonDto): TaskPerson {
  return {
    id: dto.id,
    email: dto.email ?? dto.id,
    department: dto.department ?? undefined,
  }
}

const oneOf = <T extends string>(
  values: readonly T[],
  raw: string | undefined,
  fallback: T,
): T => (values.includes(raw as T) ? (raw as T) : fallback)

export function toTaskItem(dto: TaskItemDto): TaskItem {
  return {
    id: dto.id,
    title: dto.title ?? '',
    isDone: dto.isDone === true,
    dueDate: dto.dueDate ?? undefined,
    assignee: dto.assignee ? toPerson(dto.assignee) : undefined,
    estimatedHours: dto.estimatedHours ?? undefined,
    position: dto.position ?? 0,
  }
}

export function toTaskComment(dto: TaskCommentDto): TaskComment {
  return {
    id: dto.id,
    author: dto.adminUser ? toPerson(dto.adminUser) : undefined,
    authorId: dto.adminUserId ?? '',
    content: dto.content ?? '',
    attachments: (dto.attachments ?? []).map((file) => ({
      id: file.id,
      fileName: file.fileName ?? file.id,
      contentType: file.contentType ?? '',
      fileSize: file.fileSize ?? 0,
    })),
    createdAt: dto.created_at ?? '',
  }
}

export function toCompanyTask(dto: CompanyTaskDto): CompanyTask {
  // Олон хариуцагч `assignees`-д; хуучин бичлэг зөвхөн `assignee`-тэй байж болно.
  const assignees = dto.assignees?.length
    ? dto.assignees
    : dto.assignee
      ? [dto.assignee]
      : []
  return {
    id: dto.id,
    title: dto.title ?? '',
    description: dto.description ?? '',
    status: oneOf<TaskStatus>(TASK_STATUSES, dto.status, 'PLANNED'),
    priority: oneOf<TaskPriority>(TASK_PRIORITIES, dto.priority, 'MEDIUM'),
    position: dto.position ?? 0,
    assignees: assignees.map(toPerson),
    createdBy: dto.createdBy ? toPerson(dto.createdBy) : undefined,
    createdById: dto.createdById ?? '',
    dueDate: dto.dueDate ?? undefined,
    rejectReason: dto.rejectReason || undefined,
    isArchived: dto.isArchived === true,
    items: (dto.items ?? [])
      .map(toTaskItem)
      .sort((a, b) => a.position - b.position),
    comments: (dto.comments ?? []).map(toTaskComment),
    createdAt: dto.created_at ?? '',
    updatedAt: dto.updated_at ?? '',
  }
}

/** Вэбийн `saveMutation`-тай ижил: эхний хариуцагч `assigneeId`-д, бүгд `assigneeIds`-д. */
export function toTaskWrite(input: TaskInput, progress: number) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    priority: input.priority,
    assigneeId: input.assigneeIds[0] ?? null,
    assigneeIds: input.assigneeIds,
    dueDate: input.dueDate,
    progress,
  }
}
