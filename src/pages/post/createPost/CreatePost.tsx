import React from 'react'
import { BiWorld } from 'react-icons/bi'

import FormCreatePost from './form/FormCreatePost'

const CreatePost: React.FC = () => {
  return (
    <div className="flex size-full flex-col  items-center bg-gray-100 pb-36">
      <p className="flex justify-start gap-2 pt-10 text-4xl font-extrabold">
        Encante o
        <span className="flex gap-2 text-blue-700">
          MUNDO <BiWorld />
        </span>
      </p>
      <p className="py-2 pb-6 text-xl">Crie sua próxima postagem</p>
      <FormCreatePost />
    </div>
  )
}

export default CreatePost
