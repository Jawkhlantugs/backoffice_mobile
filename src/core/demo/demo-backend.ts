import dayjs from 'dayjs'

import { env } from '@/core/config/env'
import { AppErrors } from '@/core/errors/app-exception'
import type { CompanyTaskDto } from '@/data/company-task/company-task-dto'
import type { LeaveRequestDto } from '@/data/leave-request/leave-request-dto'
import type { WeeklyReportDto } from '@/data/weekly-report/weekly-report-dto'
import { messages } from '@/lib/messages'

import { createDemoSeed, DEMO_ADMIN_ID, type DemoSeed } from './demo-fixtures'

/**
 * Демо горимын "backend": axios adapter хүсэлтийг энд өгнө, сүлжээ рүү юу ч
 * гарахгүй. Үйлдэл бүр санах ойн төлөвийг өөрчилдөг тул reviewer батлах,
 * төлөв солих зэргийн үр дүнг жагсаалтад шууд харна.
 */

export type DemoRequest = {
  /** `api`-ийн түлхүүр — `backoffice`, `finance`, `support`, `bankV2` ... */
  client: string
  method: string
  path: string
  body: Record<string, unknown>
  params: Record<string, unknown>
}

type Match = Record<string, string>
type Handler = (db: DemoSeed, request: DemoRequest, match: Match) => unknown
type Route = {
  client: string
  method: string
  pattern: RegExp
  handle: Handler
}

let db: DemoSeed = seed()
let sequence = 0

function seed(): DemoSeed {
  return createDemoSeed(env.demoLogin?.email ?? 'demo@example.com')
}

export function resetDemoBackend(): void {
  db = seed()
  sequence = 0
}

const nextId = (prefix: string) => `${prefix}-new-${++sequence}`
const now = () => dayjs().toISOString()
const text = (value: unknown) => (typeof value === 'string' ? value : '')
const num = (value: unknown, fallback: number) =>
  typeof value === 'number' && value > 0 ? value : fallback

/** Backoffice-ийн `{ message, body }` дугтуй — `unwrap()` задална. */
const ok = (body: unknown) => ({ message: 'success', body })
/** Finance action-уудын `{ code, message, data }` дугтуй. */
const done = (data: unknown = null) => ({ code: 0, message: 'success', data })

function page<T>(items: T[], body: Record<string, unknown>) {
  const current = num(body.current ?? body.page, 1)
  const size = num(body.pageSize, 20)
  const start = (current - 1) * size
  return ok({ items: items.slice(start, start + size), total: items.length })
}

function find<T extends { id?: string }>(
  items: T[],
  id: string | undefined,
): T {
  const item = items.find((candidate) => candidate.id === id)
  if (!item) throw AppErrors.api(404, `demo: ${id} олдсонгүй`)
  return item
}

function matchesQuery(value: object, query: unknown): boolean {
  const needle = text(query).trim().toLowerCase()
  return !needle || JSON.stringify(value).toLowerCase().includes(needle)
}

function me() {
  return {
    id: DEMO_ADMIN_ID,
    email: db.profile.email,
    department: db.profile.department,
  }
}

const route = (
  client: string,
  method: string,
  path: string,
  handle: Handler,
): Route => ({
  client,
  method,
  pattern: new RegExp(`^/?${path.replace(/:(\w+)/g, '(?<$1>[^/]+)')}$`),
  handle,
})

const authRoutes: Route[] = [
  route('backoffice', 'get', '/auth/info', (data) => ok(data.profile)),
  route('backoffice', 'get', '/admin/admin-menus/my', (data) => ok(data.menus)),
]

function filterLeave(items: LeaveRequestDto[], body: Record<string, unknown>) {
  return items.filter(
    (item) =>
      (!body.status || item.status === body.status) &&
      (!body.adminUserId || item.adminUserId === body.adminUserId),
  )
}

