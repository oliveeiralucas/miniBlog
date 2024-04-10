import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth'
import { useEffect, useState } from 'react'

import { UserData, UserDataLogin } from '@/interface/UserData'
import { getErrorMessage } from '@/utils/ErrorHandling'

export const useAuthentication = () => {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  //anti vazamento de memória
  const [cancelled, setCancelled] = useState<boolean>(false)

  const auth: Auth = getAuth()

  function checkIsCancelled() {
    if (cancelled) {
      return
    }
  }

  const createUser = async (data: UserData) => {
    checkIsCancelled()

    setLoading(true)

    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, data.email, data.password)

      const user: User = userCredential.user

      await updateProfile(user, { displayName: data.user })

      setLoading(false)

      return user
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      reportError(errorMessage)
      setLoading(false)
      throw error
    }
  }

  //metodo logout
  const logout = () => {
    checkIsCancelled()
    signOut(auth)
  }

  //metodo login
  const login = async (data: UserDataLogin) => {
    checkIsCancelled()

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, data.user, data.password)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setError(errorMessage)
      reportError(errorMessage)
      throw error
    }
    setLoading(false)
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login
  }
}
