import { isOfficePrivileged } from '../privileges'

const base = { id: '1', email: 'a@x.mn', menu: { teams: [] } as never }

describe('isOfficePrivileged', () => {
  it('группын id 4 эсвэл Super Admin / Directors', () => {
    expect(isOfficePrivileged({ ...base, adminGroupId: '4' })).toBe(true)
    expect(isOfficePrivileged({ ...base, adminGroupName: 'Directors' })).toBe(true)
    expect(isOfficePrivileged({ ...base, adminGroupName: 'Support' })).toBe(false)
    expect(isOfficePrivileged(null)).toBe(false)
  })
})
