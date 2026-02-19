import React, { FormEvent, useState } from 'react'
import {
  BiLogOutCircle,
  BiSearchAlt2,
  BiMenuAltRight,
  BiX,
} from 'react-icons/bi'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAuthValue } from '@/context/AuthContext'
import { useAuthentication } from '@/hooks/useAuthentication'

import ModalSearch from './ModalSearch'

const Navbar: React.FC = () => {
  const location = useLocation()
  const { logout } = useAuthentication()
  const { user, setUser } = useAuthValue()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/')
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setModalOpen(false)
    if (query.trim()) navigate(`/search?q=${query.trim()}`)
  }

  const navLinkClass = (path: string) => {
    const isActive =
      path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(path)
    return `relative font-ui text-xs tracking-[0.18em] uppercase transition-colors duration-200
      ${isActive ? 'text-ed-accent' : 'text-ed-ts hover:text-ed-tp'}
      after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-ed-accent
      after:scale-x-0 after:transition-transform after:duration-300 after:origin-left
      ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'}`
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-ed-bg border-b border-ed-border">
        <div className="page-wrapper flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="shrink-0">
            <span className="font-display text-xl italic text-ed-tp hover:text-ed-tp transition-opacity duration-200 hover:opacity-80">
              devlog<span className="text-ed-accent not-italic">.</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass('/')}>Home</NavLink>
            <NavLink to="/about" className={navLinkClass('/about')}>Sobre</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</NavLink>
                <NavLink to="/post/create" className={navLinkClass('/post/create')}>Escrever</NavLink>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-sm text-ed-ts hover:text-ed-tp border border-transparent hover:border-ed-border transition-all duration-200"
              aria-label="Pesquisar"
            >
              <BiSearchAlt2 className="text-lg" />
            </button>

            {!user ? (
              <div className="flex items-center gap-2">
                <NavLink to="/login">
                  <button className="btn-ghost text-xs">Entrar</button>
                </NavLink>
                <NavLink to="/register">
                  <button className="btn-gold text-xs">Cadastrar</button>
                </NavLink>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 font-ui text-xs tracking-wide text-ed-ts hover:text-red-400 border border-ed-border hover:border-red-900/60 px-3 py-2 rounded-sm transition-all duration-200"
              >
                <BiLogOutCircle className="text-base" />
                Sair
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ed-ts hover:text-ed-tp transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <BiX className="text-xl" /> : <BiMenuAltRight className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-ed-border bg-ed-surface animate-fade-in">
            <div className="page-wrapper py-4 flex flex-col gap-4">
              <NavLink
                to="/"
                className={navLinkClass('/')}
                onClick={() => setMobileOpen(false)}
              >Home</NavLink>
              <NavLink
                to="/about"
                className={navLinkClass('/about')}
                onClick={() => setMobileOpen(false)}
              >Sobre</NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                  <NavLink to="/post/create" className={navLinkClass('/post/create')} onClick={() => setMobileOpen(false)}>Escrever</NavLink>
                </>
              )}
              <div className="pt-2 border-t border-ed-border flex items-center gap-3">
                <button onClick={() => { setModalOpen(true); setMobileOpen(false) }} className="btn-ghost text-xs">
                  <BiSearchAlt2 />Buscar
                </button>
                {!user ? (
                  <>
                    <NavLink to="/login" onClick={() => setMobileOpen(false)}><button className="btn-ghost text-xs">Entrar</button></NavLink>
                    <NavLink to="/register" onClick={() => setMobileOpen(false)}><button className="btn-gold text-xs">Cadastrar</button></NavLink>
                  </>
                ) : (
                  <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="btn-danger text-xs">
                    <BiLogOutCircle />Sair
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {modalOpen && (
        <ModalSearch onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              autoFocus
              type="text"
              className="input-ed flex-1"
              placeholder="Busque por tags ou termos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-gold px-4">
              <BiSearchAlt2 className="text-base" />
            </button>
          </form>
          <p className="mt-3 section-label">pressione enter para buscar</p>
        </ModalSearch>
      )}
    </>
  )
}

export default Navbar
