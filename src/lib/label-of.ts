/**
 * Backend-ийн утгыг (`status`, `type`) орчуулсан шошго руу. Танихгүй утга
 * өөрөөрөө үлдэнэ — шинэ статус нэмэгдсэн ч дэлгэц хоосон болохгүй.
 */
export function labelOf(
  labels: Readonly<Record<string, string>>,
  value: string | undefined,
): string | undefined {
  if (!value) return undefined
  return labels[value] ?? value
}
