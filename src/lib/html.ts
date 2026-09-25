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

function escapeHtml(text: string): string {
  return text.replace(/[&<>]/g, (char) => ESCAPE_MAP[char] ?? char)
}

export function wrapAsHtmlParagraph(text: string): string {
  return `<p>${escapeHtml(text)}</p>`
}

/** HTML tag-ийг арилгаад, entity-г цэвэрлэнэ — зөвхөн харуулахад. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}
