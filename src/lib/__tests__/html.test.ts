import { stripHtml, wrapAsHtmlParagraphs } from '../html'

describe('wrapAsHtmlParagraphs', () => {
  it('текстийг <p> tag-аар ороож, тусгай тэмдэгтийг escape хийнэ', () => {
    expect(wrapAsHtmlParagraphs('Сайн байна уу')).toBe('<p>Сайн байна уу</p>')
    expect(wrapAsHtmlParagraphs('<script>')).toBe('<p>&lt;script&gt;</p>')
  })

  it('мөр бүрийг тусдаа <p> болгоно', () => {
    expect(wrapAsHtmlParagraphs('a\n\nb')).toBe('<p>a</p><p></p><p>b</p>')
  })
})

describe('stripHtml', () => {
  it('tag-ийг арилгаад, энгийн entity-г цэвэрлэнэ', () => {
    expect(stripHtml('<p>Сайн байна уу</p>')).toBe('Сайн байна уу')
    expect(stripHtml('<p>A &amp; B &quot;C&quot; &#39;D&#39;</p>')).toBe(
      'A & B "C" \'D\'',
    )
  })

  it('догол мөр, <br>-ийг мөр шилжилт болгож, хоосон мөрийг шахна', () => {
    expect(
      stripHtml('<p>a</p><p></p><p>b<br>c</p><p></p><p></p><p>d</p>'),
    ).toBe('a\n\nb\nc\n\nd')
  })

  it('wrapAsHtmlParagraphs-ийн эсрэг үйлдэл', () => {
    const text = 'Сайн уу\n\n<A & B>'
    expect(stripHtml(wrapAsHtmlParagraphs(text))).toBe(text)
  })
})
