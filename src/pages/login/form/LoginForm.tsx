// LoginForm.tsx
import 'primereact/resources/themes/lara-light-cyan/theme.css'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginForm: React.FC = () => {
  const [user, setUser] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(user)
    console.log(password)
  }
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
            className="p-2 text-black outline outline-2 outline-gray-200	"
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
            className="p-2 text-black outline outline-2 outline-gray-200"
          />
        </div>

        <div className="flex py-2 text-xs text-gray-400 lg:text-sm">
          Não possui conta?
          <span className="pl-1">
            <p className="text-xs text-blue-600 lg:text-sm">
              <Link to={'/register'}> Realize seu cadastro </Link>
            </p>
          </span>
        </div>

        <Button
          label="Entrar"
          className="mt-2 w-full rounded-lg bg-blue-700 p-2 text-xl text-white"
          type="submit"
        />
      </form>
    </div>
  )
}

export default LoginForm
