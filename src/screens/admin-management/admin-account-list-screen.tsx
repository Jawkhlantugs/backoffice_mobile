import { useState } from 'react'

import { PagedListScreen, type RecordView } from '@/components'
import {
  ADMIN_ACCOUNT_ENABLED,
  type AdminAccount,
} from '@/data/admin-management/admin-management-model'
import { isSuperAdmin } from '@/core/session/privileges'
import { useSessionStore } from '@/core/session/session-store'
import {
  useAdminAccounts,
  useResetAdminPassword,
  useSetAdminAccess,
} from '@/hooks/use-admin-management'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.adminManagement
const f = text.fields
const ALL = 'all'

/**
 * Админ хэрэглэгчид. Нууц үг сэргээх, хандалт хаах/нээх нь вэбтэй ижил
 * Super Admin-д л; өөрийгөө хаах боломжгүй.
 */
export function AdminAccountListScreen() {
  const me = useSessionStore((state) => state.user)
  const [search, setSearch] = useState('')
  const [enabled, setEnabled] = useState<string>(ALL)
  const list = useAdminAccounts(search, {
    isEnabled: enabled === ALL ? undefined : enabled,
  })
  const reset = useResetAdminPassword()
  const access = useSetAdminAccess()
  const canManage = isSuperAdmin(me)

  function toRecord(item: AdminAccount): RecordView {
    const self = me?.id === item.id
    return {
      title: item.email || item.id,
      subtitle: item.group,
      status: {
        label: item.isEnabled
          ? text.enabledChips.true
          : text.enabledChips.false,
        tone: item.isEnabled ? 'success' : 'danger',
      },
      fields: [
        { label: f.group, value: item.group },
        { label: f.department, value: item.department },
        { label: f.status, value: item.status },
        { label: f.createdAt, value: formatDate(item.createdAt) },
      ],
      details: [
        { label: f.id, value: item.id },
        {
          label: f.userCreateDate,
          value: item.userCreateDate
            ? formatDate(item.userCreateDate)
            : undefined,
        },
      ],
      actions: [
        {
          key: 'reset-password',
          label: text.resetPassword,
          icon: 'key',
          hidden: !canManage || !item.isEnabled,
          confirm: {
            title: text.resetPasswordTitle,
            description: `${item.email} · ${text.resetPasswordHint}`,
          },
          run: () => reset.mutateAsync(item.id),
        },
        {
          key: 'access',
          label: item.isEnabled ? text.suspend : text.reactivate,
          icon: item.isEnabled ? 'lock' : 'unlock',
          destructive: item.isEnabled,
          hidden: !canManage || (self && item.isEnabled),
          confirm: {
            title: item.isEnabled ? text.suspendTitle : text.reactivateTitle,
            description: item.email,
          },
          run: () =>
            access.mutateAsync({ uid: item.id, isEnabled: !item.isEnabled }),
        },
      ],
    }
  }

  return (
    <PagedListScreen
      title={text.accounts.title}
      subtitle={text.accounts.subtitle}
      list={list}
      keyExtractor={(item) => item.id}
      emptyIcon="admin"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: text.emailPlaceholder,
      }}
      statusChips={{
        chips: [
          { value: ALL, label: messages.common.all },
          ...ADMIN_ACCOUNT_ENABLED.map((value) => ({
            value,
            label: text.enabledChips[value],
          })),
        ],
        value: enabled,
        onChange: setEnabled,
      }}
      tableLabels={{ title: f.email }}
      record={toRecord}
    />
  )
}
