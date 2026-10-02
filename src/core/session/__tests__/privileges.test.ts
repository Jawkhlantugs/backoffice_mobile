import { isOfficePrivileged, isSuperAdmin } from '../privileges'

const base = { id: '1', email: 'a@x.mn', menu: { teams: [] } as never }

describe('isOfficePrivileged', () => {
  it('группын id 4 эсвэл Super Admin / Directors', () => {
    expect(isOfficePrivileged({ ...base, adminGroupId: '4' })).toBe(true)
    expect(isOfficePrivileged({ ...base, adminGroupName: 'Directors' })).toBe(
      true,
    )
    expect(isOfficePrivileged({ ...base, adminGroupName: 'Support' })).toBe(
      false,
    )
    expect(isOfficePrivileged(null)).toBe(false)
  })
})

describe('isSuperAdmin', () => {
  it('группын id 4 эсвэл Super Admin — Directors биш', () => {
    expect(isSuperAdmin({ ...base, adminGroupId: '4' })).toBe(true)
    expect(isSuperAdmin({ ...base, adminGroupName: 'Super Admin' })).toBe(true)
    expect(isSuperAdmin({ ...base, adminGroupName: 'Directors' })).toBe(false)
    expect(isSuperAdmin(undefined)).toBe(false)
  })
})
