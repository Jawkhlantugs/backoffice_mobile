/**
 * Tailwind class-уудыг нэгтгэнэ. `tailwind-merge` ашиглаагүй — NativeWind
 * дээр сүүлийн class аль хэдийн давамгайлдаг тул нэмэлт хамаарал шаардлагагүй.
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
