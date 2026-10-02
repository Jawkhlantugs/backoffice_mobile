import { useState } from 'react'

import {
  QueryListScreen,
  SegmentedControl,
  type RecordView,
} from '@/components'
import type {
  AdminPermission,
  AdminRoleGroup,
} from '@/data/admin-management/admin-management-model'
import {
  useAdminPermissions,
  useAdminRoleGroups,
} from '@/hooks/use-admin-management'
import { formatDate } from '@/lib/date'
import { messages } from '@/lib/messages'

const text = messages.adminManagement
const f = text.fields

type Tab = 'groups' | 'permissions'

function groupRecord(item: AdminRoleGroup): RecordView {
  return {
    title: item.name,
    subtitle: `${item.permissions.length} ${f.permissions.toLowerCase()}`,
    fields: [
      { label: f.id, value: item.id },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [{ label: f.permissions, value: item.permissions.join('\n') }],
  }
}

function permissionRecord(item: AdminPermission): RecordView {
  return {
    title: item.name,
    subtitle: item.description,
    fields: [
      { label: f.description, value: item.description },
      { label: f.createdAt, value: formatDate(item.createdAt) },
    ],
    details: [{ label: f.id, value: item.id }],
  }
}

/** Вэбийн "Roles" — бүлэг ба системийн эрх хоёр жагсаалт нэг дэлгэцэнд. */
export function AdminRoleScreen() {
  const [tab, setTab] = useState<Tab>('groups')
  const groups = useAdminRoleGroups()
  const permissions = useAdminPermissions()

  const tabs = (
    <SegmentedControl
      options={[
        { value: 'groups', label: text.tabs.groups },
        { value: 'permissions', label: text.tabs.permissions },
      ]}
      value={tab}
      onChange={setTab}
    />
  )

  return tab === 'groups' ? (
    <QueryListScreen
      title={text.roles.title}
      subtitle={text.roles.subtitle}
      query={groups}
      keyExtractor={(item) => item.id}
      emptyIcon="shield"
      searchText={(item) => item.name}
      searchPlaceholder={text.searchPlaceholder}
      filters={tabs}
      tableLabels={{ title: f.name }}
      record={groupRecord}
    />
  ) : (
    <QueryListScreen
      title={text.roles.title}
      subtitle={text.roles.subtitle}
      query={permissions}
      keyExtractor={(item) => item.id}
      emptyIcon="key"
      searchText={(item) => `${item.name} ${item.description ?? ''}`}
      searchPlaceholder={text.searchPlaceholder}
      filters={tabs}
      tableLabels={{ title: f.name }}
      record={permissionRecord}
    />
  )
}
