import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import dayjs from 'dayjs'

import {
  AppHeader,
  AppInput,
  AppText,
  ConfirmSheet,
  FilterChips,
  FormSection,
  IconButton,
  InfoRow,
  ProgressBar,
  RecordActions,
  Screen,
  SectionHeader,
  StateView,
  StatusPill,
} from '@/components'
import { useSessionStore } from '@/core/session/session-store'
import {
  canArchive,
  isOverdue,
  taskProgress,
  TASK_STATUSES,
  type TaskComment,
  type TaskItem,
} from '@/data/company-task/company-task-model'
import {
  useAddTaskComment,
  useAddTaskItem,
  useArchiveTask,
  useCompanyTask,
  useDeleteTask,
  useMoveTask,
  useOpenTaskAttachment,
  useRemoveTaskComment,
  useRemoveTaskItem,
  useRenameTaskItem,
  useToggleTaskItem,
  useUnarchiveTask,
} from '@/hooks/use-company-tasks'
import { formatDate, formatDateOnly } from '@/lib/date'
import { messages } from '@/lib/messages'

import { TaskCommentBubble } from './task-comment-bubble'
import { TaskItemRow } from './task-item-row'
import { TaskItemSheet } from './task-item-sheet'
import { PRIORITY_TONE } from './task-tones'

const text = messages.tasks
const f = text.fields

/**
 * Нэг ажлын бүх зүйл нэг дэлгэцэд: төлөвийг чипээр нэг хүрэлтээр солих,
 * checklist-ийг мөр дээр дарж тэмдэглэх, шинэ зүйл нэмэх, сэтгэгдэл бичих.
 */
