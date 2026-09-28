import dayjs from 'dayjs'

import type { CompanyTaskDto } from '@/data/company-task/company-task-dto'
import type { SupportTicketDto } from '@/data/support-ticket/support-ticket-dto'
import type { TicketMacroDto } from '@/data/support-ticket/ticket-macro-dto'
import type { TicketMessageDto } from '@/data/support-ticket/ticket-conversation-dto'
import type { LeaveRequestDto } from '@/data/leave-request/leave-request-dto'
import type { WeeklyReportDto } from '@/data/weekly-report/weekly-report-dto'
import type { CryptoWithdrawalDto } from '@/data/crypto-withdrawal/crypto-withdrawal-dto'
import type { BankDepositDto } from '@/data/bank-deposit/bank-deposit-dto'
import type { BankWithdrawalDto } from '@/data/bank-withdrawal/bank-withdrawal-dto'
import type { ConvertRecordDto } from '@/data/convert/convert-dto'
import {
  BANK_DEPOSITS_MENU_PATH,
  BANK_WITHDRAWALS_MENU_PATH,
  CONVERT_MENU_PATH,
  CRYPTO_WITHDRAWAL_MENU_PATH,
  LEAVE_MENU_PATH,
  SUPPORT_TICKETS_MENU_PATH,
} from '@/core/navigation/menu-items'

/**
 * App Store review-д зориулсан **зохиомол** өгөгдөл. Бодит хэрэглэгч,
 * гүйлгээнээс нэг ч мөр хуулахгүй — имэйл бүр `example.com` (RFC 2606).
 */

export const DEMO_ADMIN_ID = 'demo-admin'

const day = (offset: number) => dayjs().add(offset, 'day')
const iso = (offset: number, hour = 10) =>
  day(offset).hour(hour).minute(0).second(0).toISOString()
const ymd = (offset: number) => day(offset).format('YYYY-MM-DD')
const weekStart = (weeksAgo: number) =>
  dayjs().subtract(weeksAgo, 'week').startOf('week').add(1, 'day')

const STAFF = {
  enkh: {
    id: 'staff-enkh',
    email: 'enkh.b@example.com',
    department: 'Operations',
  },
  saraa: {
    id: 'staff-saraa',
    email: 'saraa.t@example.com',
    department: 'Finance',
  },
  bat: { id: 'staff-bat', email: 'bat.d@example.com', department: 'Support' },
}

const customer = (n: number) => ({
  id: `user-${n}`,
  email: `customer${n}@example.com`,
})

function demoAdmin(email: string) {
  return { id: DEMO_ADMIN_ID, email, department: 'Operations' }
}

function profile(email: string) {
  return {
    id: DEMO_ADMIN_ID,
    email,
    department: 'Operations',
    adminGroupId: '4',
    adminGroup: { name: 'App Review (Demo)' },
  }
}

function menus() {
  const item = (
    path: string,
    name: string,
    team: string,
    groupId: string,
    order: number,
  ) => ({
    id: path,
    name,
    path,
    team,
    groupId,
    order,
    children: [],
  })
  return {
    groups: [
      { id: 'g-office', name: 'Office' },
      { id: 'g-support', name: 'Support' },
      { id: 'g-finance', name: 'Finance' },
    ],
    menus: [
      item(LEAVE_MENU_PATH, 'Leave Requests', 'office', 'g-office', 1),
      item('/office/tasks', 'Tasks', 'office', 'g-office', 2),
      item(
        '/office/weekly-task',
        'Weekly Reports',
        'office',
        'g-office',
        3,
      ),
      item(
        SUPPORT_TICKETS_MENU_PATH,
        'Support ticket',
        'portal',
        'g-support',
        1,
      ),
      item(
        CRYPTO_WITHDRAWAL_MENU_PATH,
        'Crypto Withdrawals',
        'portal',
        'g-finance',
        1,
      ),
      item(BANK_DEPOSITS_MENU_PATH, 'Bank Deposits', 'portal', 'g-finance', 2),
      item(
        BANK_WITHDRAWALS_MENU_PATH,
        'Bank Withdrawals',
        'portal',
        'g-finance',
        3,
      ),
      item(CONVERT_MENU_PATH, 'Convert', 'portal', 'g-finance', 4),
    ],
  }
}