const leaveRoutes: Route[] = [
  route('backoffice', 'post', '/admin/leave-requests/list', (data, { body }) =>
    page(filterLeave(data.leaveRequests, body), body),
  ),
  route('backoffice', 'get', '/admin/leave-requests/:id', (data, _r, { id }) =>
    ok(find(data.leaveRequests, id)),
  ),
  route(
    'backoffice',
    'post',
    '/admin/leave-requests/:id/review',
    (data, { body }, { id }) => {
      const item = find(data.leaveRequests, id)
      Object.assign(item, {
        status: text(body.status),
        reviewer: { email: data.profile.email },
        reviewNote: text(body.reviewNote) || undefined,
      })
      return ok(item)
    },
  ),
  route('backoffice', 'post', '/admin/leave-requests', (data, { body }) => {
    const item: LeaveRequestDto = {
      id: nextId('leave'),
      adminUserId: DEMO_ADMIN_ID,
      adminUser: {
        email: data.profile.email,
        department: data.profile.department,
      },
      leaveType: text(body.leaveType),
      requestType: text(body.requestType),
      startDate: text(body.startDate),
      endDate: text(body.endDate),
      startTime: text(body.startTime) || undefined,
      endTime: text(body.endTime) || undefined,
      reason: text(body.reason),
      status: 'PENDING',
      created_at: now(),
    }
    data.leaveRequests.unshift(item)
    return ok(item)
  }),
]

function filterTasks(items: CompanyTaskDto[], body: Record<string, unknown>) {
  const mine = (task: CompanyTaskDto) =>
    task.assignees?.some((person) => person.id === DEMO_ADMIN_ID) ?? false
  const scopeMatch = (task: CompanyTaskDto) => {
    switch (body.scope) {
      case 'assigned_to_me':
        return mine(task)
      case 'created_by_me':
        return task.createdById === DEMO_ADMIN_ID
      case 'mine':
        return mine(task) || task.createdById === DEMO_ADMIN_ID
      default:
        return true
    }
  }
  return items.filter(
    (task) =>
      Boolean(task.isArchived) === Boolean(body.archivedOnly) &&
      scopeMatch(task) &&
      matchesQuery(
        { title: task.title, description: task.description },
        body.search,
      ),
  )
}

function findItem(taskId: string | undefined) {
  for (const task of db.tasks) {
    const item = task.items?.find((candidate) => candidate.id === taskId)
    if (item) return { task, item }
  }
  throw AppErrors.api(404, `demo: item ${taskId} олдсонгүй`)
}

function writeTask(task: CompanyTaskDto, body: Record<string, unknown>) {
  const ids = Array.isArray(body.assigneeIds)
    ? body.assigneeIds.map(String)
    : []
  Object.assign(task, {
    title: text(body.title),
    description: text(body.description),
    priority: text(body.priority) || task.priority,
    dueDate: text(body.dueDate) || null,
    assigneeId: ids[0] ?? null,
    assignees: db.assignees.filter((person) => ids.includes(person.id)),
    updated_at: now(),
  })
}

