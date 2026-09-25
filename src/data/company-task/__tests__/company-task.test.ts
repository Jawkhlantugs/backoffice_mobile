import { toCompanyTask, toTaskWrite } from '../company-task-dto'
import {
  canArchive,
  countByStatus,
  isOverdue,
  taskProgress,
  taskToInput,
} from '../company-task-model'

const dto = {
  id: 't1',
  title: 'Тайлан',
  status: 'IN_PROGRESS',
  priority: 'HIGH',
  assignee: { id: 'a1', email: 'bat@x.mn' },
  dueDate: '2026-09-20T00:00:00.000Z',
  items: [
    { id: 'i2', title: 'Хоёр', isDone: false, position: 1 },
    { id: 'i1', title: 'Нэг', isDone: true, position: 0 },
  ],
}

describe('company task', () => {
  it('хуучин ганц assignee-г жагсаалт болгож, checklist-ийг эрэмбэлнэ', () => {
    const task = toCompanyTask(dto)
    expect(task.assignees.map((p) => p.email)).toEqual(['bat@x.mn'])
    expect(task.items.map((i) => i.id)).toEqual(['i1', 'i2'])
  })

  it('явцыг checklist-ээс, хугацаа хэтрэлтийг огноогоор', () => {
    const task = toCompanyTask(dto)
    expect(taskProgress(task.items)).toEqual({ done: 1, total: 2, percent: 50 })
    expect(isOverdue(task, '2026-09-25')).toBe(true)
    expect(isOverdue({ ...task, status: 'COMPLETED' }, '2026-09-25')).toBe(
      false,
    )
  })

  it('архивлах нь дууссан/буцаасан үед л', () => {
    const task = toCompanyTask(dto)
    expect(canArchive(task)).toBe(false)
    expect(canArchive({ ...task, status: 'REJECTED' })).toBe(true)
    expect(canArchive({ ...task, status: 'COMPLETED', isArchived: true })).toBe(
      false,
    )
  })

  it('танихгүй статус PLANNED, тоолол бүх статуст', () => {
    const task = toCompanyTask({ id: 'x', status: 'WEIRD' })
    expect(task.status).toBe('PLANNED')
    expect(countByStatus([task, toCompanyTask(dto)])).toMatchObject({
      PLANNED: 1,
      IN_PROGRESS: 1,
      COMPLETED: 0,
    })
  })

  it('вэбийн payload: эхний хариуцагч assigneeId-д, огноо YYYY-MM-DD', () => {
    const write = toTaskWrite(
      { ...taskToInput(toCompanyTask(dto)), title: ' Тайлан ' },
      50,
    )
    expect(write).toMatchObject({
      title: 'Тайлан',
      assigneeId: 'a1',
      assigneeIds: ['a1'],
      dueDate: '2026-09-20',
      progress: 50,
    })
  })
})
