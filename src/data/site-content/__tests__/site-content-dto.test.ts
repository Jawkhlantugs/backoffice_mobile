import {
  toActive,
  toHeadConfig,
  toNewsArticle,
  toWithdrawalLimit,
} from '../site-content-dto'

describe('site content dto', () => {
  it('footer is_active-ийн бүх хэлбэрийг уншина', () => {
    expect([true, 1, '1'].map((v) => toActive(v as true))).toEqual([
      true,
      true,
      true,
    ])
    expect([false, 0, '0', undefined].map((v) => toActive(v as false))).toEqual(
      [false, false, false, false],
    )
  })

  it('татах хязгаарыг number биш мөрөөр хадгална', () => {
    expect(
      toWithdrawalLimit({ bank: { min: 1000, limit: 35000000 }, crypto: {} }),
    ).toMatchObject({ bankMin: '1000', bankLimit: '35000000', cryptoLimit: '' })
  })

  it('head config-ийн meta/link/script-ийг тоолно', () => {
    expect(
      toHeadConfig({ pk: 'a', route: '/', meta: [{}, {}], links: [{}] }),
    ).toMatchObject({ metaCount: 2, linkCount: 1, scriptCount: 0 })
  })

  it('мэдээний статус active-аас бусад нь inactive (вэбтэй ижил)', () => {
    expect(toNewsArticle({ id: '1', status: 'draft' }).status).toBe('inactive')
    expect(toNewsArticle({ id: '1', category: 'NEWS' }).category).toBe('news')
  })
})