export function TaskDetailScreen() {
  const router = useRouter()
  const { id = '' } = useLocalSearchParams<{ id: string }>()
  const userId = useSessionStore((store) => store.user?.id)

  const query = useCompanyTask(id)
  const move = useMoveTask()
  const toggle = useToggleTaskItem(id)
  const addItem = useAddTaskItem(id)
  const renameItem = useRenameTaskItem()
  const removeItem = useRemoveTaskItem()
  const addComment = useAddTaskComment(id)
  const removeComment = useRemoveTaskComment()
  const archive = useArchiveTask()
  const unarchive = useUnarchiveTask()
  const remove = useDeleteTask()
  const openAttachment = useOpenTaskAttachment()

  const [newItem, setNewItem] = useState('')
  const [comment, setComment] = useState('')
  const [editingItem, setEditingItem] = useState<TaskItem | null>(null)
  const [deletingComment, setDeletingComment] = useState<TaskComment | null>(
    null,
  )

  const task = query.data
  const progress = taskProgress(task?.items ?? [])

  async function submitItem() {
    const title = newItem.trim()
    if (!title) return
    await addItem.mutateAsync(title)
    setNewItem('')
  }

  async function submitComment() {
    const content = comment.trim()
    if (!content) return
    await addComment.mutateAsync(content)
    setComment('')
  }

  async function open(attachmentId: string) {
    const url = await openAttachment.mutateAsync(attachmentId)
    await WebBrowser.openBrowserAsync(url)
  }

  return (
    <Screen>
      <AppHeader
        title={text.title}
        subtitle={task ? text.statuses[task.status] : undefined}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
        actions={
          task && !task.isArchived
            ? [
                {
                  icon: 'edit',
                  label: text.edit,
                  onPress: () =>
                    router.push({
                      pathname: '/office/tasks/[id]/edit',
                      params: { id: task.id },
                    }),
                },
              ]
            : []
        }
      />

      <StateView
        loading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      >
        {task ? (
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerClassName="gap-6 pb-10"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="gap-2">
                <AppText variant="title" selectable>
                  {task.title}
                </AppText>
                {task.description ? (
                  <AppText
                    variant="body"
                    selectable
                    className="text-muted-foreground"
                  >
                    {task.description}
                  </AppText>
                ) : null}
              </View>

              {task.isArchived ? null : (
                <View className="gap-2">
                  <AppText variant="label">{f.status}</AppText>
                  <FilterChips
                    chips={TASK_STATUSES.map((value) => ({
                      value,
                      label: text.statuses[value],
                    }))}
                    value={task.status}
                    onChange={(status) => {
                      if (status !== task.status)
                        move.mutate({ task, status, position: 0 })
                    }}
                  />
                </View>
              )}

              <View className="gap-3 rounded-xl border border-border bg-card p-4">
                <View className="flex-row flex-wrap gap-2">
                  <StatusPill
                    label={`${f.priority}: ${text.priorities[task.priority]}`}
                    tone={PRIORITY_TONE[task.priority]}
                  />
                  {isOverdue(task, dayjs().format('YYYY-MM-DD')) ? (
                    <StatusPill label={text.overdue} tone="danger" />
                  ) : null}
                </View>
                <InfoRow
                  label={f.dueDate}
                  value={task.dueDate ? formatDateOnly(task.dueDate) : '—'}
                />
                <InfoRow
                  label={f.assignees}
                  value={
                    task.assignees.map((person) => person.email).join('\n') ||
                    '—'
                  }
                />
                <InfoRow
                  label={f.createdBy}
                  value={task.createdBy?.email ?? '—'}
                />
                <InfoRow
                  label={f.createdAt}
                  value={formatDate(task.createdAt)}
                />
                {task.rejectReason ? (
                  <InfoRow label={f.rejectReason} value={task.rejectReason} />
                ) : null}
              </View>

              <FormSection
                title={`${text.checklist} · ${progress.done}/${progress.total}`}
              >
                {progress.total > 0 ? (
                  <ProgressBar percent={progress.percent} />
                ) : null}
                {task.items.length > 0 ? (
                  <View>
                    {task.items.map((item) => (
                      <TaskItemRow
                        key={item.id}
                        item={item}
                        onToggle={() => toggle.mutate(item)}
                        onLongPress={() => setEditingItem(item)}
                      />
                    ))}
                  </View>
                ) : null}
                {task.isArchived ? null : (
                  <View className="flex-row items-end gap-2">
                    <View className="flex-1">
                      <AppInput
                        value={newItem}
                        onChangeText={setNewItem}
                        placeholder={text.addItemPlaceholder}
                        returnKeyType="done"
                        onSubmitEditing={() => void submitItem()}
                      />
                    </View>
                    <IconButton
                      icon="add"
                      label={messages.form.add}
                      disabled={!newItem.trim() || addItem.isPending}
                      onPress={() => void submitItem()}
                    />
                  </View>
                )}
              </FormSection>

              <View className="gap-3">
                <SectionHeader
                  title={`${text.comments} · ${task.comments.length}`}
                />
                {task.comments.length === 0 ? (
                  <AppText variant="caption">{text.noComments}</AppText>
                ) : (
                  task.comments.map((each) => (
                    <TaskCommentBubble
                      key={each.id}
                      comment={each}
                      onOpenAttachment={(attachmentId) =>
                        void open(attachmentId)
                      }
                      onLongPress={
                        each.authorId === userId
                          ? () => setDeletingComment(each)
                          : undefined
                      }
                    />
                  ))
                )}
                <View className="flex-row items-end gap-2">
                  <View className="flex-1">
                    <AppInput
                      value={comment}
                      onChangeText={setComment}
                      placeholder={text.commentPlaceholder}
                      returnKeyType="send"
                      onSubmitEditing={() => void submitComment()}
                    />
                  </View>
                  <IconButton
                    icon="send"
                    label={messages.supportTickets.reply.send}
                    disabled={!comment.trim() || addComment.isPending}
                    onPress={() => void submitComment()}
                  />
                </View>
              </View>

              <RecordActions
                actions={[
                  {
                    key: 'archive',
                    label: text.archive,
                    icon: 'archive',
                    hidden: !canArchive(task),
                    confirm: {
                      title: text.archiveConfirm,
                      description: task.title,
                    },
                    run: async () => {
                      await archive.mutateAsync(task.id)
                      router.back()
                    },
                  },
                  {
                    key: 'unarchive',
                    label: text.unarchive,
                    icon: 'unarchive',
                    hidden: !task.isArchived,
                    confirm: {
                      title: text.unarchiveConfirm,
                      description: task.title,
                    },
                    run: () => unarchive.mutateAsync(task.id),
                  },
                  {
                    key: 'delete',
                    label: text.delete,
                    icon: 'trash',
                    destructive: true,
                    confirm: {
                      title: text.deleteConfirm,
                      description: task.title,
                    },
                    run: async () => {
                      await remove.mutateAsync(task.id)
                      router.back()
                    },
                  },
                ]}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        ) : null}
      </StateView>

      <TaskItemSheet
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onRename={async (item, title) => {
          await renameItem.mutateAsync({ item, title })
        }}
        onRemove={async (item) => {
          await removeItem.mutateAsync(item.id)
        }}
      />

      <ConfirmSheet
        visible={deletingComment !== null}
        title={text.deleteCommentConfirm}
        description={deletingComment?.content ?? ''}
        destructive
        confirmLabel={text.delete}
        onCancel={() => setDeletingComment(null)}
        onConfirm={async () => {
          if (deletingComment)
            await removeComment.mutateAsync(deletingComment.id)
          setDeletingComment(null)
        }}
      />
    </Screen>
  )
}
