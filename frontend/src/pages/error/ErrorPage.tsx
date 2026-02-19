import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack, BiHome } from 'react-icons/bi'

const ErrorPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-ed-bg flex items-center justify-center px-4">
      <div className="text-center animate-fade-up max-w-lg">
        {/* 404 display */}
        <div className="relative mb-8 select-none">
          <span className="font-display text-[10rem] md:text-[14rem] leading-none text-ed-border font-bold block">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="gold-line w-24 mx-auto" />
          </div>
        </div>

        <p className="section-label mb-3">Página não encontrada</p>
        <h1 className="font-display text-3xl md:text-4xl text-ed-tp mb-4 italic">
          Este caminho não existe
        </h1>
        <p className="font-body text-sm text-ed-ts mb-10 leading-relaxed">
          A página que você está procurando foi movida, removida,<br className="hidden md:block" />
          ou simplesmente nunca existiu.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost text-sm"
          >
            <BiArrowBack className="text-base" />
            Voltar
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-gold text-sm"
          >
            <BiHome className="text-base" />
            Página inicial
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
