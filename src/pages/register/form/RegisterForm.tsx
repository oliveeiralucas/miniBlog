// RegisterForm.tsx
import 'primereact/resources/themes/lara-light-cyan/theme.css'

import { Toast } from 'primereact/toast'
import React, { useEffect, useRef, useState } from 'react'
import { BiArrowBack, BiLockAlt, BiUser, BiEnvelope } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

import { useAuthValue } from '@/context/AuthContext'
import { useAuthentication } from '@/hooks/useAuthentication'
import { UserData } from '@/interface/UserData'

const RegisterForm: React.FC = () => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const toast = useRef<Toast>(null)
  const navigate = useNavigate()
  const { setUser: setAuthUser } = useAuthValue()

  const { createUser, error: authError, loading } = useAuthentication()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      const msg = 'As senhas precisam coincidir'
      setError(msg)
      toast.current?.show({ severity: 'error', summary: 'Atenção', detail: msg, life: 4000 })
      return
    }

    const userData: UserData = { user, email, password }
    const newUser = await createUser(userData)
    setAuthUser(newUser)
    navigate('/')
  }

  useEffect(() => {
    if (authError) {
      setError(authError)
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: authError, life: 4000 })
    }
  }, [authError])

  return (
    <div>
      <Toast ref={toast} />

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 section-label hover:text-ed-accent transition-colors duration-200 mb-6"
      >
        <BiArrowBack className="text-sm" />
        Voltar
      </button>

      <div className="gold-line mb-6" />
      <h2 className="font-display text-2xl text-ed-tp mb-2">
        Criar conta
      </h2>
      <p className="font-body text-sm text-ed-ts mb-8">
        Cadastre-se para publicar seus próprios artigos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="section-label block mb-2">Usuário</label>
          <div className="relative">
            <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ed-tm text-base pointer-events-none" />
            <input
              type="text"
              placeholder="seu nome de usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              className="input-ed pl-9"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="section-label block mb-2">Email</label>
          <div className="relative">
            <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-ed-tm text-base pointer-events-none" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-ed pl-9"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="section-label block mb-2">Senha</label>
          <div className="relative">
            <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-ed-tm text-base pointer-events-none" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-ed pl-9"
            />
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label className="section-label block mb-2">Confirmar Senha</label>
          <div className="relative">
            <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-ed-tm text-base pointer-events-none" />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-ed pl-9"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full mt-2"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-ed-bg border-t-transparent animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm
