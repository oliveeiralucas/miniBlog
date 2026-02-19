import React from 'react'
import { NavLink } from 'react-router-dom'
import { BiLogoGithub, BiLogoInstagram } from 'react-icons/bi'

const Footer: React.FC = () => {
  const linkClass =
    'font-ui text-xs tracking-[0.15em] uppercase text-ed-tm hover:text-ed-accent transition-colors duration-200'

  return (
    <footer className="border-t border-ed-border bg-ed-bg mt-auto">
      <div className="page-wrapper py-10">
        <div className="flex flex-col items-center gap-6">
          <NavLink to="/">
            <span className="font-display text-lg italic text-ed-ts hover:text-ed-tp transition-colors duration-200">
              devlog<span className="text-ed-accent not-italic">.</span>
            </span>
          </NavLink>

          <div className="gold-line" />

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <NavLink to="/" className={linkClass}>Blog</NavLink>
            <NavLink to="/about" className={linkClass}>Sobre</NavLink>
            <NavLink to="/contact" className={linkClass}>Contato</NavLink>
            <NavLink to="/terms" className={linkClass}>Termos</NavLink>
          </nav>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/oliveeiralucas"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-ed-tm hover:text-ed-accent transition-colors duration-200"
            >
              <BiLogoGithub className="text-xl" />
            </a>
            <a
              href="https://instagram.com/oliveeiralucas"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-ed-tm hover:text-ed-accent transition-colors duration-200"
            >
              <BiLogoInstagram className="text-xl" />
            </a>
          </div>

          <p className="font-ui text-xs text-ed-tm tracking-wider">
            © {new Date().getFullYear()} Lucas Oliveira — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
