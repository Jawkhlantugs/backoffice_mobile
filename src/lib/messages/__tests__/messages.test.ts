import AsyncStorage from '@react-native-async-storage/async-storage'

import { en } from '../en'
import { messages, translateError, useLanguageStore } from '../index'
import { mn } from '../mn'

function keyPaths(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keyPaths(child as object, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

afterEach(() => useLanguageStore.setState({ language: 'en' }))

describe('dictionaries', () => {
  it('англи, монгол хоёр яг ижил түлхүүртэй', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(mn).sort())
  })

  it('англи орчуулгад хоосон текст байхгүй', () => {
    const empty = keyPaths(en).filter((path) => {
      const value = path
        .split('.')
        .reduce<unknown>(
          (node, key) => (node as Record<string, unknown>)[key],
          en,
        )
      return value === ''
    })
    expect(empty).toEqual([])
  })
})

describe('messages', () => {
  it('анхдагч хэл нь англи', () => {
    expect(useLanguageStore.getState().language).toBe('en')
    expect(messages.common.retry).toBe('Retry')
  })

  it('модулийн түвшинд барьсан объект ч хэл солиход шинэ хэлээр уншигдана', () => {
    const fields = messages.finance.fields
    expect(fields.amount).toBe('Amount')

    useLanguageStore.setState({ language: 'mn' })
    expect(fields.amount).toBe('Дүн')
  })

  it('объектын түлхүүрийг жагсааж, index-ээр уншиж болно', () => {
    expect(Object.keys(messages.leave.statuses)).toEqual([
      'PENDING',
      'APPROVED',
      'REJECTED',
    ])
    expect('PENDING' in messages.leave.statuses).toBe(true)
  })

  it('алдааны текст идэвхтэй хэлээр гарна', () => {
    const offline = {
      kind: 'network',
      reason: 'offline',
      debugMessage: '',
    } as const
    expect(translateError(offline)).toBe(en.errors.offline)

    useLanguageStore.setState({ language: 'mn' })
    expect(translateError(offline)).toBe(mn.errors.offline)
  })
})

describe('useLanguageStore', () => {
  it('сонголтыг хадгалж, дараа нь сэргээнэ', async () => {
    await useLanguageStore.getState().set('mn')
    useLanguageStore.setState({ language: 'en' })

    await useLanguageStore.getState().restore()
    expect(useLanguageStore.getState().language).toBe('mn')
  })

  it('хадгалсан утга буруу бол англи руу буцна', async () => {
    await AsyncStorage.setItem('language', 'fr')
    await useLanguageStore.getState().restore()
    expect(useLanguageStore.getState().language).toBe('en')
  })
})
