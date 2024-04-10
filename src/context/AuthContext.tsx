import { User } from 'firebase/auth'
import { createContext, ReactNode, useContext } from 'react'

type AuthValueType = {
  user: User | null | undefined
}

const AuthContext = createContext<AuthValueType | undefined>(undefined)

export function AuthProvider({
  children,
  value
}: {
  children: ReactNode
  value: AuthValueType
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthValue(): AuthValueType | undefined {
  const contextValue = useContext(AuthContext)
  if (contextValue === undefined) {
    throw new Error('useAuthValue must be used within an AuthProvider')
  }
  return contextValue
}
