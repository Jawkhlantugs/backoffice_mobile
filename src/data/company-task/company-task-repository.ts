import { clients } from '@/core/network/clients'
import { unwrap, unwrapList } from '@/core/network/envelope'

import {
  toCompanyTask,
  toPerson,
  toTaskComment,
  toTaskWrite,
  type CompanyTaskDto,
  type TaskCommentDto,
  type TaskPersonDto,
} from './company-task-dto'
import type {
  CompanyTask,
  TaskComment,
  TaskInput,
  TaskItem,
  TaskPerson,
  TaskScope,
  TaskStatus,
} from './company-task-model'

const BASE = '/admin/company-tasks'
/** Вэб самбарыг нэг дор 200-аар татдаг — хуудаслалтгүй. */
const BOARD_PAGE_SIZE = 200

/** Endpoint: `office/company-task.service.ts` — `{backoffice}/admin/company-tasks…`. */
export const companyTaskRepository = {
  async list(params: {
    scope: TaskScope
    search?: string
    archivedOnly?: boolean
  }): Promise<CompanyTask[]> {
    const response = await clients.backoffice.post(`${BASE}/list`, {
      current: 1,
      pageSize: BOARD_PAGE_SIZE,
      scope: params.scope,
      ...(params.search ? { search: params.search } : {}),
      ...(params.archivedOnly ? { archivedOnly: true } : {}),
    })
    return unwrapList<CompanyTaskDto>(response.data, 'company-tasks').items.map(
      toCompanyTask,
    )
  },

  async byId(id: string): Promise<CompanyTask> {
    const response = await clients.backoffice.get(`${BASE}/${id}`)
    return toCompanyTask(unwrap<CompanyTaskDto>(response.data))
  },

  async create(input: TaskInput, status: TaskStatus): Promise<CompanyTask> {
    const response = await clients.backoffice.post(BASE, {
      ...toTaskWrite(input, 0),
      status,
    })
    return toCompanyTask(unwrap<CompanyTaskDto>(response.data))
  },

  async update(id: string, input: TaskInput, progress: number): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}`, toTaskWrite(input, progress))
  },

  /** Самбарт чирэхтэй ижил — статус солих нь `reorder`-ээр явдаг. */
  async move(id: string, status: TaskStatus, position: number): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}/reorder`, { status, position })
  },

  async remove(id: string): Promise<void> {
    await clients.backoffice.delete(`${BASE}/${id}`)
  },
  async archive(id: string): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}/archive`)
  },
  async unarchive(id: string): Promise<void> {
    await clients.backoffice.put(`${BASE}/${id}/unarchive`)
  },

  async addItem(taskId: string, title: string): Promise<void> {
    await clients.backoffice.post(`${BASE}/${taskId}/items`, { title })
  },
  /** Вэб PUT-д бүх талбарыг явуулдаг — гарчгаас бусдыг хуучнаар нь үлдээнэ. */
  async renameItem(item: TaskItem, title: string): Promise<void> {
    await clients.backoffice.put(`${BASE}/items/${item.id}`, {
      title,
      dueDate: item.dueDate ?? null,
      assigneeId: item.assignee?.id ?? null,
      estimatedHours: item.estimatedHours ?? null,
    })
  },
  async toggleItem(itemId: string, isDone: boolean): Promise<void> {
    await clients.backoffice.put(`${BASE}/items/${itemId}/toggle`, { isDone })
  },
  async removeItem(itemId: string): Promise<void> {
    await clients.backoffice.delete(`${BASE}/items/${itemId}`)
  },

  async addComment(taskId: string, content: string): Promise<TaskComment> {
    const response = await clients.backoffice.post(
      `${BASE}/${taskId}/comments`,
      { content },
    )
    return toTaskComment(unwrap<TaskCommentDto>(response.data))
  },
  async removeComment(commentId: string): Promise<void> {
    await clients.backoffice.delete(`${BASE}/comments/${commentId}`)
  },
  /** Хавсралт нь хувийн S3 — богино хугацааны URL (диск дээр кэшлэхгүй). */
  async attachmentUrl(attachmentId: string): Promise<string> {
    const response = await clients.backoffice.get(
      `${BASE}/comments/attachments/${attachmentId}/signed-url`,
    )
    return unwrap<{ signedUrl: string }>(response.data).signedUrl
  },

  async assignees(): Promise<TaskPerson[]> {
    const response = await clients.backoffice.get(`${BASE}/assignees`)
    return unwrap<TaskPersonDto[]>(response.data).map(toPerson)
  },
}
