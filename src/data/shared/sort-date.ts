/** Hook-ийн `start_day`/`end_day` → вэбийн `useFilterParams`-ийн `sortDate`. */
export function withSortDate<
  T extends { start_day?: string; end_day?: string },
>({ start_day, end_day, ...rest }: T) {
  return {
    ...rest,
    sortDate: start_day && end_day ? { start_day, end_day } : undefined,
  }
}