function leaveRequests(email: string): LeaveRequestDto[] {
  const me = { email, department: 'Operations' }
  return [
    {
      id: 'leave-1',
      adminUserId: STAFF.enkh.id,
      adminUser: STAFF.enkh,
      leaveType: 'ANNUAL',
      requestType: 'day',
      startDate: ymd(3),
      endDate: ymd(5),
      reason: 'Family trip',
      status: 'PENDING',
      created_at: iso(-1),
    },
    {
      id: 'leave-2',
      adminUserId: STAFF.saraa.id,
      adminUser: STAFF.saraa,
      leaveType: 'SICK',
      requestType: 'day',
      startDate: ymd(0),
      endDate: ymd(0),
      reason: 'Doctor appointment',
      status: 'PENDING',
      created_at: iso(0, 8),
    },
    {
      id: 'leave-3',
      adminUserId: STAFF.bat.id,
      adminUser: STAFF.bat,
      leaveType: 'PERSONAL',
      requestType: 'hour',
      startDate: ymd(1),
      endDate: ymd(1),
      startTime: '14:00',
      endTime: '17:00',
      reason: 'Personal errand',
      status: 'PENDING',
      created_at: iso(-2),
    },
    {
      id: 'leave-4',
      adminUserId: DEMO_ADMIN_ID,
      adminUser: me,
      leaveType: 'ANNUAL',
      requestType: 'day',
      startDate: ymd(10),
      endDate: ymd(12),
      reason: 'Annual vacation',
      status: 'PENDING',
      created_at: iso(-1, 15),
    },
    {
      id: 'leave-5',
      adminUserId: DEMO_ADMIN_ID,
      adminUser: me,
      leaveType: 'SICK',
      requestType: 'day',
      startDate: ymd(-14),
      endDate: ymd(-13),
      reason: 'Flu',
      status: 'APPROVED',
      reviewer: { email: STAFF.saraa.email },
      reviewNote: 'Get well soon',
      created_at: iso(-15),
    },
    {
      id: 'leave-6',
      adminUserId: STAFF.enkh.id,
      adminUser: STAFF.enkh,
      leaveType: 'OTHER',
      requestType: 'day',
      startDate: ymd(-7),
      endDate: ymd(-7),
      reason: 'Training',
      status: 'REJECTED',
      reviewer: { email },
      reviewNote: 'Busy day for the team',
      created_at: iso(-9),
    },
  ]
}

function tasks(email: string): CompanyTaskDto[] {
  const me = demoAdmin(email)
  return [
    {
      id: 'task-1',
      title: 'Monthly reconciliation',
      description: 'Reconcile bank statements with system transactions.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      position: 0,
      assigneeId: me.id,
      assignees: [me, STAFF.saraa],
      dueDate: ymd(2),
      createdById: STAFF.saraa.id,
      createdBy: STAFF.saraa,
      created_at: iso(-4),
      updated_at: iso(-1),
      items: [
        { id: 'item-1', title: 'Download statements', isDone: true, position: 0 },
        { id: 'item-2', title: 'Note discrepancies', isDone: false, position: 1 },
        { id: 'item-3', title: 'Send to finance', isDone: false, position: 2 },
      ],
      comments: [
        {
          id: 'comment-1',
          adminUserId: STAFF.saraa.id,
          adminUser: STAFF.saraa,
          content: 'Statements are in the shared drive.',
          created_at: iso(-2),
        },
      ],
    },
    {
      id: 'task-2',
      title: 'Update support macros',
      description: 'Refresh answers to common questions.',
      status: 'PLANNED',
      priority: 'MEDIUM',
      position: 1,
      assigneeId: me.id,
      assignees: [me],
      dueDate: ymd(7),
      createdById: me.id,
      createdBy: me,
      created_at: iso(-2),
      updated_at: iso(-2),
      items: [
        { id: 'item-4', title: 'Draft the list', isDone: false, position: 0 },
      ],
    },
    {
      id: 'task-3',
      title: 'New staff onboarding',
      description: 'Walk through the main back-office flows.',
      status: 'PLANNED',
      priority: 'LOW',
      position: 2,
      assigneeId: STAFF.bat.id,
      assignees: [STAFF.bat],
      dueDate: ymd(14),
      createdById: me.id,
      createdBy: me,
      created_at: iso(-1),
      updated_at: iso(-1),
    },
    {
      id: 'task-4',
      title: 'Stuck transaction review',
      description: 'Check transactions stuck over the weekend.',
      status: 'COMPLETED',
      priority: 'HIGH',
      position: 3,
      assigneeId: me.id,
      assignees: [me],
      dueDate: ymd(-3),
      createdById: STAFF.enkh.id,
      createdBy: STAFF.enkh,
      created_at: iso(-8),
      updated_at: iso(-3),
      items: [
        { id: 'item-5', title: 'Export the list', isDone: true, position: 0 },
        {
          id: 'item-6',
          title: 'Notify customers',
          isDone: true,
          position: 1,
        },
      ],
    },
    {
      id: 'task-5',
      title: 'Archive old reports',
      description: '',
      status: 'CANCELLED',
      priority: 'LOW',
      position: 4,
      assigneeId: STAFF.enkh.id,
      assignees: [STAFF.enkh],
      createdById: me.id,
      createdBy: me,
      isArchived: true,
      created_at: iso(-30),
      updated_at: iso(-20),
    },
  ]
}

