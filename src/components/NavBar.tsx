import React from 'react'
import { BiLogoBlogger, BiLogOutCircle, BiSearchAlt2 } from 'react-icons/bi'
import { NavLink, useLocation } from 'react-router-dom'

import { useAuthValue } from '@/context/AuthContext'
import { useAuthentication } from '@/hooks/useAuthentication'

const Navbar: React.FC = () => {
  const ActiveStyle = `
    text-blue-600
  `

  const active = useLocation()
  const { logout } = useAuthentication()

  const authValue = useAuthValue()
  const user = authValue?.user

  return (
    <header className="sticky top-0 flex items-center justify-between bg-white p-4 text-white shadow-md">
      {/* titulo */}
      <div>
        <NavLink to={'/'}>
          <div className="flex items-center justify-center">
            <BiLogoBlogger className="mr-2 text-3xl text-blue-600" />
            <h2 className="text-2xl font-extrabold text-black">Blog</h2>
          </div>
        </NavLink>
      </div>
      {/* navegacao */}
      <nav className="inline-flex list-none gap-6 text-base font-semibold text-gray-500">
        <NavLink
          to={'/'}
          className={active.pathname === '/' ? ActiveStyle : ''}
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to={'/about'}
          className={active.pathname === '/about' ? ActiveStyle : ''}
        >
          <li>Sobre</li>
        </NavLink>
        {/* se usuário autenticado */}
        {user && (
          <>
            <NavLink
              to={'/dashboard'}
              className={active.pathname === '/dashboard' ? ActiveStyle : ''}
            >
              <li>Dashboard</li>
            </NavLink>

            <NavLink
              to={'/post/create'}
              className={active.pathname === '/post/create' ? ActiveStyle : ''}
            >
              <li>Criar Post</li>
            </NavLink>
          </>
        )}
      </nav>
      {/* pesquisa + login signup */}
      <div className="flex items-center gap-8">
        <button
          type="submit"
          className="rounded-full border-[0.5px] border-gray-400 p-2 outline outline-offset-1 outline-blue-600 focus:outline-none	"
        >
          <BiSearchAlt2 className="text-xl text-gray-500" />
        </button>
        {/* se não autenticado */}
        {!user && (
          <div className="flex gap-2">
            <NavLink to={'/login'}>
              <button className="rounded-full border border-gray-200 p-2 px-5 py-2.5 text-base font-semibold text-gray-500">
                Log in
              </button>
            </NavLink>
            <NavLink to={'/register'}>
              <button className="rounded-full border bg-blue-600 px-5 py-2.5 text-base font-semibold text-white">
                sign up
              </button>
            </NavLink>
          </div>
        )}
        {/* se autenticado */}
        {user && (
          <div className="flex gap-2">
            <NavLink to={'/profile'}>
              <button className="rounded-full border border-gray-200 p-2 px-5 py-2.5 text-base font-semibold text-gray-500">
                Meu perfil
              </button>
            </NavLink>
            <button
              className="flex items-center gap-2 rounded-full border bg-blue-600 px-5 py-2.5 text-base font-semibold text-white"
              onClick={logout}
            >
              <BiLogOutCircle className="text-lg" />
              logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
