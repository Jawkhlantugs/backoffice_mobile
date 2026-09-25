import { stripHtml, wrapAsHtmlParagraph } from '../html'

describe('wrapAsHtmlParagraph', () => {
  it('текстийг <p> tag-аар ороож, тусгай тэмдэгтийг escape хийнэ', () => {
    expect(wrapAsHtmlParagraph('Сайн байна уу')).toBe('<p>Сайн байна уу</p>')
    expect(wrapAsHtmlParagraph('<script>')).toBe('<p>&lt;script&gt;</p>')
  })
})

describe('stripHtml', () => {
  it('tag-ийг арилгаад, энгийн entity-г цэвэрлэнэ', () => {
    expect(stripHtml('<p>Сайн байна уу</p>')).toBe('Сайн байна уу')
    expect(stripHtml('<p>A &amp; B</p>')).toBe('A & B')
  })
})
