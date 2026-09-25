import { unwrap, unwrapList, unwrapObject } from '../envelope'

describe('unwrap — 4 өөр дугтуй', () => {
  it('backoffice { message, body }', () => {
    expect(unwrap({ message: 'ok', body: { id: '1' } })).toEqual({ id: '1' })
  })

  it('finance { code, message, data }', () => {
    expect(unwrap({ code: 0, message: 'ok', data: { id: '1' } })).toEqual({
      id: '1',
    })
  })

  it('futures / ws { msg, data }', () => {
    expect(unwrap({ msg: 'ok', data: { token: 'abc' } })).toEqual({
      token: 'abc',
    })
  })

  it('дугтуйгүй хариуг хэвээр нь өгнө', () => {
    expect(unwrap({ id: '1' })).toEqual({ id: '1' })
  })
})

describe('unwrap — татгалзал', () => {
  it('code 0 биш бол HTTP 200 байсан ч алдаа', () => {
    // Вэб админ яг ийм шалгалт хийдэг (order-mnt.service.ts).
    expect(() => unwrap({ code: 1, msg: 'Insufficient balance' })).toThrow(
      expect.objectContaining({ kind: 'api', code: 1 }),
    )
  })

  it('серверийн мессежийг хадгална — хэрэглэгчид хэрэгтэй', () => {
    try {
      unwrap({ code: 500, message: 'Master balance too low' })
      throw new Error('шидэх ёстой байсан')
    } catch (error) {
      expect(error).toMatchObject({ message: 'Master balance too low' })
    }
  })

  it('code 0 нь амжилт', () => {
    expect(unwrap({ code: 0, data: [1, 2] })).toEqual([1, 2])
  })
})

describe('unwrapList — items / list / массив', () => {
  it('body.items (backoffice pagination)', () => {
    const page = unwrapList(
      { body: { total: 42, items: [{ id: '1' }] } },
      'ticket',
    )
    expect(page.items).toHaveLength(1)
    expect(page.total).toBe(42)
  })

  it('data.list (support)', () => {
    expect(
      unwrapList({ data: { list: [{ id: '1' }] } }, 'message').items,
    ).toHaveLength(1)
  })

  it('lastEvaluatedKey — DynamoDB cursor', () => {
    const page = unwrapList(
      { data: { list: [], lastEvaluatedKey: 'cursor-1' } },
      'transfer',
    )
    expect(page.lastEvaluatedKey).toBe('cursor-1')
    expect(page.total).toBeUndefined()
  })

  it('шууд массив', () => {
    expect(unwrapList([{ id: '1' }], 'macro').items).toHaveLength(1)
  })

  it('массив олдохгүй бол чангаар унана', () => {
    // Чимээгүй хоосон жагсаалт буцаах нь "өгөгдөл алга" гэж худал хэлнэ.
    expect(() => unwrapList({ body: { rows: [] } }, 'ticket')).toThrow(
      expect.objectContaining({ kind: 'parse' }),
    )
  })
})

describe('unwrapObject', () => {
  it('объект биш бол parse алдаа', () => {
    expect(() => unwrapObject({ body: 'text' }, 'user')).toThrow(
      expect.objectContaining({ kind: 'parse' }),
    )
    expect(() => unwrapObject({ body: [1] }, 'user')).toThrow(
      expect.objectContaining({ kind: 'parse' }),
    )
  })
})
