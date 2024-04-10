// LoginForm.tsx
import 'primereact/resources/themes/lara-light-cyan/theme.css'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuthentication } from '@/hooks/useAuthentication'
import { UserDataLogin } from '@/interface/UserData'

const LoginForm: React.FC = () => {
  const [user, setUser] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const { login, error: authError, loading } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    const userCredential: UserDataLogin = {
      user,
      password
    }

    await login(userCredential)
  }
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  return (
    <div className="w-8/12">
      <h2 className="py-2 text-left text-2xl font-semibold text-gray-500">
        Entrar no <span className="text-blue-600">Blog</span>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col pt-2 text-xs font-semibold sm:text-sm">
          <InputText
            type="text"
            id="user"
            name="user"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>

        <div className="flex flex-col pt-5 text-xs font-semibold sm:text-sm">
          <InputText
            type="password"
            id="password"
            name="password"
            value={password}
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>

        <div className="flex py-2 text-xs text-gray-500 lg:text-sm">
          Não possui conta?
          <span className="pl-1">
            <p className="text-xs text-blue-600 hover:opacity-80 lg:text-sm">
              <Link to={'/register'}> Realize seu cadastro </Link>
            </p>
          </span>
        </div>
        {!loading ? (
          <Button
            label="Entrar"
            onClick={() => handleSubmit}
            className="mt-2 w-full rounded-lg bg-blue-700 p-2 text-xl text-white hover:opacity-90"
            type="submit"
          />
        ) : (
          <Button
            label="Entrando..."
            disabled
            className="mt-2 w-full rounded-lg bg-blue-700 p-2 text-xl text-white hover:opacity-90"
            type="submit"
          />
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default LoginForm
