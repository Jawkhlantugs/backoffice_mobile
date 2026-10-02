import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Амжилттай болмогц тухайн жагсаалтын query-г дахин татдаг mutation —
 * батлах/татгалзах товч бүр ижил хэв маягтай. Алдааны toast нь
 * `MutationCache`-аас (query-client.ts).
 */
export function useInvalidatingMutation<V>(
  key: string,
  run: (vars: V) => Promise<unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: run,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [key] })
    },
  })
}
