import { toJobApplication } from '../career-dto'

describe('career dto', () => {
  it('нэрийг нийлүүлж, тэмдэглэлийг тоолно', () => {
    expect(
      toJobApplication({
        id: 'a',
        firstName: 'Сараа',
        lastName: 'Б',
        notes: [{}, {}],
      }),
    ).toMatchObject({ name: 'Сараа Б', notes: 2 })
  })
})
