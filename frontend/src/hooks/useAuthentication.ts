import { useEffect, useState } from 'react'

import { accessTokenStore, authApi, tokenStorage } from '@/api/apiClient'
import { LocalUser } from '@/context/AuthContext'
import { UserData, UserDataLogin } from '@/interface/UserData'

export const useAuthentication = () => {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [cancelled, setCancelled] = useState<boolean>(false)

  const safeSet = <T>(setter: (v: T) => void) => (value: T) => {
    if (!cancelled) setter(value)
  }

  const createUser = async (data: UserData): Promise<LocalUser> => {
    safeSet(setLoading)(true)
    try {
      const tokenData = await authApi.register({
        displayName: data.user,
        email: data.email,
        password: data.password,
      })
      accessTokenStore.set(tokenData.accessToken)
      tokenStorage.setRefresh(tokenData.refreshToken)
      const apiUser = tokenData.user
      safeSet(setLoading)(false)
      return { id: apiUser.id, uid: apiUser.id, email: apiUser.email, displayName: apiUser.displayName, isAdmin: apiUser.isAdmin ?? false }
    } catch (err: any) {
      const message: string = err.message ?? 'Registration failed'
      safeSet(setError)(message)
      safeSet(setLoading)(false)
      throw err
    }
  }

  const login = async (data: UserDataLogin): Promise<LocalUser> => {
    safeSet(setLoading)(true)
    try {
      const tokenData = await authApi.login({ email: data.user, password: data.password })
      accessTokenStore.set(tokenData.accessToken)
      tokenStorage.setRefresh(tokenData.refreshToken)
      const apiUser = tokenData.user
      safeSet(setLoading)(false)
      return { id: apiUser.id, uid: apiUser.id, email: apiUser.email, displayName: apiUser.displayName, isAdmin: apiUser.isAdmin ?? false }
    } catch (err: any) {
      const message: string = err.message ?? 'Login failed'
      safeSet(setError)(message)
      safeSet(setLoading)(false)
      throw err
    }
  }

  const logout = async () => {
    const refresh = tokenStorage.getRefresh()
    if (refresh) {
      await authApi.logout(refresh).catch(() => {})
    }
    accessTokenStore.set(null)
    tokenStorage.clearRefresh()
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { createUser, error, loading, logout, login }
}
