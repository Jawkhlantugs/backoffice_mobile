import { toOperationAccounts } from '../operation-account-dto'

describe('operation account dto', () => {
  it('давхардсан subAccountId-аас эхнийхийг үлдээж, хоосныг хасна', () => {
    const accounts = toOperationAccounts([
      { subAccountId: '3970778697251181056', name: 'Main' },
      { subAccountId: '3970778697251181056', name: 'Main (copy)' },
      { subAccountId: '' },
      { subAccountId: '787107359' },
    ])
    expect(accounts).toEqual([
      { subAccountId: '3970778697251181056', name: 'Main' },
      { subAccountId: '787107359', name: '787107359' },
    ])
  })
})
