import { create } from 'zustand'

import { env } from '@/core/config/env'

import { resetDemoBackend } from './demo-backend'

type DemoState = { active: boolean }

/** Санах ойд л — апп дахин асахад демо горим үргэлж унтраалттай эхэлнэ. */
export const useDemoStore = create<DemoState>(() => ({ active: false }))

export const demoMode = {
  isActive: () => useDemoStore.getState().active,

  /** Имэйл том жижиг үсэг ялгахгүй (Cognito ч ялгадаггүй), нууц үг яг таарна. */
  matches(email: string, password: string): boolean {
    const login = env.demoLogin
    if (!login) return false
    return (
      email.trim().toLowerCase() === login.email.trim().toLowerCase() &&
      password === login.password
    )
  },

  enter(): void {
    resetDemoBackend()
    useDemoStore.setState({ active: true })
  },

  exit(): void {
    useDemoStore.setState({ active: false })
    resetDemoBackend()
  },
}