const taskRoutes: Route[] = [
  route('backoffice', 'post', '/admin/company-tasks/list', (data, { body }) =>
    page(filterTasks(data.tasks, body), body),
  ),
  route('backoffice', 'get', '/admin/company-tasks/assignees', (data) =>
    ok(data.assignees),
  ),
  route(
    'backoffice',
    'get',
    '/admin/company-tasks/comments/attachments/:id/signed-url',
    () => {
      throw AppErrors.api(501, 'demo: attachment', {
        message: messages.demo.unsupported,
      })
    },
  ),
  route('backoffice', 'get', '/admin/company-tasks/:id', (data, _r, { id }) =>
    ok(find(data.tasks, id)),
  ),
  route('backoffice', 'post', '/admin/company-tasks', (data, { body }) => {
    const task: CompanyTaskDto = {
      id: nextId('task'),
      status: text(body.status) || 'PLANNED',
      position: 0,
      createdById: DEMO_ADMIN_ID,
      createdBy: me(),
      items: [],
      comments: [],
      created_at: now(),
    }
    writeTask(task, body)
    data.tasks.unshift(task)
    return ok(task)
  }),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/items/:id/toggle',
    (_d, { body }, { id }) => {
      findItem(id).item.isDone = body.isDone === true
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/items/:id',
    (_d, { body }, { id }) => {
      findItem(id).item.title = text(body.title)
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'delete',
    '/admin/company-tasks/items/:id',
    (_d, _r, { id }) => {
      const { task, item } = findItem(id)
      task.items = task.items?.filter((candidate) => candidate !== item)
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'delete',
    '/admin/company-tasks/comments/:id',
    (data, _r, { id }) => {
      for (const task of data.tasks) {
        task.comments = task.comments?.filter((comment) => comment.id !== id)
      }
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'post',
    '/admin/company-tasks/:id/items',
    (data, { body }, { id }) => {
      const task = find(data.tasks, id)
      const items = task.items ?? []
      task.items = [
        ...items,
        {
          id: nextId('item'),
          title: text(body.title),
          isDone: false,
          position: items.length,
        },
      ]
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'post',
    '/admin/company-tasks/:id/comments',
    (data, { body }, { id }) => {
      const task = find(data.tasks, id)
      const comment = {
        id: nextId('comment'),
        adminUserId: DEMO_ADMIN_ID,
        adminUser: me(),
        content: text(body.content),
        created_at: now(),
      }
      task.comments = [...(task.comments ?? []), comment]
      return ok(comment)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/:id/reorder',
    (data, { body }, { id }) => {
      Object.assign(find(data.tasks, id), {
        status: text(body.status),
        updated_at: now(),
      })
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/:id/archive',
    (data, _r, { id }) => {
      find(data.tasks, id).isArchived = true
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/:id/unarchive',
    (data, _r, { id }) => {
      find(data.tasks, id).isArchived = false
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/company-tasks/:id',
    (data, { body }, { id }) => {
      writeTask(find(data.tasks, id), body)
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'delete',
    '/admin/company-tasks/:id',
    (data, _r, { id }) => {
      data.tasks = data.tasks.filter((task) => task.id !== id)
      return ok(null)
    },
  ),
]

function filterReports(
  items: WeeklyReportDto[],
  body: Record<string, unknown>,
) {
  return items.filter(
    (report) =>
      (!body.status || report.status === body.status) &&
      (!body.adminUserId || report.adminUserId === body.adminUserId) &&
      (!body.department || report.adminUser?.department === body.department),
  )
}

function writeReport(report: WeeklyReportDto, body: Record<string, unknown>) {
  Object.assign(report, {
    weekStart: text(body.weekStart),
    weekEnd: text(body.weekEnd),
    title: text(body.title),
    summary: text(body.summary),
    completedWork: text(body.completedWork),
    nextPlan: text(body.nextPlan),
  })
}

const reportRoutes: Route[] = [
  route('backoffice', 'post', '/admin/weekly-reports/list', (data, { body }) =>
    page(filterReports(data.weeklyReports, body), body),
  ),
  route(
    'backoffice',
    'get',
    '/admin/weekly-reports/authors',
    (data, { params }) =>
      ok(
        data.assignees.filter(
          (person) => person.department === params.department,
        ),
      ),
  ),
  route('backoffice', 'get', '/admin/weekly-reports/:id', (data, _r, { id }) =>
    ok(find(data.weeklyReports, id)),
  ),
  route('backoffice', 'post', '/admin/weekly-reports', (data, { body }) => {
    const report: WeeklyReportDto = {
      id: nextId('report'),
      adminUserId: DEMO_ADMIN_ID,
      adminUser: me(),
      status: 'DRAFT',
      created_at: now(),
    }
    writeReport(report, body)
    data.weeklyReports.unshift(report)
    return ok(report)
  }),
  route(
    'backoffice',
    'post',
    '/admin/weekly-reports/:id/submit',
    (data, _r, { id }) => {
      Object.assign(find(data.weeklyReports, id), {
        status: 'SUBMITTED',
        submittedAt: now(),
      })
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/weekly-reports/:id/next-plan',
    (data, { body }, { id }) => {
      find(data.weeklyReports, id).nextPlan = text(body.nextPlan)
      return ok(null)
    },
  ),
  route(
    'backoffice',
    'put',
    '/admin/weekly-reports/:id',
    (data, { body }, { id }) => {
      writeReport(find(data.weeklyReports, id), body)
      return ok(null)
    },
  ),
]

const supportRoutes: Route[] = [
  route('backoffice', 'post', '/support/tickets/list', (data, { body }) =>
    page(
      data.tickets.filter(
        (ticket) =>
          (!body.status || ticket.status === body.status) &&
          matchesQuery(ticket, body.search),
      ),
      body,
    ),
  ),
  route('backoffice', 'get', '/support/tickets/:id', (data, _r, { id }) =>
    ok(find(data.tickets, id)),
  ),
  route(
    'backoffice',
    'put',
    '/support/tickets/:id',
    (data, { body }, { id }) => {
      const ticket = find(data.tickets, id)
      ticket.status = text(body.status)
      return ok(ticket)
    },
  ),
  // `marcos` — backend дээрх нэр, бүү зас.
  route('backoffice', 'post', '/support/marcos/list', (data) =>
    ok({ items: data.macros }),
  ),
  route('support', 'post', 'admin/tickets/conversation', (data, { body }) =>
    ok({ items: data.conversations[text(body.ticketId)] ?? [] }),
  ),
]

type FinanceKey =
  'cryptoWithdrawals' | 'bankDeposits' | 'bankWithdrawals' | 'converts'

function listRoute(path: string, key: FinanceKey): Route {
  return route('backoffice', 'post', path, (data, { body }) => {
    const rows: readonly { status?: unknown }[] = data[key]
    return page(
      rows.filter(
        (row) =>
          (!body.status || String(row.status) === String(body.status)) &&
          matchesQuery(row, body.query),
      ),
      body,
    )
  })
}

const financeRoutes: Route[] = [
  listRoute('/crypto/withdrawal-history/list', 'cryptoWithdrawals'),
  listRoute('/banks/deposits/list', 'bankDeposits'),
  listRoute('/banks/withdrawals/list', 'bankWithdrawals'),
  listRoute('/convert/list', 'converts'),
  // 1 = Completed, 5 = Failed/Rejected — вэбийн crypto/withdrawal constants.
  route('finance', 'post', '/crypto-withdraw/action', (data, { body }) => {
    find(data.cryptoWithdrawals, text(body.historyId)).status =
      body.action === 'APPROVE' ? 1 : 5
    return done()
  }),
  route(
    'bankV2',
    'put',
    '/user-bank-withdraw/:id/mark-transferred',
    (data, _r, { id }) => {
      find(data.bankWithdrawals, id).status = 'TRANSFERRED'
      return ok(null)
    },
  ),
  route('finance', 'post', '/convert/retry', (data, { body }) => {
    find(data.converts, text(body.id)).status = 'COMPLETED'
    return done()
  }),
]

const ROUTES: Route[] = [
  ...authRoutes,
  ...leaveRoutes,
  ...taskRoutes,
  ...reportRoutes,
  ...supportRoutes,
  ...financeRoutes,
]

/**
 * Бүртгэлгүй жагсаалт хоосон ирнэ (дэлгэц "мэдээлэл алга" харуулна), бусад нь
 * алдаа. Ямар ч тохиолдолд сүлжээ рүү **унахгүй** — энэ бол демогийн баталгаа.
 */
export function handleDemoRequest(request: DemoRequest): unknown {
  const method = request.method.toLowerCase()

  for (const candidate of ROUTES) {
    if (candidate.client !== request.client || candidate.method !== method)
      continue
    const found = candidate.pattern.exec(request.path)
    if (found) return candidate.handle(db, request, found.groups ?? {})
  }

  if (method === 'post' && /\/list$/.test(request.path)) {
    return ok({ items: [], total: 0 })
  }

  throw AppErrors.api(501, `demo: ${method} ${request.client}${request.path}`, {
    message: messages.demo.unsupported,
  })
}

/** WebSocket-ийн оронд — ticket-д хариу бичихийг демо дээр харуулна. */
export function appendDemoTicketMessage(
  ticketId: string,
  message: string,
): void {
  const thread = db.conversations[ticketId] ?? []
  db.conversations[ticketId] = [
    ...thread,
    {
      id: nextId('m'),
      ticketId,
      message,
      senderType: 'support',
      senderId: DEMO_ADMIN_ID,
      created_at: now(),
    },
  ]
}
