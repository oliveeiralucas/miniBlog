import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack, BiLinkExternal, BiLogoGithub, BiPencil, BiTrash } from 'react-icons/bi'

import { projectsApi } from '@/api/apiClient'
import type { ApiProject } from '@/api/types'
import { useAuthValue } from '@/context/AuthContext'

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ApiProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuthValue()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!project || !confirm(`Excluir "${project.title}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(true)
    try {
      await projectsApi.delete(project.id)
      navigate('/portfolio')
    } catch {
      // silencioso
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!slug) return
    projectsApi
      .getBySlug(slug)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="page-wrapper py-20 space-y-6 animate-pulse">
        <div className="h-4 w-24 bg-ed-elevated rounded-sm" />
        <div className="h-10 w-1/2 bg-ed-elevated rounded-sm" />
        <div className="aspect-video bg-ed-elevated rounded-sm" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="page-wrapper py-20 text-center">
        <p className="font-display text-2xl text-ed-ts mb-6">
          Projeto não encontrado.
        </p>
        <Link
          to="/portfolio"
          className="btn-ghost text-xs inline-flex items-center gap-1.5"
        >
          <BiArrowBack /> Voltar ao portfólio
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-ed-bg">
      {/* Header */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1 font-ui text-xs text-ed-ts hover:text-ed-accent transition-colors mb-6"
          >
            <BiArrowBack /> Portfólio
          </Link>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="section-label mb-2">
                {project.category} · {project.year}
              </p>
              <div className="gold-line mb-4" />
              <h1 className="font-display text-4xl md:text-5xl text-ed-tp leading-tight mb-3">
                {project.title}
              </h1>
              <p className="font-body text-lg text-ed-ts">{project.tagline}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="btn-gold text-xs"
              >
                <BiLinkExternal /> Ver ao vivo
              </a>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-xs"
                >
                  <BiLogoGithub /> GitHub
                </a>
              )}
              {user?.isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/projects/edit/${project.slug}`)}
                    className="btn-ghost text-xs"
                  >
                    <BiPencil /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-ghost text-xs text-red-400 hover:border-red-900/40 disabled:opacity-40"
                  >
                    {deleting ? (
                      <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <BiTrash className="text-sm" />
                    )}
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <div className="border-b border-ed-border">
        <div className="page-wrapper py-8">
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-sm border border-ed-border object-cover max-h-[520px]"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="page-wrapper py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <div>
            <p className="section-label mb-4">Sobre o Projeto</p>
            <div className="gold-line mb-6" />
            <p className="font-body text-base text-ed-ts leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Features */}
          {project.features.length > 0 && (
            <div>
              <p className="section-label mb-4">Funcionalidades</p>
              <div className="gold-line mb-6" />
              <ul className="space-y-3">
                {project.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 font-body text-sm text-ed-ts"
                  >
                    <span className="text-ed-accent mt-0.5 shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Stats */}
          {project.stats.length > 0 && (
            <div>
              <p className="section-label mb-4">Métricas</p>
              <div className="space-y-3">
                {project.stats.map((s) => (
                  <div key={s.label} className="card-ed p-4">
                    <div className="font-display text-2xl text-ed-accent">
                      {s.value}
                    </div>
                    <div className="font-ui text-xs text-ed-tm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech stack */}
          {project.techStack.length > 0 && (
            <div>
              <p className="section-label mb-4">Stack Tecnológica</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((t) => (
                  <span key={t.name} className="tag-ed">
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <div>
              <p className="section-label mb-4">Tags</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="tag-ed">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
