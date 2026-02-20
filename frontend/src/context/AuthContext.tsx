import { createContext, ReactNode, useContext } from 'react'

/**
 * Local user type that replaces Firebase's User object.
 *
 * The `uid` field is an alias for `id` to maintain backwards compatibility
 * with existing page components that reference `user?.uid`.
 */
export interface LocalUser {
  id: string
  /** Alias for `id` — keeps existing `user?.uid` references working */
  uid: string
  email: string
  displayName: string
  isAdmin: boolean
}

type AuthValueType = {
  user: LocalUser | null | undefined
  setUser: (user: LocalUser | null) => void
}

const AuthContext = createContext<AuthValueType | undefined>(undefined)

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode
  value: AuthValueType
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthValue(): AuthValueType {
  const contextValue = useContext(AuthContext)
  if (contextValue === undefined) {
    throw new Error('useAuthValue must be used within an AuthProvider')
  }
  return contextValue
}
