import React, { useState } from 'react'
import { BiBoltCircle, BiImageAlt, BiRefresh } from 'react-icons/bi'

import { imageAiApi } from '@/api/apiClient'

interface FormFields {
  title: string
  body: string
  tags: string[]
  category?: string
}

interface Props {
  formFields: FormFields
  onImageGenerated: (base64: string) => void
}

type Step = 'idle' | 'generating_prompt' | 'prompt_ready' | 'generating_image'

const ImageAiGenerator: React.FC<Props> = ({ formFields, onImageGenerated }) => {
  const [step, setStep] = useState<Step>('idle')
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState('')

  const handleGeneratePrompt = async () => {
    setError('')
    setStep('generating_prompt')
    try {
      const res = await imageAiApi.generatePrompt({
        title: formFields.title,
        body: formFields.body,
        tags: formFields.tags,
        category: formFields.category,
      })
      setPrompt(res.prompt)
      setStep('prompt_ready')
    } catch (err: any) {
      setError(err.message ?? 'Erro ao gerar prompt.')
      setStep('idle')
    }
  }

  const handleGenerateImage = async () => {
    setError('')
    setStep('generating_image')
    try {
      const res = await imageAiApi.generateImage({ prompt })
      onImageGenerated(res.image_data)
      setStep('prompt_ready')
    } catch (err: any) {
      setError(err.message ?? 'Erro ao gerar imagem.')
      setStep('prompt_ready')
    }
  }

  const handleReset = () => {
    setStep('idle')
    setPrompt('')
    setError('')
  }

  return (
    <div className="mt-3 border border-dashed border-ed-border rounded-sm p-3 space-y-3">
      <p className="section-label flex items-center gap-1.5">
        <BiBoltCircle className="text-ed-accent text-sm" />
        Gerar imagem com IA
      </p>

      {step === 'idle' && (
        <button
          type="button"
          onClick={handleGeneratePrompt}
          disabled={!formFields.title.trim()}
          className="btn-ghost text-xs w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <BiBoltCircle className="text-sm" />
          Criar prompt a partir dos campos preenchidos
        </button>
      )}

      {step === 'generating_prompt' && (
        <div className="flex items-center gap-2 font-ui text-xs text-ed-ts py-2">
          <div className="h-3.5 w-3.5 rounded-full border border-ed-accent border-t-transparent animate-spin" />
          Gerando prompt com Gemini…
        </div>
      )}

      {(step === 'prompt_ready' || step === 'generating_image') && (
        <div className="space-y-2">
          <label className="font-ui text-xs text-ed-ts">
            Prompt gerado — edite se quiser antes de gerar:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="textarea-ed font-body text-xs leading-relaxed"
            disabled={step === 'generating_image'}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={step === 'generating_image' || !prompt.trim()}
              className="btn-gold text-xs flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'generating_image' ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-ed-bg border-t-transparent animate-spin" />
                  Gerando imagem…
                </>
              ) : (
                <>
                  <BiImageAlt className="text-sm" />
                  Gerar imagem
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={step === 'generating_image'}
              className="btn-ghost text-xs disabled:opacity-40"
              title="Recomeçar"
            >
              <BiRefresh className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm">
          {error}
        </p>
      )}
    </div>
  )
}

export default ImageAiGenerator
