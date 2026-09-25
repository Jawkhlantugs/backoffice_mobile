/**
 * DynamoDB `lastEvaluatedKey` нь объект — hook/query key-д string хэлбэрээр
 * явж, endpoint руу буцааж объект болно (вэбийн `JSON.parse` логик).
 */
export function encodeCursor(key: unknown): string | undefined {
  if (key === undefined || key === null) return undefined
  if (typeof key === 'string') return key || undefined
  if (typeof key === 'object' && Object.keys(key).length === 0) return undefined
  return JSON.stringify(key)
}

export function decodeCursor(cursor: string | undefined): unknown {
  if (!cursor) return undefined
  try {
    return JSON.parse(cursor)
  } catch {
    return { value: cursor }
  }
}
