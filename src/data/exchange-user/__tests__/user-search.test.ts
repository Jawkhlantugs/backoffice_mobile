import { exchangeUserRepository } from '../exchange-user-repository'
import { resolveUserSearch, withUserSearch } from '../user-search'

jest.mock('../exchange-user-repository', () => ({
  exchangeUserRepository: { list: jest.fn() },
}))

const list = exchangeUserRepository.list as jest.Mock

beforeEach(() => {
  list.mockReset()
  list.mockResolvedValue({
    items: [
      { id: 'u-2', email: 'bold.bat@x.mn', subAccountId: 's-2' },
      { id: 'u-1', email: 'Bold@x.mn', subAccountId: 's-1' },
    ],
  })
})

describe('resolveUserSearch', () => {
  it('имэйл биш утгыг өөрчлөхгүй, хүсэлт явуулахгүй', async () => {
    await expect(resolveUserSearch('u-1')).resolves.toBe('u-1')
    await expect(resolveUserSearch(undefined)).resolves.toBeUndefined()
    expect(list).not.toHaveBeenCalled()
  })

  it('яг таарсан имэйлийн ID-г том жижиг үсэг харгалзахгүй олно', async () => {
    await expect(resolveUserSearch('bold@X.mn')).resolves.toBe('u-1')
    await expect(resolveUserSearch('bold@x.mn', 'subAccountId')).resolves.toBe(
      's-1',
    )
  })

  it('хэсэгчлэн таарсан хэрэглэгчийг авахгүй', async () => {
    await expect(resolveUserSearch('bat@x.mn')).resolves.toBeNull()
  })
})

describe('withUserSearch', () => {
  it('олдоогүй имэйлд endpoint дуудахгүй, хоосон хуудас буцаана', async () => {
    const fetchPage = jest.fn()
    const page = await withUserSearch(fetchPage)({ query: 'none@x.mn' })
    expect(page.items).toEqual([])
    expect(fetchPage).not.toHaveBeenCalled()
  })

  it('имэйлийг ID болгож дамжуулна', async () => {
    const fetchPage = jest.fn().mockResolvedValue({ items: [] })
    await withUserSearch(fetchPage)({ query: 'bold@x.mn', limit: 20 })
    expect(fetchPage).toHaveBeenCalledWith({ query: 'u-1', limit: 20 })
  })
})
