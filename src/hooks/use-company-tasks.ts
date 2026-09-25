import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'

import {
  taskProgress,
  type CompanyTask,
  type TaskInput,
  type TaskItem,
  type TaskScope,
  type TaskStatus,
} from '@/data/company-task/company-task-model'
import { companyTaskRepository } from '@/data/company-task/company-task-repository'

import { useDebouncedValue } from './use-debounced-value'

const KEY = 'company-tasks'
const detailKey = (id: string) => [KEY, 'detail', id] as const
/** Хариуцагчийн жагсаалт бараг өөрчлөгддөггүй — вэбтэй ижил 5 минут. */
const ASSIGNEES_STALE_MS = 5 * 60_000

const refresh = (client: QueryClient) =>
  client.invalidateQueries({ queryKey: [KEY] })

export function useCompanyTasks(
  scope: TaskScope,
  search = '',
  archivedOnly = false,
) {
  const query = useDebouncedValue(search.trim())
  return useQuery({
    queryKey: [KEY, 'list', scope, query, archivedOnly],
    queryFn: () =>
      companyTaskRepository.list({
        scope,
        search: query || undefined,
        archivedOnly,
      }),
  })
}

export function useCompanyTask(id: string) {
  return useQuery({
    queryKey: detailKey(id),
    queryFn: () => companyTaskRepository.byId(id),
    enabled: id.length > 0,
  })
}

export function useTaskAssignees() {
  return useQuery({
    queryKey: [KEY, 'assignees'],
    queryFn: () => companyTaskRepository.assignees(),
    staleTime: ASSIGNEES_STALE_MS,
  })
}

/** Шинэ task-ыг үүсгээд буцаана — дэлгэц шууд дэлгэрэнгүй рүү нь орно. */
export function useCreateTask() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ input, status }: { input: TaskInput; status: TaskStatus }) =>
      companyTaskRepository.create(input, status),
    onSuccess: () => void refresh(client),
  })
}

export function useUpdateTask(task: CompanyTask | undefined) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: TaskInput) =>
      companyTaskRepository.update(
        task?.id ?? '',
        input,
        taskProgress(task?.items ?? []).percent,
      ),
    onSuccess: () => void refresh(client),
  })
}

/**
 * Статус солих — дэлгэц дээр шууд шилжинэ, сервер амжилтгүй бол буцна.
 * Самбарын жагсаалтын төгсгөлд (position = тухайн баганын урт) оруулна.
 */
export function useMoveTask() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      task,
      status,
      position,
    }: {
      task: CompanyTask
      status: TaskStatus
      position: number
    }) => companyTaskRepository.move(task.id, status, position),
    onMutate: ({ task, status }) => {
      const key = detailKey(task.id)
      const previous = client.getQueryData<CompanyTask>(key)
      client.setQueryData<CompanyTask>(key, (old) =>
        old ? { ...old, status } : old,
      )
      return { previous, key }
    },
    onError: (_error, _vars, context) => {
      if (context) client.setQueryData(context.key, context.previous)
    },
    onSettled: () => void refresh(client),
  })
}

/** Checklist-ийн нэг мөрийг дармагц тэмдэглэнэ — хүлээхгүй. */
export function useToggleTaskItem(taskId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (item: TaskItem) =>
      companyTaskRepository.toggleItem(item.id, !item.isDone),
    onMutate: (item) => {
      const key = detailKey(taskId)
      const previous = client.getQueryData<CompanyTask>(key)
      client.setQueryData<CompanyTask>(key, (old) =>
        old
          ? {
              ...old,
              items: old.items.map((each) =>
                each.id === item.id ? { ...each, isDone: !item.isDone } : each,
              ),
            }
          : old,
      )
      return { previous, key }
    },
    onError: (_error, _item, context) => {
      if (context) client.setQueryData(context.key, context.previous)
    },
    onSettled: () => void refresh(client),
  })
}

function useTaskMutation<T>(fn: (input: T) => Promise<unknown>) {
  const client = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => void refresh(client) })
}

export const useAddTaskItem = (taskId: string) =>
  useTaskMutation((title: string) =>
    companyTaskRepository.addItem(taskId, title),
  )
export const useRenameTaskItem = () =>
  useTaskMutation(({ item, title }: { item: TaskItem; title: string }) =>
    companyTaskRepository.renameItem(item, title),
  )
export const useRemoveTaskItem = () =>
  useTaskMutation((itemId: string) => companyTaskRepository.removeItem(itemId))
export const useAddTaskComment = (taskId: string) =>
  useTaskMutation((content: string) =>
    companyTaskRepository.addComment(taskId, content),
  )
export const useRemoveTaskComment = () =>
  useTaskMutation((commentId: string) =>
    companyTaskRepository.removeComment(commentId),
  )
export const useArchiveTask = () =>
  useTaskMutation((id: string) => companyTaskRepository.archive(id))
export const useUnarchiveTask = () =>
  useTaskMutation((id: string) => companyTaskRepository.unarchive(id))
export const useDeleteTask = () =>
  useTaskMutation((id: string) => companyTaskRepository.remove(id))

export function useOpenTaskAttachment() {
  return useMutation({
    mutationFn: (attachmentId: string) =>
      companyTaskRepository.attachmentUrl(attachmentId),
  })
}