function assignees(email: string) {
  return [demoAdmin(email), STAFF.enkh, STAFF.saraa, STAFF.bat]
}

function weeklyReports(email: string): WeeklyReportDto[] {
  const me = demoAdmin(email)
  const week = (weeksAgo: number) => ({
    weekStart: weekStart(weeksAgo).format('YYYY-MM-DD'),
    weekEnd: weekStart(weeksAgo).add(6, 'day').format('YYYY-MM-DD'),
  })
  return [
    {
      id: 'report-1',
      adminUserId: me.id,
      adminUser: me,
      ...week(0),
      title: 'This week',
      summary: '',
      completedWork: '- Started monthly reconciliation\n- Resolved 12 tickets',
      nextPlan: 'Finish reconciliation',
      status: 'DRAFT',
      created_at: iso(-1),
    },
    {
      id: 'report-2',
      adminUserId: me.id,
      adminUser: me,
      ...week(1),
      title: 'Last week',
      summary: '',
      completedWork: '- Reviewed stuck transactions\n- Wrote new macros',
      nextPlan: 'Monthly reconciliation',
      status: 'SUBMITTED',
      submittedAt: iso(-3),
      created_at: iso(-8),
    },
    {
      id: 'report-3',
      adminUserId: STAFF.enkh.id,
      adminUser: STAFF.enkh,
      ...week(1),
      title: 'Operations',
      summary: '',
      completedWork: '- Verified bank deposits',
      nextPlan: 'Training',
      status: 'SUBMITTED',
      submittedAt: iso(-3),
      created_at: iso(-8),
    },
  ]
}

function tickets(): SupportTicketDto[] {
  return [
    {
      id: 'ticket-1',
      title: 'Deposit not received',
      user: customer(1),
      status: 'new',
      priority: 'high',
      category: { categoryNameMn: 'Deposits' },
      notes: 'My bank transfer has not arrived after 2 hours.',
      created_at: iso(0, 9),
    },
    {
      id: 'ticket-2',
      title: 'USDT withdrawal delayed',
      user: customer(2),
      status: 'open',
      priority: 'medium',
      agent: { email: STAFF.bat.email },
      category: { categoryNameMn: 'Withdrawals' },
      notes: 'My TRC20 withdrawal is still pending.',
      created_at: iso(-1),
    },
    {
      id: 'ticket-3',
      title: 'KYC verification',
      user: customer(3),
      status: 'pending',
      priority: 'low',
      category: { categoryNameMn: 'KYC' },
      notes: 'Should I upload my ID photo again?',
      created_at: iso(-2),
    },
    {
      id: 'ticket-4',
      title: 'Password reset',
      user: customer(4),
      status: 'solved',
      priority: 'low',
      category: { categoryNameMn: 'Account' },
      notes: 'I am not receiving the email.',
      created_at: iso(-5),
    },
  ]
}

function conversations(): Record<string, TicketMessageDto[]> {
  const msg = (
    id: string,
    ticketId: string,
    message: string,
    senderType: string,
    offset: number,
  ) => ({
    id,
    ticketId,
    message,
    senderType,
    senderId: senderType === 'user' ? 'customer' : STAFF.bat.id,
    created_at: iso(offset),
  })
  return {
    'ticket-1': [
      msg(
        'm-1',
        'ticket-1',
        '<p>Hello, my deposit has not arrived.</p>',
        'user',
        0,
      ),
    ],
    'ticket-2': [
      msg('m-2', 'ticket-2', '<p>My withdrawal seems stuck.</p>', 'user', -1),
      msg(
        'm-3',
        'ticket-2',
        '<p>We are checking, please wait a moment.</p>',
        'support',
        -1,
      ),
    ],
    'ticket-3': [
      msg('m-4', 'ticket-3', '<p>Should I upload the photo again?</p>', 'user', -2),
    ],
    'ticket-4': [
      msg('m-5', 'ticket-4', '<p>I am not receiving the email.</p>', 'user', -5),
      msg('m-6', 'ticket-4', '<p>Please check your spam folder.</p>', 'support', -5),
    ],
  }
}

