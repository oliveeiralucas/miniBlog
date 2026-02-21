import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiImageAlt, BiText, BiTag, BiHeading } from 'react-icons/bi'

import ImageAiGenerator from '@/components/ImageAiGenerator'
import TagInput from '@/components/TagInput'
import { useAuthValue } from '@/context/AuthContext'
import { useInsertDocument } from '@/hooks/useInsertDocument'

const FormCreatePost: React.FC = () => {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [imageData, setImageData] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [formError, setFormError] = useState('')

  const authValue = useAuthValue()
  const user = authValue?.user
  const navigate = useNavigate()

  const { insertDocument, response } = useInsertDocument('posts')

  const previewSrc = imageData
    ? `data:image/png;base64,${imageData}`
    : image || ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')

    if (!imageData && !image.trim()) {
      setFormError('Adicione uma URL de imagem ou gere uma imagem com IA.')
      return
    }

    if (!imageData && image.trim()) {
      try {
        new URL(image)
      } catch {
        setFormError('A imagem precisa ser uma URL válida.')
        return
      }
    }

    if (!title.trim() || tags.length === 0 || !body.trim()) {
      setFormError('Por favor preencha todos os campos.')
      return
    }

    const ok = await insertDocument({
      title: title.trim(),
      image: image.trim(),
      image_data: imageData || undefined,
      body: body.trim(),
      tags,
      uid: user?.uid,
      createdBy: user?.displayName,
    })

    if (ok) navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="section-label flex items-center gap-1.5 mb-2">
          <BiHeading className="text-ed-accent text-sm" />
          Título
        </label>
        <input
          type="text"
          placeholder="Um título que chame atenção..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input-ed font-display text-lg"
        />
      </div>

      {/* Image URL + AI Generator */}
      <div>
        <label className="section-label flex items-center gap-1.5 mb-2">
          <BiImageAlt className="text-ed-accent text-sm" />
          URL da imagem
        </label>
        <input
          type="text"
          placeholder="https://exemplo.com/imagem.jpg"
          value={image}
          onChange={(e) => {
            setImage(e.target.value)
            if (e.target.value) setImageData('')
          }}
          className="input-ed"
        />

        <ImageAiGenerator
          formFields={{ title, body, tags }}
          onImageGenerated={(b64) => {
            setImageData(b64)
            setImage('')
          }}
        />

        {previewSrc && (
          <div className="mt-3 overflow-hidden rounded-sm border border-ed-border aspect-video">
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div>
        <label className="section-label flex items-center gap-1.5 mb-2">
          <BiText className="text-ed-accent text-sm" />
          Conteúdo
        </label>
        <textarea
          placeholder="Escreva o conteúdo do seu artigo..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={12}
          className="textarea-ed font-body leading-relaxed"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="section-label flex items-center gap-1.5 mb-2">
          <BiTag className="text-ed-accent text-sm" />
          Tags
        </label>
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="react, javascript, web... (Enter para adicionar)"
        />
        <p className="font-ui text-xs text-ed-tm mt-1.5">
          Pressione Enter ou vírgula para adicionar cada tag
        </p>
      </div>

      {/* Error */}
      {(!!formError || !!response.error) && (
        <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm">
          {formError || String(response.error)}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={response.loading ?? false}
        className="btn-gold w-full"
      >
        {response.loading ? (
          <>
            <div className="h-4 w-4 rounded-full border-2 border-ed-bg border-t-transparent animate-spin" />
            Publicando...
          </>
        ) : (
          'Publicar artigo'
        )}
      </button>
    </form>
  )
}

export default FormCreatePost
