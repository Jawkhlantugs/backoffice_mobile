import type { Href } from 'expo-router'

import { messages } from '@/lib/messages'

/**
 * Вэб админы цэсний зам → mobile-ийн route.
 *
 * Түлхүүр нь `/admin/admin-menus/my`-аас ирдэг `path` — өөрөөр хэлбэл
 * ажилтны вэб дээр дардаг яг тэр мөр. Энд байхгүй мөр нь mobile дээр хараахан
 * хийгдээгүй гэсэн үг: цэсэнд харагдана, гэхдээ идэвхгүй (§1.7 — байхгүй
 * үйлдлийг ажиллахаар харуулахгүй).
 */
export const LEAVE_MENU_PATH = '/office/leave-request'
export const SUPPORT_TICKETS_MENU_PATH = '/portal/support/tickets'
export const TAKE_ACTION_LIST_MENU_PATH = '/portal/take-action/take-action-list'
export const USER_TAKE_ACTION_LIST_MENU_PATH =
  '/portal/take-action/user-take-action-list'
/** `order-usdt.service.ts`-тэй нэрээрээ таарч байгаа цорын ганц route. */
export const ORDER_USDT_MENU_PATH = '/portal/order-mnt/usdt-mnt'
// ⚠️ `order-mnt/list` endpoint-той нийцэх веб зам тодорхойгүй хэвээр байна
// (`/portal/order-mnt/ihc-mnt`, `/match-usdt-mnt`, `/match-ihc-mnt` эдгээрийн
// аль нь болохыг вэб кодоос баталгаажуулаагүй — §1.7-ийн дагуу таамаглаагүй).
// Тодорхой болмогц энд нэмнэ; тэртэй хүртэл `/finance/order-mnt` дэлгэц зөвхөн
// шууд холбоосоор хүрнэ.

export const CONVERT_MENU_PATH = '/portal/convert'
export const CRYPTO_DEPOSIT_USERS_MENU_PATH = '/portal/crypto/deposit'
export const CRYPTO_DEPOSIT_OPERATIONS_MENU_PATH =
  '/portal/crypto/deposit-operations'
export const CRYPTO_WITHDRAWAL_MENU_PATH = '/portal/crypto/withdrawal'
export const CRYPTO_WITHDRAW_TRANSFERS_MENU_PATH =
  '/portal/crypto/withdraw-transfers'
export const CRYPTO_FAILED_WITHDRAWALS_MENU_PATH =
  '/portal/crypto/failed-withdrawals'
export const CRYPTO_BLOCKED_WALLETS_MENU_PATH = '/portal/crypto/blocked-wallets'
export const BANK_DEPOSITS_MENU_PATH = '/portal/bank/deposit'
export const BANK_WITHDRAWALS_MENU_PATH = '/portal/bank/withdrawal'
export const BANK_EXCHANGE_TXN_TASK_MENU_PATH = '/portal/bank/exchange-txn-task'
// ⚠️ Нэрээр таарсан цорын ганц зам (`exchange-txn`, "-task"-гүй) —
// `exchange-bank-txn` endpoint-той 100% баталгаажаагүй, зөвшөөрлийн жагсаалтад
// ямар нэр харагдахыг харж баталгаажуулна.
export const BANK_EXCHANGE_BANK_TXN_MENU_PATH = '/portal/bank/exchange-txn'
export const BUYNOW_ORDERS_MENU_PATH = '/portal/buynow'
export const PUSH_NOTIFICATION_MENU_PATH = '/portal/mobile/push-notification'
export const COMPLIANCE_CASES_MENU_PATH = '/portal/compliance/cases'
export const USER_INFORMATION_MENU_PATH = '/portal/user-information'
/** User Transfer ба SubAccount Transfer — mobile-д нэг дэлгэц, MNT/Crypto сонголттой. */
export const USER_TRANSFER_MENU_PATH =
  '/portal/exchange-management/mnt-transfer'
export const SUB_TRANSFER_MENU_PATH = '/portal/exchange-management/sub-transfer'
export const FUTURES_MASTER_RISK_MENU_PATH = '/futures/master-risk'
export const FUTURES_TRANSFER_REQUESTS_MENU_PATH = '/futures/transfer-requests'

