import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BiCalendar,
  BiCategory,
  BiCodeAlt,
  BiHeading,
  BiImageAlt,
  BiLink,
  BiLinkExternal,
  BiLogoGithub,
  BiPlus,
  BiStar,
  BiText,
  BiTag,
  BiTrash,
} from 'react-icons/bi'

import { projectsApi } from '@/api/apiClient'
import type { ProjectCreatePayload, StatItem, TechStackItem } from '@/api/types'
import TagInput from '@/components/TagInput'

const CATEGORIES = ['web-app', 'corporate', 'saas', 'analytics', 'tool', 'other']

const ProjectFormPage: React.FC = () => {
  const { slug: editSlug } = useParams<{ slug?: string }>()
  const isEditing = Boolean(editSlug)
  const navigate = useNavigate()

  const [projectId, setProjectId] = useState('')
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [url, setUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [image, setImage] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [techStack, setTechStack] = useState<TechStackItem[]>([])
  const [techInput, setTechInput] = useState('')
  const [stats, setStats] = useState<StatItem[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [featured, setFeatured] = useState(false)

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditing)
  const [error, setError] = useState('')

  // Load existing project when editing
  useEffect(() => {
    if (!isEditing || !editSlug) return
    projectsApi
      .getBySlug(editSlug)
      .then((project) => {
        setProjectId(project.id)
        setSlug(project.slug)
        setTitle(project.title)
        setTagline(project.tagline)
        setDescription(project.description)
        setCategory(project.category)
        setUrl(project.url)
        setGithubUrl(project.githubUrl ?? '')
        setImage(project.image)
        setTags(project.tags)
        setTechStack(project.techStack as TechStackItem[])
        setStats(project.stats as StatItem[])
        setFeatures(project.features)
        setYear(project.year)
        setFeatured(project.featured)
      })
      .catch(() => setError('Projeto não encontrado.'))
      .finally(() => setFetchLoading(false))
  }, [editSlug, isEditing])

  // Auto-generate slug from title (create mode only)
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 60),
      )
    }
  }, [title, isEditing])

  const addTech = () => {
    const trimmed = techInput.trim()
    if (trimmed && !techStack.find((t) => t.name === trimmed)) {
      setTechStack([...techStack, { name: trimmed }])
    }
    setTechInput('')
  }

  const removeTech = (name: string) => {
    setTechStack(techStack.filter((t) => t.name !== name))
  }

  const addFeature = () => {
    const trimmed = featureInput.trim()
    if (trimmed) setFeatures([...features, trimmed])
    setFeatureInput('')
  }

  const removeFeature = (i: number) => {
    setFeatures(features.filter((_, idx) => idx !== i))
  }

  const addStat = () => {
    setStats([...stats, { label: '', value: '' }])
  }

  const updateStat = (i: number, field: 'label' | 'value', val: string) => {
    setStats(stats.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)))
  }

  const removeStat = (i: number) => {
    setStats(stats.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !slug.trim() || !url.trim() || !image.trim()) {
      setError('Preencha todos os campos obrigatórios (título, slug, URL e imagem).')
      return
    }

    setLoading(true)
    try {
      const payload: ProjectCreatePayload = {
        slug,
        title,
        tagline,
        description,
        category,
        url,
        githubUrl: githubUrl.trim() || undefined,
        image,
        tags,
        techStack,
        stats: stats.filter((s) => s.label && s.value),
        features,
        year,
        featured,
      }
      if (isEditing && projectId) {
        await projectsApi.update(projectId, payload)
      } else {
        await projectsApi.create(payload)
      }
      navigate('/portfolio')
    } catch (err: any) {
      setError(err.message ?? 'Erro ao salvar projeto.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="page-wrapper py-20 space-y-6 animate-pulse">
        <div className="h-4 w-24 bg-ed-elevated rounded-sm" />
        <div className="h-10 w-1/2 bg-ed-elevated rounded-sm" />
        <div className="h-64 bg-ed-elevated rounded-sm" />
      </div>
    )
  }

  return (
    <div className="bg-ed-bg">
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10">
          <p className="section-label mb-2">Admin · Portfólio</p>
          <div className="gold-line mb-4" />
          <h1 className="font-display text-3xl md:text-4xl text-ed-tp">
            {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
          </h1>
        </div>
      </section>

      <div className="page-wrapper py-10">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

          {/* Title */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiHeading className="text-ed-accent text-sm" /> Título *
            </label>
            <input
              className="input-ed font-display text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome do projeto"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiLink className="text-ed-accent text-sm" /> Slug *
            </label>
            <input
              className="input-ed font-ui"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="meu-projeto"
              required
            />
            <p className="font-ui text-xs text-ed-tm mt-1">
              URL: /portfolio/{slug || '...'}
            </p>
          </div>

          {/* Tagline */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiText className="text-ed-accent text-sm" /> Tagline
            </label>
            <input
              className="input-ed"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Descrição curta do projeto"
            />
          </div>

          {/* Category + Year + Featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="section-label flex items-center gap-1.5 mb-2">
                <BiCategory className="text-ed-accent text-sm" /> Categoria *
              </label>
              <select
                className="input-ed"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="section-label flex items-center gap-1.5 mb-2">
                <BiCalendar className="text-ed-accent text-sm" /> Ano *
              </label>
              <input
                className="input-ed"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2000}
                max={2100}
                required
              />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-ed-accent"
                />
                <span className="section-label flex items-center gap-1.5">
                  <BiStar className="text-ed-accent text-sm" /> Destaque
                </span>
              </label>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="section-label flex items-center gap-1.5 mb-2">
                <BiLinkExternal className="text-ed-accent text-sm" /> URL ao vivo *
              </label>
              <input
                className="input-ed"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label className="section-label flex items-center gap-1.5 mb-2">
                <BiLogoGithub className="text-ed-accent text-sm" /> GitHub URL
              </label>
              <input
                className="input-ed"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiImageAlt className="text-ed-accent text-sm" /> URL da imagem *
            </label>
            <input
              className="input-ed"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              required
            />
            {image && (
              <div className="mt-2 overflow-hidden rounded-sm border border-ed-border aspect-video bg-ed-elevated">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiText className="text-ed-accent text-sm" /> Descrição detalhada
            </label>
            <textarea
              className="textarea-ed font-body leading-relaxed"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o projeto em detalhes..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiTag className="text-ed-accent text-sm" /> Tags
            </label>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="react, typescript... (Enter para adicionar)"
            />
          </div>

          {/* Tech stack */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              <BiCodeAlt className="text-ed-accent text-sm" /> Stack Tecnológica
            </label>
            <div className="flex gap-2 mb-2">
              <input
                className="input-ed flex-1"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTech()
                  }
                }}
                placeholder="React, FastAPI, PostgreSQL..."
              />
              <button type="button" onClick={addTech} className="btn-ghost text-xs px-3">
                <BiPlus />
              </button>
            </div>
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <span
                    key={t.name}
                    className="flex items-center gap-1 tag-ed"
                  >
                    {t.name}
                    <button
                      type="button"
                      onClick={() => removeTech(t.name)}
                      className="hover:text-ed-tp transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="section-label">Métricas / Stats</label>
              <button
                type="button"
                onClick={addStat}
                className="btn-ghost text-xs px-3"
              >
                <BiPlus /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {stats.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="input-ed flex-1"
                    placeholder="Label (ex: Usuários)"
                    value={s.label}
                    onChange={(e) => updateStat(i, 'label', e.target.value)}
                  />
                  <input
                    className="input-ed flex-1"
                    placeholder="Valor (ex: 10k+)"
                    value={s.value}
                    onChange={(e) => updateStat(i, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="p-2 text-ed-tm hover:text-red-400 border border-transparent hover:border-red-900/40 rounded-sm transition-colors"
                  >
                    <BiTrash className="text-base" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="section-label flex items-center gap-1.5 mb-2">
              Funcionalidades
            </label>
            <div className="flex gap-2 mb-2">
              <input
                className="input-ed flex-1"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFeature()
                  }
                }}
                placeholder="Descreva uma funcionalidade..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="btn-ghost text-xs px-3"
              >
                <BiPlus />
              </button>
            </div>
            <ul className="space-y-1">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2 font-body text-sm text-ed-ts px-3 py-2 bg-ed-elevated rounded-sm border border-ed-border"
                >
                  <span>
                    <span className="text-ed-accent mr-2">—</span>
                    {f}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-ed-tm hover:text-red-400 transition-colors"
                  >
                    <BiTrash className="text-sm" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error && (
            <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-ed-border">
            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex-1"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-ed-bg border-t-transparent animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                'Salvar alterações'
              ) : (
                'Publicar projeto'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="btn-ghost"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectFormPage
