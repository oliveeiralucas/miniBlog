import React from 'react'
import { NavLink } from 'react-router-dom'

import LoginForm from './form/LoginForm'

const Login: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-ed-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-up">
        {/* Card */}
        <div className="bg-ed-surface border border-ed-border rounded-sm overflow-hidden">
          {/* Gold top accent */}
          <div className="h-px bg-ed-accent" />

          <div className="px-8 py-10">
            {/* Logo */}
            <div className="text-center mb-8">
              <NavLink to="/">
                <span className="font-display text-2xl italic text-ed-tp hover:opacity-80 transition-opacity">
                  devlog<span className="text-ed-accent not-italic">.</span>
                </span>
              </NavLink>
            </div>

            <LoginForm />
          </div>
        </div>

        <p className="text-center mt-4 font-ui text-xs text-ed-tm">
          Não possui conta?{' '}
          <NavLink
            to="/register"
            className="text-ed-accent hover:text-ed-ah transition-colors"
          >
            Cadastre-se
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default Login
