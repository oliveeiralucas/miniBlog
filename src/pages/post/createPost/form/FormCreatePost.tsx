import { Button } from 'primereact/button'
import { Chips, ChipsChangeEvent } from 'primereact/chips'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import React, { useState } from 'react'
import { BiLogoBlogger } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

import { useAuthValue } from '@/context/AuthContext'
import { useInsertDocument } from '@/hooks/useInsertDocument'

const FormCreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [body, setBody] = useState<string>('')

  const [tags, setTags] = useState<string[]>([])
  const [formError, setFormError] = useState<string>('')

  const authValue = useAuthValue()
  const user = authValue?.user

  const navigate = useNavigate()

  const { insertDocument, response } = useInsertDocument('posts')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    try {
      new URL(image)
    } catch (error) {
      setFormError('A imagem precisa ser uma URL')
    }

    const tagsArray = tags
      .join(',')
      .split(',')
      .map((tag) => tag.trim().toLowerCase())

    if (!title || !image || !tags || !body) {
      setFormError('Por favor preencha todos os campos!')
    }

    if (formError) return

    insertDocument({
      title,
      image,
      body,
      tags: tagsArray,
      uid: user?.uid,
      createdBy: user?.displayName
    })

    // redirect to home page
    navigate('/')
  }

  return (
    <form
      className="flex w-3/5 flex-col items-center justify-center rounded-3xl border border-gray-500 bg-white p-4 shadow-lg"
      onSubmit={handleSubmit}
    >
      <p className="flex items-center gap-2 py-4 text-2xl font-extrabold">
        URBlog
        <BiLogoBlogger className="text-3xl text-blue-700" />
      </p>
      <div className="flex w-4/5 flex-col pt-2 text-left text-xs font-semibold sm:text-sm">
        {/* titulo */}
        <p className="mb-2 text-base font-semibold	tracking-wide">
          Insira o título
        </p>
        <InputText
          type="text"
          id="title"
          name="title"
          placeholder="Insira o Título do post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 text-gray-600 outline outline-2 outline-gray-300 placeholder:font-normal placeholder:text-gray-500"
        />
        {/* image */}
        <p className="mb-2 pt-6 text-base	font-semibold tracking-wide">
          Insira a url da imagem
        </p>
        <InputText
          type="text"
          id="image"
          name="image"
          placeholder="Insira a imagem do post"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="p-2 text-gray-600 outline outline-2 outline-gray-300 placeholder:font-normal placeholder:text-gray-500"
        />{' '}
        {/* Conteúdo */}
        <p className="mb-2 pt-6 text-base	font-semibold tracking-wide">
          Insira o conteúdo da postagem
        </p>
        <InputTextarea
          id="body"
          name="body"
          placeholder="Insira o conteúdo da postagem"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBody(e.target.value)
          }
          rows={5}
          cols={30}
          className="p-2 text-gray-600 outline outline-2 outline-gray-300 placeholder:font-normal placeholder:text-gray-500"
        />
        {/* tags */}
        <p className="mb-2 pt-6 text-base	font-semibold tracking-wide">
          Insira as tags
        </p>
        <Chips
          id="tag"
          name="tag"
          placeholder="Insira as tags da postagem"
          value={tags}
          pt={{
            root: { className: 'flex' },
            container: { className: 'flex-1 text-gray-600' },
            token: { className: 'bg-primary' }
          }}
          onChange={(e: ChipsChangeEvent) => {
            if (e.value !== null && e.value !== undefined) {
              setTags(e.value)
            }
          }}
          className="w-full rounded-lg p-2 text-gray-600 outline outline-2 outline-gray-300 placeholder:text-sm placeholder:font-normal placeholder:text-gray-500"
        />
      </div>
      {!response.loading && (
        <Button
          label="Criar Post"
          type="submit"
          className="my-6 flex w-4/5 items-center justify-center gap-2 rounded-full border bg-blue-600 px-5 py-2.5 text-base font-semibold text-white"
        />
      )}
      {response.loading && (
        <button
          className="my-6 flex w-4/5 items-center justify-center gap-2 rounded-full border bg-blue-600 px-5 py-2.5 text-base font-semibold text-white"
          disabled
        >
          Aguarde.. .
        </button>
      )}
      {(response.error || formError) && <p>{formError}</p>}
    </form>
  )
}

export default FormCreatePost
