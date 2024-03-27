// Importando estilos do Tailwind CSS diretamente
import 'tailwindcss/tailwind.css'

import React from 'react'

import LoginForm from './form/LoginForm'

const Login: React.FC = () => {
  return (
    <div className="grid h-[88vh] grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center">
        <img
          src="/login-image.svg"
          alt="imagem tela login"
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0% 100%)' }}
          className="object-scale-down"
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 py-10">
        <img
          src="/video-camera128x128.png"
          alt="logo exactus"
          className="w-fit"
        />
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
