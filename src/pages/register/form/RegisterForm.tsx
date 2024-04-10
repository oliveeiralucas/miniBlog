// LoginForm.tsx
import 'primereact/resources/themes/lara-light-cyan/theme.css'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { db } from '@/firebase/config'
import { useAuthentication } from '@/hooks/useAuthentication'
import { UserData } from '@/interface/UserData'

const RegisterForm: React.FC = () => {
  const [user, setUser] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    db.app
  }, [])

  const { createUser, error: authError, loading } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    if (password !== confirmPassword) {
      setError('As senhas precisam coincidir')
      return
    }

    const userFirebase: UserData = {
      user,
      email,
      password
    }

    const res = await createUser(userFirebase)

    console.log(res)
  }
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])
  return (
    <div className="w-8/12">
      <h2 className="py-2 text-left text-2xl font-semibold text-gray-500">
        Cadastrar no <span className="text-blue-600">Blog</span>
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col py-2 text-xs font-semibold sm:text-sm">
          <InputText
            type="text"
            id="user"
            required
            name="user"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>
        <div className="flex flex-col py-2 text-xs font-semibold sm:text-sm">
          <InputText
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>
        <div className="flex flex-col py-2 text-xs font-semibold sm:text-sm">
          <InputText
            type="password"
            id="password"
            name="password"
            value={password}
            required
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>
        <div className="flex flex-col py-2 text-xs font-semibold sm:text-sm">
          <InputText
            type="password"
            required
            id="confirmPassword"
            name="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 text-gray-600 outline outline-2 outline-gray-300"
          />
        </div>

        <div className="flex py-2 text-xs text-gray-500 lg:text-sm">
          Já possui conta?
          <span className="pl-1">
            <p className="text-xs text-blue-600 hover:opacity-80 lg:text-sm">
              <Link to={'/login'}> Realize seu login </Link>
            </p>
          </span>
        </div>
        {!loading ? (
          <Button
            label="Cadastrar"
            className="mt-2 w-full rounded-lg bg-blue-700 p-2 text-xl text-white hover:opacity-90"
            onClick={() => handleSubmit}
          />
        ) : (
          <Button
            label="Cadastrando..."
            className="mt-2 w-full rounded-lg bg-blue-700 p-2 text-xl text-white hover:opacity-90"
            type="submit"
            disabled
          />
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default RegisterForm