export const MOBILE_ROUTES: Record<string, Href> = {
  [LEAVE_MENU_PATH]: '/leave',
  [SUPPORT_TICKETS_MENU_PATH]: '/support',
  [TAKE_ACTION_LIST_MENU_PATH]: '/take-action',
  [USER_TAKE_ACTION_LIST_MENU_PATH]: '/take-action/responses',
  [ORDER_USDT_MENU_PATH]: '/finance/order-usdt',
  [CONVERT_MENU_PATH]: '/finance/convert',
  [CRYPTO_DEPOSIT_USERS_MENU_PATH]: '/finance/crypto-deposit-users',
  [CRYPTO_DEPOSIT_OPERATIONS_MENU_PATH]: '/finance/crypto-deposit-operations',
  [CRYPTO_WITHDRAWAL_MENU_PATH]: '/finance/crypto-withdrawal',
  [CRYPTO_WITHDRAW_TRANSFERS_MENU_PATH]: '/finance/crypto-withdraw-transfers',
  [CRYPTO_FAILED_WITHDRAWALS_MENU_PATH]: '/finance/crypto-failed-withdrawals',
  [CRYPTO_BLOCKED_WALLETS_MENU_PATH]: '/finance/crypto-blocked-wallets',
  [BANK_DEPOSITS_MENU_PATH]: '/finance/bank-deposits',
  [BANK_WITHDRAWALS_MENU_PATH]: '/finance/bank-withdrawals',
  [BANK_EXCHANGE_TXN_TASK_MENU_PATH]: '/finance/bank-exchange-txn-task',
  [BANK_EXCHANGE_BANK_TXN_MENU_PATH]: '/finance/bank-exchange-bank-txn',
  [BUYNOW_ORDERS_MENU_PATH]: '/finance/buynow-orders',
  [PUSH_NOTIFICATION_MENU_PATH]: '/notifications',
  [COMPLIANCE_CASES_MENU_PATH]: '/compliance/cases',
  [USER_INFORMATION_MENU_PATH]: '/users',
  [USER_TRANSFER_MENU_PATH]: '/transfer',
  [SUB_TRANSFER_MENU_PATH]: '/transfer',
  [FUTURES_MASTER_RISK_MENU_PATH]: '/futures',
  '/office/tasks': '/office/tasks',
  '/office/weekly-task': '/office/weekly-reports',
  '/portal/mobile/banners': '/mobile/banners',
  '/portal/mobile/app-versions': '/mobile/versions',
  // Зөвхөн харах жагсаалтууд — вэбийн route файлын замаар.
  '/portal/stake/user-stake-list': '/stake/users',
  '/portal/stake/asset': '/stake/assets',
  '/portal/stake/contract': '/stake/contracts',
  '/portal/user-management/balance-snapshots': '/users/balance-snapshots',
  '/portal/user-management/kyc-info': '/users/kyc-info',
  '/portal/spot/orders': '/spot/orders',
  '/portal/spot/history': '/spot/history',
  '/portal/spot/trade-history': '/spot/trade-history',
  '/portal/spot/commissions': '/spot/commissions',
  '/portal/spot/symbols': '/spot/symbols',
  '/portal/internal-transaction/transactions': '/internal/transactions',
  '/portal/internal-transaction/transaction-records': '/internal/records',
  '/portal/internal-transaction/balances': '/internal/balances',
  '/futures/users': '/futures/users',
  '/futures/closed-positions': '/futures/closed-positions',
  '/portal/bank/wallets': '/finance/bank-wallets',
  '/portal/bank/exchange-wallets': '/finance/bank-exchange-wallets',
  '/portal/bank/balance-transactions': '/finance/bank-balance-transactions',
  '/portal/crypto/coins': '/finance/crypto-coins',
  '/portal/crypto/wallet-address': '/finance/crypto-wallet-addresses',
  '/portal/crypto/withdraw-bans': '/finance/crypto-withdraw-bans',
  '/portal/crypto/delisted-transfers': '/finance/crypto-delisted-transfers',
  '/portal/admin-management/activity-log': '/admin/activity-log',
  '/portal/exchange-management/operation-accounts': '/admin/operation-accounts',

  [FUTURES_TRANSFER_REQUESTS_MENU_PATH]: '/futures/transfers',
}

export function routeForMenu(path: string | undefined): Href | null {
  if (!path) return null
  return MOBILE_ROUTES[path] ?? null
}

export type TeamInfo = { key: string; name: string; description: string }

/** Цэс огт ирээгүй үеийн баг — вэбийн `team-store.ts`-тэй ижил. */
export const DEFAULT_TEAM_KEY = 'portal'

/** Вэбийн баг сонгогчтой ижил нэр, тайлбар (`stores/team-store.ts`). */
const team = (
  key: keyof typeof messages.nav.teams,
  name: string,
): TeamInfo => ({
  key,
  name,
  get description() {
    return messages.nav.teams[key]
  },
})

export const TEAMS: readonly TeamInfo[] = [
  team('portal', 'Portal'),
  team('office', 'Office'),
  team('partner', 'Partner'),
  team('futures', 'Futures'),
]

export function teamInfo(key: string): TeamInfo {
  return (
    TEAMS.find((team) => team.key === key) ?? {
      key,
      name: key,
      description: '',
    }
  )
}
