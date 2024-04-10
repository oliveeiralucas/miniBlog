// Importando estilos do Tailwind CSS diretamente
import 'tailwindcss/tailwind.css'

import React from 'react'
import { BiLogoBlogger } from 'react-icons/bi'

import RegisterForm from './form/RegisterForm'

const Register: React.FC = () => {
  return (
    <div className="grid h-full grid-cols-1 overflow-y-scroll md:h-[88vh] md:grid-cols-2 md:overflow-y-hidden">
      <div className="mx-auto flex w-9/12 items-center justify-center">
        <img
          src="/register-image.svg"
          alt="imagem tela login"
          className="object-scale-down"
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 py-10">
        <BiLogoBlogger className="text-8xl text-blue-800" />
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register