function macros(): TicketMacroDto[] {
  return [
    {
      id: 1,
      name: 'Greeting',
      value: 'Hello, how can we help you?',
      is_active: true,
    },
    {
      id: 2,
      name: 'Checking',
      value: 'We are reviewing your request, please wait.',
      is_active: true,
    },
    {
      id: 3,
      name: 'Resolved',
      value: 'The issue has been resolved. Thank you.',
      is_active: true,
    },
  ]
}

function cryptoWithdrawals(): CryptoWithdrawalDto[] {
  const row = (
    n: number,
    coin: string,
    network: string,
    amount: number,
    status: number,
    offset: number,
  ): CryptoWithdrawalDto => ({
    id: `cw-${n}`,
    created_at: iso(offset),
    User: customer(n),
    address: `T${'demo'.repeat(8)}${n}`,
    amount,
    receiveAmount: amount - 1,
    coin: { coin },
    network,
    status,
    txnId: status === 1 ? `0xdemo${n}` : undefined,
  })
  return [
    row(1, 'USDT', 'TRC20', 250, 7, 0),
    row(2, 'USDT', 'TRC20', 1200.5, 2, 0),
    row(3, 'USDT', 'ERC20', 80, 1, -1),
    row(4, 'USDT', 'TRC20', 45.25, 5, -2),
  ]
}

function bankDeposits(): BankDepositDto[] {
  const row = (
    n: number,
    amount: number,
    status: string,
    offset: number,
  ): BankDepositDto => ({
    id: `bd-${n}`,
    created_at: iso(offset),
    currency: 'MNT',
    depositAmount: amount,
    txnAmount: amount,
    txnId: `DEMO-BD-${n}`,
    status,
    transferTime: iso(offset),
    User: customer(n),
  })
  return [
    row(1, 500000, 'PENDING', 0),
    row(2, 1250000, 'TRANSFERRED', 0),
    row(3, 300000, 'SOLVED', -1),
    row(4, 75000, 'REFUNDED', -3),
  ]
}

function bankWithdrawals(): BankWithdrawalDto[] {
  const row = (
    n: number,
    total: number,
    status: string,
    offset: number,
  ): BankWithdrawalDto => ({
    id: `bw-${n}`,
    created_at: iso(offset),
    accountNumber: `50000000${n}`,
    Bank: { nameMn: 'Demo Bank' },
    currency: 'MNT',
    feeAmount: 1000,
    receiveAmount: total - 1000,
    totalAmount: total,
    status,
    transferTime: iso(offset),
    User: customer(n),
  })
  return [
    row(1, 200000, 'PENDING', 0),
    row(2, 800000, 'PROCESSING', 0),
    row(3, 150000, 'TRANSFERRED', -1),
    row(4, 60000, 'CANCELLED', -4),
  ]
}

function converts(): ConvertRecordDto[] {
  const row = (
    n: number,
    fromAmount: number,
    toAmount: number,
    status: string,
    offset: number,
  ): ConvertRecordDto => ({
    id: `cv-${n}`,
    UserId: customer(n).id,
    User: customer(n),
    fromAmount,
    fromAsset: 'MNT',
    toAmount,
    toAsset: 'USDT',
    rate: '3450',
    status,
    created_at: iso(offset),
  })
  return [
    row(1, 345000, 100, 'COMPLETED', 0),
    row(2, 1725000, 500, 'FAILED', -1),
    row(3, 69000, 20, 'COMPLETED', -2),
  ]
}

export function createDemoSeed(email: string) {
  return {
    profile: profile(email),
    menus: menus(),
    leaveRequests: leaveRequests(email),
    tasks: tasks(email),
    assignees: assignees(email),
    weeklyReports: weeklyReports(email),
    tickets: tickets(),
    conversations: conversations(),
    macros: macros(),
    cryptoWithdrawals: cryptoWithdrawals(),
    bankDeposits: bankDeposits(),
    bankWithdrawals: bankWithdrawals(),
    converts: converts(),
  }
}

export type DemoSeed = ReturnType<typeof createDemoSeed>
