/**
 * Ticket харилцан яриа HTML контенттой (`<p>…</p>`). Бүрэн HTML renderer
 * нэмэлт сан шаарддаг тул хамгийн бага хувилбар: илгээхдээ ороож, уншихдаа
 * tag-ийг цэвэрлэнэ (`MOBILE_SCOPE_RESEARCH.md` §2.2).
 */

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

// Догол мөр төгсгөдөг tag — вэбийн Tiptap мөр бүрийг `<p>` болгодог.
const LINE_BREAK_TAG = /<br\s*\/?>|<\/(p|div|li|h[1-6]|blockquote)>/gi

function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (char) => ESCAPE_MAP[char] ?? char)
}

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, body: string) => {
    if (body.startsWith('#')) {
      const hex = body[1]?.toLowerCase() === 'x'
      const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10)
      return Number.isNaN(code) ? entity : String.fromCodePoint(code)
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? entity
  })
}

/** Мөр бүрийг `<p>` болгоно — вэб дээр мөр шилжилт алдагдахгүй. */
export function wrapAsHtmlParagraphs(text: string): string {
  return text
    .split('\n')
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')
}

/** HTML-ийг энгийн текст болгоно — догол мөрийг мөр шилжилтээр хадгална. */
export function stripHtml(html: string): string {
  const text = decodeEntities(
    html.replace(LINE_BREAK_TAG, '\n').replace(/<[^>]*>/g, ''),
  )
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
